// services/autoJobService.js
import axios from "axios";
import * as cheerio from "cheerio";
import Job from "../models/Job.js";
import { Op } from "sequelize";

class AutoJobService {
  constructor() {
    // Configure axios with defaults
    this.axiosInstance = axios.create({
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    this.sources = {
      internshala: this.scrapeInternshala.bind(this),
      remoteok: this.scrapeRemoteOk.bind(this),
      wellfound: this.scrapeWellfound.bind(this),
    };

    // Rate limiting
    this.lastRequestTime = {};
    this.minRequestDelay = 2000; // 2 seconds between requests to same source
  }

  // Main scraping function with parallel processing
  async scrapeAllJobs() {
    const results = {
      totalFound: 0,
      totalAdded: 0,
      errors: [],
      details: {},
      startTime: new Date(),
    };

    try {
      // Run scrapers in parallel with Promise.allSettled
      const scraperPromises = Object.entries(this.sources).map(
        async ([sourceName, scraper]) => {
          try {
            console.log(`🔄 Scraping from ${sourceName}...`);
            const sourceResults = await this.withRetry(
              () => scraper(),
              3,
              sourceName
            );
            return { sourceName, sourceResults };
          } catch (error) {
            console.error(`❌ Error scraping ${sourceName}:`, error.message);
            return {
              sourceName,
              error: error.message,
              sourceResults: { found: 0, added: 0 },
            };
          }
        }
      );

      const settledResults = await Promise.allSettled(scraperPromises);

      // Process results
      settledResults.forEach((result) => {
        if (result.status === "fulfilled") {
          const { sourceName, sourceResults, error } = result.value;
          results.details[sourceName] = sourceResults;
          results.totalFound += sourceResults.found;
          results.totalAdded += sourceResults.added;

          if (error) {
            results.errors.push({ source: sourceName, error });
          }
        } else {
          results.errors.push({
            source: "unknown",
            error: result.reason?.message || "Unknown error",
          });
        }
      });

      results.endTime = new Date();
      results.duration = results.endTime - results.startTime;

      console.log(`✅ Scraping completed in ${results.duration}ms`);
      return results;
    } catch (error) {
      console.error("❌ Scraping failed:", error);
      throw error;
    }
  }

  // Retry wrapper with exponential backoff
  async withRetry(fn, maxRetries = 3, sourceName = "unknown") {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Rate limiting
        await this.enforceRateLimit(sourceName);

        const result = await fn();
        return result;
      } catch (error) {
        lastError = error;
        console.log(
          `⚠️ Attempt ${attempt}/${maxRetries} failed for ${sourceName}: ${error.message}`
        );

        if (attempt < maxRetries) {
          // Exponential backoff: 2s, 4s, 8s
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await this.delay(delay);
        }
      }
    }

    throw lastError;
  }

  // Rate limiting enforcement
  async enforceRateLimit(sourceName) {
    const now = Date.now();
    const lastRequest = this.lastRequestTime[sourceName] || 0;
    const timeSinceLastRequest = now - lastRequest;

    if (timeSinceLastRequest < this.minRequestDelay) {
      const waitTime = this.minRequestDelay - timeSinceLastRequest;
      await this.delay(waitTime);
    }

    this.lastRequestTime[sourceName] = Date.now();
  }

  // Improved Internshala Scraper
  async scrapeInternshala() {
    const results = { found: 0, added: 0, errors: [] };

    try {
      const keywords = [
        "software",
        "developer",
        "web",
        "react",
        "node",
        "python",
      ];
      const jobs = [];

      // Process keywords in parallel with limited concurrency
      const batchSize = 2;
      for (let i = 0; i < keywords.length; i += batchSize) {
        const batch = keywords.slice(i, i + batchSize);

        const batchPromises = batch.map(async (keyword) => {
          try {
            return await this.scrapeInternshalaKeyword(keyword);
          } catch (error) {
            console.error(`Error scraping keyword ${keyword}:`, error.message);
            results.errors.push({ keyword, error: error.message });
            return [];
          }
        });

        const batchResults = await Promise.all(batchPromises);
        jobs.push(...batchResults.flat());

        // Delay between batches
        if (i + batchSize < keywords.length) {
          await this.delay(3000);
        }
      }

      results.found = jobs.length;
      results.added = await this.saveJobsBatch(jobs);
    } catch (error) {
      console.error("Internshala scraping error:", error.message);
      results.errors.push({ general: error.message });
    }

    return results;
  }

  async scrapeInternshalaKeyword(keyword) {
    const url = `https://internshala.com/internships/${keyword}-internship`;
    const jobs = [];

    try {
      const response = await this.axiosInstance.get(url);
      const $ = cheerio.load(response.data);

      $(".internship_meta").each((index, element) => {
        if (index < 5) {
          const $el = $(element);
          const title =
            $el.find(".profile span")?.text()?.trim() || `${keyword} Intern`;
          const company =
            $el.find(".company_name")?.text()?.trim() || "Company";
          const location =
            $el.find(".location_link")?.text()?.trim() || "Remote";

          if (title && company) {
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 30);

            jobs.push({
              title: `${title} - ${company}`,
              company: company,
              type: "internship",
              location: location,
              salary: "See description",
              experience: "0-1 years",
              applicationDeadline: deadline,
              postedDate: new Date(),
              verified: true,
              userType: "Auto",
              email: "careers@company.com",
              description: `Internship opportunity at ${company} for ${title}. Location: ${location}. Apply now!`,
              requiredSkills: this.extractSkills(title + " " + keyword),
              qualifications: ["Currently enrolled in degree program"],
              category: this.categorizeJob(title),
              source: "internshala",
              sourceId: `internshala_${keyword}_${Date.now()}_${index}`,
              sourceUrl: url,
              isAutoPosted: true,
              applyLink: url,
              status: "active",
            });
          }
        }
      });
    } catch (error) {
      console.error(
        `Error scraping Internshala keyword ${keyword}:`,
        error.message
      );
      throw error;
    }

    return jobs;
  }

  // Improved RemoteOK Scraper using their API
  async scrapeRemoteOk() {
    const results = { found: 0, added: 0 };

    try {
      // RemoteOK provides a JSON API
      const response = await this.axiosInstance.get("https://remoteok.com/api");

      // First item is metadata, skip it
      const jobsData = response.data.slice(1, 11); // Get top 10 jobs

      const jobs = jobsData
        .filter((job) => job && job.position && job.company)
        .map((job) => {
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + 45);

          return {
            title: job.position,
            company: job.company,
            type: "remote",
            location: job.location || "Remote",
            salary: job.salary || "Competitive",
            experience: "2-4 years",
            applicationDeadline: deadline,
            postedDate: new Date(job.date || Date.now()),
            verified: true,
            userType: "Auto",
            email: "hr@company.com",
            description: job.description || `Remote position at ${job.company}`,
            requiredSkills: job.tags ? job.tags.slice(0, 5) : ["Remote Work"],
            qualifications: ["Bachelor's degree in relevant field"],
            category: this.categorizeJob(job.position),
            source: "remoteok",
            sourceId: `remoteok_${job.id || Date.now()}`,
            sourceUrl: job.url || "https://remoteok.com/",
            isAutoPosted: true,
            applyLink: job.apply_url || job.url || "https://remoteok.com/",
            status: "active",
          };
        });

      results.found = jobs.length;
      results.added = await this.saveJobsBatch(jobs);
    } catch (error) {
      console.error("RemoteOK scraping error:", error.message);
    }

    return results;
  }

  // Improved Wellfound Scraper (using sample data - real API requires authentication)
  async scrapeWellfound() {
    const results = { found: 0, added: 0 };

    try {
      // Note: Wellfound (formerly AngelList) requires API key for real data
      // This is a sample implementation
      const startupJobs = [
        {
          title: "Frontend Engineer - Startup",
          company: "Innovative Startup",
          type: "full-time",
          location: "San Francisco/Remote",
          salary: "Competitive",
          experience: "1-3 years",
          description:
            "Build amazing products with our fast-growing startup...",
          skills: ["React", "TypeScript", "CSS"],
        },
        {
          title: "Backend Engineer - SaaS",
          company: "Tech Startup Inc",
          type: "full-time",
          location: "Remote",
          salary: "$90k-$130k",
          experience: "2-4 years",
          description: "Join our team building scalable backend systems...",
          skills: ["Node.js", "PostgreSQL", "AWS"],
        },
      ];

      const jobs = startupJobs.map((job, index) => {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 60);

        return {
          title: job.title,
          company: job.company,
          type: job.type,
          location: job.location,
          salary: job.salary,
          experience: job.experience,
          applicationDeadline: deadline,
          postedDate: new Date(),
          verified: true,
          userType: "Auto",
          email: "talent@startup.com",
          description: job.description,
          requiredSkills: job.skills,
          qualifications: ["Experience in fast-paced environment"],
          category: this.categorizeJob(job.title),
          source: "wellfound",
          sourceId: `wellfound_${Date.now()}_${index}`,
          sourceUrl: "https://wellfound.com/",
          isAutoPosted: true,
          applyLink: "https://wellfound.com/",
          status: "active",
        };
      });

      results.found = jobs.length;
      results.added = await this.saveJobsBatch(jobs);
    } catch (error) {
      console.error("Wellfound scraping error:", error.message);
    }

    return results;
  }

  // Improved batch save with transaction support
  async saveJobsBatch(jobs) {
    let addedCount = 0;
    const BATCH_SIZE = 10;

    try {
      // Process in batches to avoid overwhelming the database
      for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
        const batch = jobs.slice(i, i + BATCH_SIZE);

        // Use Promise.allSettled to handle individual failures
        const results = await Promise.allSettled(
          batch.map((jobData) => this.saveJob(jobData))
        );

        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            addedCount++;
          }
        });

        // Small delay between batches
        if (i + BATCH_SIZE < jobs.length) {
          await this.delay(500);
        }
      }
    } catch (error) {
      console.error("Error in batch save:", error.message);
    }

    return addedCount;
  }

  // Single job save with improved duplicate checking
  async saveJob(jobData) {
    try {
      // Check for duplicates using multiple criteria
      const existingJob = await Job.findOne({
        where: {
          [Op.or]: [
            { sourceId: jobData.sourceId },
            {
              [Op.and]: [
                { title: jobData.title },
                { company: jobData.company },
                { source: jobData.source },
              ],
            },
          ],
        },
      });

      if (!existingJob) {
        await Job.create(jobData);
        console.log(`✅ Added: ${jobData.title} at ${jobData.company}`);
        return true;
      } else {
        // Update if existing job is older than 7 days
        const daysSincePosted =
          (Date.now() - existingJob.postedDate) / (1000 * 60 * 60 * 24);
        if (daysSincePosted > 7) {
          await existingJob.update({
            applicationDeadline: jobData.applicationDeadline,
            postedDate: new Date(),
          });
          console.log(`🔄 Refreshed: ${jobData.title}`);
          return true;
        }
        console.log(`⏩ Skipped duplicate: ${jobData.title}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error saving job ${jobData.title}:`, error.message);
      return false;
    }
  }

  // Improved cleanup with soft delete option
  async cleanupExpiredJobs(softDelete = false) {
    try {
      if (softDelete) {
        // Soft delete: just update status
        const [updatedCount] = await Job.update(
          { status: "expired" },
          {
            where: {
              applicationDeadline: {
                [Op.lt]: new Date(),
              },
              status: {
                [Op.in]: ["active", "open"],
              },
            },
          }
        );
        console.log(`🗑️ Marked ${updatedCount} jobs as expired`);
        return updatedCount;
      } else {
        // Hard delete: remove from database
        const result = await Job.destroy({
          where: {
            applicationDeadline: {
              [Op.lt]: new Date(),
            },
            status: {
              [Op.ne]: "closed",
            },
            // Only delete very old jobs (more than 90 days expired)
            createdAt: {
              [Op.lt]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            },
          },
        });

        console.log(`🗑️ Deleted ${result} expired jobs`);
        return result;
      }
    } catch (error) {
      console.error("Error cleaning up expired jobs:", error);
      throw error;
    }
  }

  // Improved status update with more granular control
  async updateJobStatuses() {
    try {
      const now = new Date();

      // Close jobs past deadline
      const [closedCount] = await Job.update(
        { status: "closed" },
        {
          where: {
            applicationDeadline: {
              [Op.lt]: now,
            },
            status: "active",
          },
        }
      );

      // Mark jobs expiring soon (within 7 days)
      const sevenDaysFromNow = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      const [expiringCount] = await Job.update(
        { status: "expiring_soon" },
        {
          where: {
            applicationDeadline: {
              [Op.between]: [now, sevenDaysFromNow],
            },
            status: "active",
          },
        }
      );

      console.log(`📋 Updated ${closedCount} jobs to 'closed' status`);
      console.log(`⏰ Marked ${expiringCount} jobs as 'expiring soon'`);

      return { closedCount, expiringCount };
    } catch (error) {
      console.error("Error updating job statuses:", error);
      throw error;
    }
  }

  // Utility functions
  categorizeJob(title) {
    const titleLower = title.toLowerCase();
    const categories = {
      Frontend: ["frontend", "react", "vue", "angular", "ui", "ux"],
      Backend: ["backend", "node", "express", "django", "flask", "api"],
      "Full Stack": ["full stack", "fullstack", "mern", "mean"],
      "Mobile Development": [
        "mobile",
        "android",
        "ios",
        "react native",
        "flutter",
      ],
      "Data Science": ["data", "machine learning", "ml", "ai", "analytics"],
      DevOps: ["devops", "aws", "cloud", "kubernetes", "docker"],
      "QA/Testing": ["test", "qa", "quality assurance"],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => titleLower.includes(keyword))) {
        return category;
      }
    }

    return "Software Development";
  }

  extractSkills(text) {
    const skillsList = [
      "javascript",
      "typescript",
      "react",
      "vue",
      "angular",
      "node.js",
      "express",
      "python",
      "django",
      "flask",
      "java",
      "spring",
      "html",
      "css",
      "sass",
      "mongodb",
      "mysql",
      "postgresql",
      "redis",
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "git",
      "rest api",
      "graphql",
    ];

    const textLower = text.toLowerCase();
    const found = skillsList.filter((skill) => textLower.includes(skill));

    return found.length > 0 ? found.slice(0, 8) : ["General IT"];
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Health check method
  async healthCheck() {
    try {
      const testUrl = "https://httpbin.org/get";
      await this.axiosInstance.get(testUrl, { timeout: 5000 });
      return { healthy: true, message: "Service is operational" };
    } catch (error) {
      return { healthy: false, message: error.message };
    }
  }
}

export default new AutoJobService();
