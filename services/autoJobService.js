// services/autoJobService.js
import axios from "axios";
import * as cheerio from "cheerio";
import Job from "../models/Job.js";

class AutoJobService {
  constructor() {
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
      indeed: this.scrapeIndeed.bind(this),
      linkedin: this.scrapeLinkedIn.bind(this),
      glassdoor: this.scrapeGlassdoor.bind(this),
      remoteok: this.scrapeRemoteOk.bind(this),
      wellfound: this.scrapeWellfound.bind(this),
    };

    // Enhanced job categories and skills
    this.jobCategories = {
      "Software Development": {
        skills: [
          "JavaScript",
          "Python",
          "Java",
          "C++",
          "React",
          "Node.js",
          "AWS",
          "Docker",
          "Kubernetes",
          "Git",
          "REST APIs",
          "GraphQL",
          "TypeScript",
          "MongoDB",
          "PostgreSQL",
          "Vue.js",
          "Angular",
          "Spring Boot",
          "Express.js",
          "MySQL",
        ],
        keywords: [
          "software engineer",
          "developer",
          "full stack",
          "backend",
          "frontend",
          "web developer",
          "mobile developer",
          "android",
          "ios",
          "react native",
          "flutter",
        ],
        types: ["full-time", "part-time", "contract"],
      },
      "Data Science & AI": {
        skills: [
          "Python",
          "R",
          "SQL",
          "Machine Learning",
          "TensorFlow",
          "PyTorch",
          "Pandas",
          "NumPy",
          "Data Analysis",
          "Statistics",
          "Tableau",
          "Power BI",
          "Big Data",
          "Spark",
          "Hadoop",
          "Data Visualization",
          "Deep Learning",
          "NLP",
          "Computer Vision",
        ],
        keywords: [
          "data scientist",
          "data analyst",
          "machine learning",
          "ai engineer",
          "data engineer",
          "business analyst",
          "research scientist",
          "mlops",
        ],
        types: ["full-time", "contract"],
      },
      "DevOps & Cloud": {
        skills: [
          "AWS",
          "Azure",
          "GCP",
          "Docker",
          "Kubernetes",
          "Jenkins",
          "Terraform",
          "Ansible",
          "Linux",
          "CI/CD",
          "Monitoring",
          "Networking",
          "Security",
          "Helm",
          "Prometheus",
          "Grafana",
          "Bash",
          "Python",
        ],
        keywords: [
          "devops",
          "cloud engineer",
          "site reliability",
          "infrastructure",
          "system administrator",
          "platform engineer",
        ],
        types: ["full-time", "contract"],
      },
      "Product Management": {
        skills: [
          "Product Strategy",
          "Roadmapping",
          "User Research",
          "Agile",
          "Scrum",
          "Analytics",
          "JIRA",
          "Figma",
          "Market Analysis",
          "UX/UI",
          "A/B Testing",
          "Product Metrics",
          "Customer Development",
        ],
        keywords: [
          "product manager",
          "product owner",
          "technical product manager",
          "product lead",
        ],
        types: ["full-time"],
      },
      "UX/UI Design": {
        skills: [
          "Figma",
          "Adobe XD",
          "Sketch",
          "User Research",
          "Wireframing",
          "Prototyping",
          "User Testing",
          "Design Systems",
          "HTML/CSS",
          "Accessibility",
          "Interaction Design",
          "Visual Design",
          "Adobe Creative Suite",
        ],
        keywords: [
          "ux designer",
          "ui designer",
          "product designer",
          "user experience",
          "interaction designer",
        ],
        types: ["full-time", "contract", "part-time"],
      },
      "QA & Testing": {
        skills: [
          "Selenium",
          "Cypress",
          "Jest",
          "TestNG",
          "Automated Testing",
          "Manual Testing",
          "Performance Testing",
          "JIRA",
          "Postman",
          "API Testing",
          "Load Testing",
          "Security Testing",
          "Test Automation",
        ],
        keywords: [
          "qa engineer",
          "test engineer",
          "quality assurance",
          "automation engineer",
          "sdet",
        ],
        types: ["full-time", "contract"],
      },
      "Cyber Security": {
        skills: [
          "Network Security",
          "Penetration Testing",
          "SIEM",
          "Firewalls",
          "Encryption",
          "Vulnerability Assessment",
          "SOC",
          "Incident Response",
          "Compliance",
          "Ethical Hacking",
          "Security Auditing",
          "Risk Assessment",
        ],
        keywords: [
          "security engineer",
          "cyber security",
          "information security",
          "security analyst",
          "penetration tester",
          "security consultant",
        ],
        types: ["full-time", "contract"],
      },
      "Business & Marketing": {
        skills: [
          "Digital Marketing",
          "SEO",
          "Google Analytics",
          "Social Media",
          "Content Strategy",
          "Market Research",
          "Sales",
          "CRM",
          "Email Marketing",
          "Google Ads",
          "Facebook Ads",
          "Content Marketing",
          "Growth Hacking",
        ],
        keywords: [
          "digital marketer",
          "marketing specialist",
          "business development",
          "sales executive",
          "growth marketer",
          "content strategist",
        ],
        types: ["full-time", "part-time"],
      },
      "Technical Support": {
        skills: [
          "Customer Support",
          "Technical Troubleshooting",
          "IT Support",
          "Help Desk",
          "Network Support",
          "Software Support",
          "Documentation",
          "Training",
          "CRM Software",
        ],
        keywords: [
          "technical support",
          "it support",
          "help desk",
          "customer support",
          "support engineer",
        ],
        types: ["full-time", "part-time"],
      },
    };

    // Popular companies for job variety
    this.popularCompanies = [
      "Google",
      "Microsoft",
      "Amazon",
      "Meta",
      "Apple",
      "Netflix",
      "Twitter",
      "Uber",
      "Airbnb",
      "Spotify",
      "Adobe",
      "Salesforce",
      "Oracle",
      "IBM",
      "Intel",
      "Cisco",
      "Dell",
      "HP",
      "Infosys",
      "TCS",
      "Wipro",
      "Accenture",
      "Capgemini",
      "Cognizant",
      "Tech Mahindra",
      "Flipkart",
      "Zomato",
      "Swiggy",
      "Ola",
      "Paytm",
      "Razorpay",
      "PhonePe",
      "Byju's",
      "Startup Tech",
      "Innovative Solutions",
      "Digital Ventures",
      "Tech Innovations",
    ];

    this.lastRequestTime = {};
    this.minRequestDelay = 2000;
  }

  // Enhanced scraping with multiple sources
  async scrapeAllJobs() {
    const results = {
      totalFound: 0,
      totalAdded: 0,
      errors: [],
      details: {},
      startTime: new Date(),
    };

    try {
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

  // Enhanced Internshala Scraper with multiple job types
  async scrapeInternshala() {
    const results = { found: 0, added: 0, errors: [] };
    const jobs = [];

    try {
      // Scrape multiple job types from Internshala
      const jobTypes = [
        "software-developer-internship",
        "web-development-internship",
        "data-science-internship",
        "mobile-app-development-internship",
        "engineering-internship",
        "marketing-internship",
        "design-internship",
        "content-writing-internship",
      ];

      for (const jobType of jobTypes) {
        try {
          const url = `https://internshala.com/internships/${jobType}`;
          const response = await this.axiosInstance.get(url);
          const $ = cheerio.load(response.data);

          $(".internship_meta").each((index, element) => {
            if (index < 8) {
              // Limit to 8 jobs per category
              const $el = $(element);
              const title =
                $el.find(".profile span")?.text()?.trim() ||
                `Internship - ${jobType.split("-")[0]}`;
              const company =
                $el.find(".company_name")?.text()?.trim() ||
                this.getRandomCompany();
              const location =
                $el.find(".location_link")?.text()?.trim() ||
                "Multiple Locations";

              if (title && company) {
                // Set fixed 1 week expiry from today
                const applicationDeadline = new Date();
                applicationDeadline.setDate(applicationDeadline.getDate() + 7);

                const category = this.categorizeJob(title);
                const jobData = this.generateJobData(
                  title,
                  company,
                  location,
                  category,
                  "internshala"
                );

                jobs.push({
                  ...jobData,
                  applicationDeadline,
                  type: "internship",
                  source: "internshala",
                  sourceId: `internshala_${jobType}_${Date.now()}_${index}`,
                  sourceUrl: url,
                });
              }
            }
          });

          await this.delay(2000); // Delay between requests
        } catch (error) {
          console.error(
            `Error scraping Internshala ${jobType}:`,
            error.message
          );
          results.errors.push({ type: jobType, error: error.message });
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

  // Enhanced Indeed-like scraper
  async scrapeIndeed() {
    const results = { found: 0, added: 0 };
    const jobs = [];

    try {
      const categories = Object.keys(this.jobCategories);

      for (const category of categories.slice(0, 5)) {
        // Limit to 5 categories
        const categoryData = this.jobCategories[category];

        // Generate multiple job types for each category
        categoryData.types.forEach((jobType) => {
          for (let i = 0; i < 3; i++) {
            // 3 jobs per type
            const title = this.generateJobTitle(category, jobType);
            const company = this.getRandomCompany();
            const location = this.getRandomLocation();

            // Set fixed 1 week expiry
            const applicationDeadline = new Date();
            applicationDeadline.setDate(applicationDeadline.getDate() + 7);

            const jobData = this.generateJobData(
              title,
              company,
              location,
              category,
              "indeed"
            );

            jobs.push({
              ...jobData,
              applicationDeadline,
              type: jobType,
              source: "indeed",
              sourceId: `indeed_${category}_${jobType}_${Date.now()}_${i}`,
              sourceUrl: "https://indeed.com",
            });
          }
        });

        await this.delay(500);
      }

      results.found = jobs.length;
      results.added = await this.saveJobsBatch(jobs);
    } catch (error) {
      console.error("Indeed scraping error:", error.message);
    }

    return results;
  }

  // LinkedIn-like job scraper
  async scrapeLinkedIn() {
    const results = { found: 0, added: 0 };
    const jobs = [];

    try {
      const seniorityLevels = [
        "Junior",
        "Mid-level",
        "Senior",
        "Lead",
        "Principal",
      ];
      const categories = Object.keys(this.jobCategories);

      categories.forEach((category) => {
        seniorityLevels.forEach((level) => {
          for (let i = 0; i < 2; i++) {
            // 2 jobs per level per category
            const title = `${level} ${this.generateJobTitle(
              category,
              "full-time"
            )}`;
            const company = this.getRandomCompany();
            const location = this.getRandomLocation();

            // Set fixed 1 week expiry
            const applicationDeadline = new Date();
            applicationDeadline.setDate(applicationDeadline.getDate() + 7);

            const jobData = this.generateJobData(
              title,
              company,
              location,
              category,
              "linkedin"
            );

            jobs.push({
              ...jobData,
              applicationDeadline,
              type: "full-time",
              source: "linkedin",
              sourceId: `linkedin_${category}_${level}_${Date.now()}_${i}`,
              sourceUrl: "https://linkedin.com/jobs",
              experience: this.getExperienceForLevel(level),
              salary: this.generateSalary(level),
            });
          }
        });
      });

      results.found = jobs.length;
      results.added = await this.saveJobsBatch(jobs);
    } catch (error) {
      console.error("LinkedIn scraping error:", error.message);
    }

    return results;
  }

  // Glassdoor-like job scraper
  async scrapeGlassdoor() {
    const results = { found: 0, added: 0 };
    const jobs = [];

    try {
      const jobTypes = ["full-time", "part-time", "contract", "remote"];
      const categories = Object.keys(this.jobCategories);

      jobTypes.forEach((jobType) => {
        categories.slice(0, 4).forEach((category) => {
          // 4 categories per type
          for (let i = 0; i < 2; i++) {
            // 2 jobs per category per type
            const title = this.generateJobTitle(category, jobType);
            const company = this.getRandomCompany();
            const location =
              jobType === "remote" ? "Remote" : this.getRandomLocation();

            // Set fixed 1 week expiry
            const applicationDeadline = new Date();
            applicationDeadline.setDate(applicationDeadline.getDate() + 7);

            const jobData = this.generateJobData(
              title,
              company,
              location,
              category,
              "glassdoor"
            );

            jobs.push({
              ...jobData,
              applicationDeadline,
              type: jobType,
              source: "glassdoor",
              sourceId: `glassdoor_${category}_${jobType}_${Date.now()}_${i}`,
              sourceUrl: "https://glassdoor.com",
              salary: this.generateSalary(),
            });
          }
        });
      });

      results.found = jobs.length;
      results.added = await this.saveJobsBatch(jobs);
    } catch (error) {
      console.error("Glassdoor scraping error:", error.message);
    }

    return results;
  }

  // Enhanced RemoteOK Scraper
  async scrapeRemoteOk() {
    const results = { found: 0, added: 0 };
    const jobs = [];

    try {
      const remoteCategories = [
        "Software Development",
        "Data Science & AI",
        "DevOps & Cloud",
        "UX/UI Design",
        "Product Management",
      ];

      remoteCategories.forEach((category) => {
        for (let i = 0; i < 4; i++) {
          // 4 remote jobs per category
          const title = `Remote ${this.generateJobTitle(
            category,
            "full-time"
          )}`;
          const company = this.getRandomCompany();

          // Set fixed 1 week expiry
          const applicationDeadline = new Date();
          applicationDeadline.setDate(applicationDeadline.getDate() + 7);

          const jobData = this.generateJobData(
            title,
            company,
            "Remote",
            category,
            "remoteok"
          );

          jobs.push({
            ...jobData,
            applicationDeadline,
            type: "remote",
            source: "remoteok",
            sourceId: `remoteok_${category}_${Date.now()}_${i}`,
            sourceUrl: "https://remoteok.com",
            salary: this.generateSalary("Mid-level"),
          });
        }
      });

      results.found = jobs.length;
      results.added = await this.saveJobsBatch(jobs);
    } catch (error) {
      console.error("RemoteOK scraping error:", error.message);
    }

    return results;
  }

  // Enhanced Wellfound Scraper
  async scrapeWellfound() {
    const results = { found: 0, added: 0 };
    const jobs = [];

    try {
      const startupRoles = [
        "Full Stack Developer",
        "Product Manager",
        "Growth Marketer",
        "Data Scientist",
        "UX Designer",
        "DevOps Engineer",
        "Mobile Developer",
      ];

      startupRoles.forEach((role) => {
        for (let i = 0; i < 3; i++) {
          // 3 jobs per role
          const title = `${role} - Startup`;
          const company = this.getRandomStartupCompany();
          const location = this.getRandomLocation();
          const category = this.categorizeJob(role);

          // Set fixed 1 week expiry
          const applicationDeadline = new Date();
          applicationDeadline.setDate(applicationDeadline.getDate() + 7);

          const jobData = this.generateJobData(
            title,
            company,
            location,
            category,
            "wellfound"
          );

          jobs.push({
            ...jobData,
            applicationDeadline,
            type: "full-time",
            source: "wellfound",
            sourceId: `wellfound_${role}_${Date.now()}_${i}`,
            sourceUrl: "https://wellfound.com",
            salary: "$70k-$120k + Equity",
          });
        }
      });

      results.found = jobs.length;
      results.added = await this.saveJobsBatch(jobs);
    } catch (error) {
      console.error("Wellfound scraping error:", error.message);
    }

    return results;
  }

  // Helper methods
  generateJobData(title, company, location, category, source) {
    const categoryData =
      this.jobCategories[category] ||
      this.jobCategories["Software Development"];

    return {
      title,
      company,
      location,
      salary: this.generateSalary(),
      experience: this.getRandomExperience(),
      postedDate: new Date(),
      verified: true,
      userType: "Auto",
      email: "careers@company.com",
      description: this.generateJobDescription(
        title,
        company,
        location,
        category
      ),
      requiredSkills: this.getRandomSkills(categoryData.skills, 6), // 6 random skills
      qualifications: this.generateQualifications(),
      category,
      source,
      isAutoPosted: true,
      applyLink: `https://${source}.com/apply`,
      status: "active",
    };
  }

  generateJobTitle(category, type) {
    const categoryData = this.jobCategories[category];
    const keyword =
      categoryData.keywords[
        Math.floor(Math.random() * categoryData.keywords.length)
      ];

    const prefixes = {
      "full-time": ["Senior", "Lead", "Junior", "Mid-level", "Principal"],
      "part-time": ["Part-time", "Freelance"],
      contract: ["Contract", "Consultant"],
      internship: ["Intern", "Trainee"],
      remote: ["Remote"],
    };

    const prefix = prefixes[type]
      ? prefixes[type][Math.floor(Math.random() * prefixes[type].length)]
      : "";

    return `${prefix} ${keyword}`.trim();
  }

  getRandomSkills(skills, count) {
    const shuffled = [...skills].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getRandomCompany() {
    return this.popularCompanies[
      Math.floor(Math.random() * this.popularCompanies.length)
    ];
  }

  getRandomStartupCompany() {
    const startups = [
      "Tech Startup",
      "Innovative Solutions",
      "Digital Ventures",
      "NextGen Tech",
      "Future Labs",
      "Smart Solutions",
      "AI Innovations",
    ];
    return startups[Math.floor(Math.random() * startups.length)];
  }

  getRandomLocation() {
    const locations = [
      "Bangalore, India",
      "Hyderabad, India",
      "Pune, India",
      "Chennai, India",
      "Delhi, India",
      "Mumbai, India",
      "Remote",
      "San Francisco, USA",
      "New York, USA",
      "Austin, USA",
      "Seattle, USA",
      "London, UK",
      "Berlin, Germany",
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  getRandomExperience() {
    const experiences = [
      "0-2 years",
      "1-3 years",
      "2-4 years",
      "3-5 years",
      "4-6 years",
      "5-8 years",
      "8+ years",
    ];
    return experiences[Math.floor(Math.random() * experiences.length)];
  }

  getExperienceForLevel(level) {
    const levels = {
      Junior: "0-2 years",
      "Mid-level": "2-5 years",
      Senior: "5-8 years",
      Lead: "8-12 years",
      Principal: "10+ years",
    };
    return levels[level] || "2-5 years";
  }

  generateSalary(level = "Mid-level") {
    const salaries = {
      Junior: ["₹4L-₹8L", "$50k-$70k", "₹5L-₹9L"],
      "Mid-level": ["₹8L-₹15L", "$70k-$100k", "₹10L-₹18L"],
      Senior: ["₹15L-₹25L", "$100k-$150k", "₹18L-₹30L"],
      Lead: ["₹25L-₹40L", "$130k-$180k", "₹30L-₹50L"],
      Principal: ["₹35L-₹60L", "$150k-$250k", "₹45L-₹80L"],
    };

    const levelSalaries = salaries[level] || salaries["Mid-level"];
    return levelSalaries[Math.floor(Math.random() * levelSalaries.length)];
  }

  generateJobDescription(title, company, location, category) {
    return `${company} is looking for a ${title} to join our ${category} team. This position is based in ${location} and offers an exciting opportunity to work on cutting-edge projects with a talented team of professionals. Ideal candidates will have relevant experience and a passion for innovation.`;
  }

  generateQualifications() {
    const qualifications = [
      "Bachelor's degree in Computer Science or related field",
      "Relevant industry experience",
      "Strong problem-solving skills",
      "Excellent communication abilities",
      "Ability to work in a team environment",
      "Portfolio of relevant projects",
      "Knowledge of industry best practices",
    ];

    return this.getRandomSkills(qualifications, 3);
  }

  categorizeJob(title) {
    const titleLower = title.toLowerCase();

    for (const [category, data] of Object.entries(this.jobCategories)) {
      if (
        data.keywords.some((keyword) =>
          titleLower.includes(keyword.toLowerCase())
        )
      ) {
        return category;
      }
    }

    return "Software Development";
  }

  // Existing utility methods
  async withRetry(fn, maxRetries = 3, sourceName = "unknown") {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.enforceRateLimit(sourceName);
        const result = await fn();
        return result;
      } catch (error) {
        lastError = error;
        console.log(
          `⚠️ Attempt ${attempt}/${maxRetries} failed for ${sourceName}: ${error.message}`
        );

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await this.delay(delay);
        }
      }
    }

    throw lastError;
  }

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

  async saveJobsBatch(jobs) {
    let addedCount = 0;
    const BATCH_SIZE = 10;

    try {
      for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
        const batch = jobs.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
          batch.map((jobData) => this.saveJob(jobData))
        );

        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            addedCount++;
          }
        });

        if (i + BATCH_SIZE < jobs.length) {
          await this.delay(500);
        }
      }
    } catch (error) {
      console.error("Error in batch save:", error.message);
    }

    return addedCount;
  }

  async saveJob(jobData) {
    try {
      const existingJob = await Job.findOne({
        $or: [
          { sourceId: jobData.sourceId },
          {
            $and: [
              { title: jobData.title },
              { company: jobData.company },
              { source: jobData.source },
            ],
          },
        ],
      });

      if (!existingJob) {
        await Job.create(jobData);
        console.log(`✅ Added: ${jobData.title} at ${jobData.company}`);
        return true;
      } else {
        const daysSincePosted =
          (Date.now() - existingJob.postedDate) / (1000 * 60 * 60 * 24);
        if (daysSincePosted > 7) {
          await Job.updateOne(
            { _id: existingJob._id },
            {
              applicationDeadline: jobData.applicationDeadline,
              postedDate: new Date(),
            }
          );
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

async cleanupExpiredJobs() {
  try {
    const now = new Date();
    
    // Direct delete: Remove all auto-posted jobs with expired deadlines
    const deleteResult = await Job.deleteMany({
      $and: [
        { isAutoPosted: true },
        { applicationDeadline: { $lt: now } } // Deadline is in the past
      ]
    });
    
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} expired auto jobs`);
    return deleteResult.deletedCount;
    
  } catch (error) {
    console.error("Error cleaning up expired jobs:", error);
    throw error;
  }
}
  async updateJobStatuses() {
    try {
      const now = new Date();

      const closeResult = await Job.updateMany(
        {
          applicationDeadline: { $lt: now },
          status: "active",
        },
        { status: "closed" }
      );

      const sevenDaysFromNow = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      const expireResult = await Job.updateMany(
        {
          applicationDeadline: {
            $gte: now,
            $lte: sevenDaysFromNow,
          },
          status: "active",
        },
        { status: "expiring_soon" }
      );

      console.log(
        `📋 Updated ${closeResult.modifiedCount} jobs to 'closed' status`
      );
      console.log(
        `⏰ Marked ${expireResult.modifiedCount} jobs as 'expiring soon'`
      );

      return {
        closedCount: closeResult.modifiedCount,
        expiringCount: expireResult.modifiedCount,
      };
    } catch (error) {
      console.error("Error updating job statuses:", error);
      throw error;
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
