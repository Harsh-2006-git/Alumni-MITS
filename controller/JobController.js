import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";

class InternshalaController {
  constructor() {
    this.baseUrl = "https://internshala.com";
  }

  /**
   * Get current month and year
   */
  getCurrentMonthYear() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return { month, year };
  }

  /**
   * Check if posted date is in current month
   */
  isCurrentMonth(dateText) {
    const { month, year } = this.getCurrentMonthYear();

    if (!dateText) return false;

    const text = dateText.toLowerCase().trim();

    if (
      text.includes("just now") ||
      text.includes("today") ||
      text.includes("hours ago")
    ) {
      return true;
    }

    if (text.includes("yesterday")) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return (
        yesterday.getMonth() + 1 === month && yesterday.getFullYear() === year
      );
    }

    const daysMatch = text.match(/(\d+)\s*days?\s*ago/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      const postDate = new Date();
      postDate.setDate(postDate.getDate() - days);
      return (
        postDate.getMonth() + 1 === month && postDate.getFullYear() === year
      );
    }

    const weeksMatch = text.match(/(\d+)\s*weeks?\s*ago/);
    if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1]);
      const postDate = new Date();
      postDate.setDate(postDate.getDate() - weeks * 7);
      return (
        postDate.getMonth() + 1 === month && postDate.getFullYear() === year
      );
    }

    if (text.includes("a week ago")) {
      const postDate = new Date();
      postDate.setDate(postDate.getDate() - 7);
      return (
        postDate.getMonth() + 1 === month && postDate.getFullYear() === year
      );
    }

    return false;
  }

  /**
   * Scrape internships with proper data structure
   */
  async scrapeInternships(maxPages = 3) {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      );

      let allInternships = [];
      const scrapedDateTime = new Date().toISOString();

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const url = `${this.baseUrl}/internships/page-${pageNum}`;

        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
        await page
          .waitForSelector(".individual_internship, .internship_meta", {
            timeout: 10000,
          })
          .catch(() => null);

        const internships = await page.evaluate((datetime) => {
          const results = [];
          const containers = document.querySelectorAll(
            ".individual_internship, .internship_meta, .internship-card"
          );

          containers.forEach((container) => {
            try {
              const internship = {
                _id: null,
                datetime: datetime,
                profile: "",
                company: "",
                location: "",
                start_date: "",
                stipend: "",
                duration: "",
                apply_by_date: "",
                offer: "",
                skills: [],
                perks: [],
              };

              const profileEl = container.querySelector(
                ".profile, .job-internship-name, h3 a, .heading_4_5"
              );
              internship.profile = profileEl
                ? profileEl.textContent.trim()
                : "";

              const companyEl = container.querySelector(
                ".company-name, .company_name, .link_display_like_text, .heading_6"
              );
              internship.company = companyEl
                ? companyEl.textContent.trim()
                : "";

              const locationEl = container.querySelector(
                ".location_link, #location_names a, .locations, .location"
              );
              internship.location = locationEl
                ? locationEl.textContent.trim()
                : "";

              const startDateEl = container.querySelector(
                '.start-immediately, [id*="start-date"], .start_immediately_desktop'
              );
              internship.start_date = startDateEl
                ? startDateEl.textContent.trim()
                : "";

              const stipendEl = container.querySelector(
                '.stipend, .salary, [class*="stipend"]'
              );
              internship.stipend = stipendEl
                ? stipendEl.textContent.trim()
                : "";

              const durationEl = container.querySelector(
                '.duration, [id*="duration"], .internship_other_details span:first-child'
              );
              internship.duration = durationEl
                ? durationEl.textContent.trim()
                : "";

              const applyByEl = container.querySelector(
                '.apply_by, .apply-by, [class*="apply"]'
              );
              if (applyByEl) {
                internship.apply_by_date = applyByEl.textContent
                  .replace("Apply By", "")
                  .trim();
              }

              const offerEl = container.querySelector(
                '[class*="offer"], .ppo, [class*="incentive"]'
              );
              internship.offer = offerEl ? offerEl.textContent.trim() : "";

              const skillElements = container.querySelectorAll(
                '.round_tabs, .skill-tag, [class*="skill"], .tags span'
              );
              skillElements.forEach((skillEl) => {
                const skill = skillEl.textContent.trim();
                if (skill && !internship.skills.includes(skill)) {
                  internship.skills.push(skill);
                }
              });

              const perkElements = container.querySelectorAll(
                '.perks, [class*="perk"], .other_detail_item'
              );
              perkElements.forEach((perkEl) => {
                const perk = perkEl.textContent.trim();
                if (perk && !internship.perks.includes(perk)) {
                  internship.perks.push(perk);
                }
              });

              const postedEl = container.querySelector(
                '.status-success, .posted, [class*="posted"]'
              );
              internship.posted_date = postedEl
                ? postedEl.textContent.trim()
                : "";

              const linkEl = container.querySelector(
                'a.view_detail_button, a[href*="/internship/"]'
              );
              internship.link = linkEl ? linkEl.href : "";

              if (internship.profile) {
                results.push(internship);
              }
            } catch (err) {
              console.error("Error parsing internship:", err);
            }
          });

          return results;
        }, scrapedDateTime);

        internships.forEach((internship) => {
          internship._id = uuidv4();
        });

        allInternships = allInternships.concat(internships);

        if (internships.length === 0) break;

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      return allInternships;
    } finally {
      await browser.close();
    }
  }

  /**
   * Scrape jobs with proper data structure
   */
  async scrapeJobs(maxPages = 3) {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      );

      let allJobs = [];
      const scrapedDateTime = new Date().toISOString();

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const url = `${this.baseUrl}/jobs/page-${pageNum}`;
        console.log(`Scraping jobs page ${pageNum}...`);

        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
        await page
          .waitForSelector(".individual_internship, .internship_meta", {
            timeout: 10000,
          })
          .catch(() => null);

        const jobs = await page.evaluate((datetime) => {
          const results = [];
          const containers = document.querySelectorAll(
            ".individual_internship, .internship_meta, .job-card"
          );

          containers.forEach((container) => {
            try {
              const job = {
                _id: null,
                datetime: datetime,
                profile: "",
                company: "",
                location: "",
                start_date: "",
                stipend: "",
                duration: "",
                apply_by_date: "",
                offer: "",
                skills: [],
                perks: [],
              };

              const profileEl = container.querySelector(
                ".profile, .job-internship-name, h3 a"
              );
              job.profile = profileEl ? profileEl.textContent.trim() : "";

              const companyEl = container.querySelector(
                ".company-name, .company_name"
              );
              job.company = companyEl ? companyEl.textContent.trim() : "";

              const locationEl = container.querySelector(
                ".location_link, #location_names a, .location"
              );
              job.location = locationEl ? locationEl.textContent.trim() : "";

              const startDateEl = container.querySelector(
                '.start-immediately, [id*="start-date"]'
              );
              job.start_date = startDateEl
                ? startDateEl.textContent.trim()
                : "";

              const salaryEl = container.querySelector(".stipend, .salary");
              job.stipend = salaryEl ? salaryEl.textContent.trim() : "";

              const experienceEl = container.querySelector(
                ".experience, .other_detail_item"
              );
              job.duration = experienceEl
                ? experienceEl.textContent.trim()
                : "";

              const applyByEl = container.querySelector(".apply_by, .apply-by");
              if (applyByEl) {
                job.apply_by_date = applyByEl.textContent
                  .replace("Apply By", "")
                  .trim();
              }

              const offerEl = container.querySelector('[class*="offer"], .ppo');
              job.offer = offerEl ? offerEl.textContent.trim() : "";

              const skillElements = container.querySelectorAll(
                '.round_tabs, .skill-tag, [class*="skill"]'
              );
              skillElements.forEach((skillEl) => {
                const skill = skillEl.textContent.trim();
                if (skill && !job.skills.includes(skill)) {
                  job.skills.push(skill);
                }
              });

              const perkElements = container.querySelectorAll(
                '.perks, [class*="perk"]'
              );
              perkElements.forEach((perkEl) => {
                const perk = perkEl.textContent.trim();
                if (perk && !job.perks.includes(perk)) {
                  job.perks.push(perk);
                }
              });

              const postedEl = container.querySelector(
                ".status-success, .posted"
              );
              job.posted_date = postedEl ? postedEl.textContent.trim() : "";

              const linkEl = container.querySelector(
                'a.view_detail_button, a[href*="/job/"]'
              );
              job.link = linkEl ? linkEl.href : "";

              if (job.profile) {
                results.push(job);
              }
            } catch (err) {
              console.error("Error parsing job:", err);
            }
          });

          return results;
        }, scrapedDateTime);

        jobs.forEach((job) => {
          job._id = uuidv4();
        });

        allJobs = allJobs.concat(jobs);

        if (jobs.length === 0) break;

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      return allJobs;
    } finally {
      await browser.close();
    }
  }

  /**
   * Get all opportunities posted in current month
   */
  async getAllCurrentMonthOpportunities(maxPages = 3) {
    try {
      const { month, year } = this.getCurrentMonthYear();

      console.log("Fetching internships...");
      const allInternships = await this.scrapeInternships(maxPages);

      console.log("Fetching jobs...");
      const allJobs = await this.scrapeJobs(maxPages);

      const currentMonthInternships = allInternships.filter((item) =>
        this.isCurrentMonth(item.posted_date)
      );

      const currentMonthJobs = allJobs.filter((item) =>
        this.isCurrentMonth(item.posted_date)
      );

      currentMonthInternships.forEach((item) => delete item.posted_date);
      currentMonthJobs.forEach((item) => delete item.posted_date);

      return {
        success: true,
        month,
        year,
        totalInternships: currentMonthInternships.length,
        totalJobs: currentMonthJobs.length,
        data: {
          internships: currentMonthInternships,
          jobs: currentMonthJobs,
        },
        scrapedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch opportunities: ${error.message}`);
    }
  }

  /**
   * Express.js controller method
   */
  async getOpportunities(req, res) {
    try {
      const maxPages = parseInt(req.query.maxPages) || 3;
      const result = await this.getAllCurrentMonthOpportunities(maxPages);

      res.status(200).json(result);
    } catch (error) {
      console.error("Controller error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

//export default InternshalaController;

// controllers/jobController.js
import Job from "../models/Job.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    // Get user data from token
    const { email, userType } = req.user;

    // All available fields from req.body
    const {
      title,
      company,
      companyLogo,
      type,
      location,
      salary,
      experience,
      applicationDeadline,
      closedDate,
      verified,
      description,
      requiredSkills,
      qualifications,
      companyWebsite,
      category,
      status,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !company ||
      !location ||
      !applicationDeadline ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, company, location, application deadline, and description are required fields",
      });
    }

    // Create job with all fields including user data from token
    const job = await Job.create({
      title,
      company,
      companyLogo,
      type,
      location,
      salary,
      experience,
      applicationDeadline,
      closedDate,
      verified,
      description,
      requiredSkills,
      qualifications,
      companyWebsite,
      category,
      status,
      email, // From token
      userType, // From token
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Error creating job",
      error: error.message,
    });
  }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};

// Update job by ID
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user; // Get email from token for authorization

    // All available fields from req.body
    const {
      title,
      company,
      companyLogo,
      type,
      location,
      salary,
      experience,
      applicationDeadline,
      closedDate,
      verified,
      description,
      requiredSkills,
      qualifications,
      companyWebsite,
      category,
      status,
    } = req.body;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user owns the job
    if (job.email !== email) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own jobs",
      });
    }

    // Update job with all fields (except email and userType which remain from original)
    await job.update({
      title,
      company,
      companyLogo,
      type,
      location,
      salary,
      experience,
      applicationDeadline,
      closedDate,
      verified,
      description,
      requiredSkills,
      qualifications,
      companyWebsite,
      category,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      success: false,
      message: "Error updating job",
      error: error.message,
    });
  }
};

// Delete job by ID
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, userType } = req.user; // Get email from token for authorization

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user owns the job
    const canDelete = userType === "admin" || job.email === email;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own jobs",
      });
    }
    await job.destroy();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting job",
      error: error.message,
    });
  }
};

// Get jobs by current user (from token)
export const getMyJobs = async (req, res) => {
  try {
    const { email, userType } = req.user;

    const jobs = await Job.findAll({
      where: { email, userType },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};
