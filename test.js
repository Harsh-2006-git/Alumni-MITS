// testJobCreation.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:3001/job';

// Get current date
const now = new Date();

// Create test jobs with different scenarios
const testJobs = [
  // Job expired 2 days ago (should be deleted in cleanup)
  {
    title: "TEST JOB - EXPIRED 2 DAYS AGO",
    company: "Test Company A",
    type: "full-time",
    location: "Remote",
    salary: "$50k-$70k",
    experience: "0-2 years",
    applicationDeadline: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    description: "This job should be deleted in cleanup",
    requiredSkills: ["JavaScript", "React"],
    qualifications: ["Bachelor's degree"],
    category: "Software Development",
    email: "test@companya.com",
    userType: "Auto",
    isAutoPosted: true, // Critical for cleanup
    status: "active",
  },
  
  // Job expired 1 hour ago (should be deleted in cleanup)
  {
    title: "TEST JOB - EXPIRED 1 HOUR AGO",
    company: "Test Company B",
    type: "part-time",
    location: "On-site",
    salary: "$30k-$50k",
    experience: "1-3 years",
    applicationDeadline: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    description: "This job expired recently",
    requiredSkills: ["Python", "Django"],
    qualifications: ["Master's degree"],
    category: "Data Science & AI",
    email: "test@companyb.com",
    userType: "Auto",
    isAutoPosted: true,
    status: "active",
  },
  
  // Job with future deadline (should NOT be deleted)
  {
    title: "TEST JOB - FUTURE DEADLINE",
    company: "Test Company C",
    type: "contract",
    location: "Hybrid",
    salary: "$80k-$100k",
    experience: "5-8 years",
    applicationDeadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    description: "This job has future deadline",
    requiredSkills: ["AWS", "Docker"],
    qualifications: ["Bachelor's degree"],
    category: "DevOps & Cloud",
    email: "test@companyc.com",
    userType: "Auto",
    isAutoPosted: true,
    status: "active",
  },
  
  // Manual job (not auto-posted) with past deadline (should NOT be auto-deleted)
  {
    title: "MANUAL JOB - EXPIRED",
    company: "Manual Company",
    type: "full-time",
    location: "Office",
    salary: "$60k-$80k",
    experience: "2-4 years",
    applicationDeadline: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    description: "This is a manual job that should not be auto-deleted",
    requiredSkills: ["Java", "Spring"],
    qualifications: ["Bachelor's degree"],
    category: "Software Development",
    email: "manual@company.com",
    userType: "alumni", // Not Auto
    isAutoPosted: false, // Important: false
    status: "active",
  }
];

// Function to create a job via API
async function createJob(jobData) {
  try {
    console.log(`\n📤 Creating job: ${jobData.title}`);
    console.log(`Deadline: ${jobData.applicationDeadline.toISOString()}`);
    console.log(`Is Auto Posted: ${jobData.isAutoPosted}`);
    
    const response = await axios.post(`${API_URL}/create-job`, jobData);
    
    console.log(`✅ Created successfully!`);
    console.log(`Response:`, response.data);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create job: ${jobData.title}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error:`, error.response.data);
    } else {
      console.error(`Error:`, error.message);
    }
    return null;
  }
}

// Function to check existing jobs
async function checkJobs() {
  try {
    console.log("\n📋 Checking existing jobs...");
    
    // First, let's get all jobs
    const response = await axios.get(`${API_URL}/getAllJobs`);
    
    const allJobs = response.data;
    console.log(`Total jobs in database: ${allJobs.length}`);
    
    // Count auto-posted jobs
    const autoJobs = allJobs.filter(job => job.isAutoPosted);
    console.log(`Auto-posted jobs: ${autoJobs.length}`);
    
    // Count expired auto-posted jobs
    const now = new Date();
    const expiredAutoJobs = autoJobs.filter(job => 
      new Date(job.applicationDeadline) < now
    );
    console.log(`Expired auto-posted jobs: ${expiredAutoJobs.length}`);
    
    // Show sample of expired auto jobs
    if (expiredAutoJobs.length > 0) {
      console.log("\n🔍 Sample expired auto jobs:");
      expiredAutoJobs.slice(0, 3).forEach(job => {
        console.log(`  • ${job.title} - ${job.company}`);
        console.log(`    Deadline: ${job.applicationDeadline}`);
        console.log(`    Status: ${job.status}`);
        console.log(`    ID: ${job._id}`);
      });
    }
    
    return {
      totalJobs: allJobs.length,
      autoJobs: autoJobs.length,
      expiredAutoJobs: expiredAutoJobs.length
    };
  } catch (error) {
    console.error("❌ Failed to check jobs:", error.message);
    return null;
  }
}

// Function to manually test the cleanup query
async function testCleanupQuery() {
  try {
    console.log("\n🔍 Testing cleanup query directly...");
    
    const now = new Date();
    console.log(`Current time: ${now.toISOString()}`);
    
    // Test the exact query that should find expired auto jobs
    const query = {
      applicationDeadline: { $lt: now.toISOString() },
      isAutoPosted: true
    };
    
    console.log("Query:", JSON.stringify(query, null, 2));
    
    // Try to get jobs matching this query
    const response = await axios.post(`${API_URL}/test-query`, {
      query: query,
      collection: 'jobs'
    });
    
    console.log(`Query found ${response.data.count} jobs`);
    if (response.data.jobs && response.data.jobs.length > 0) {
      console.log("Sample matches:");
      response.data.jobs.slice(0, 3).forEach(job => {
        console.log(`  • ${job.title}`);
        console.log(`    Deadline: ${job.applicationDeadline}`);
        console.log(`    Is Auto: ${job.isAutoPosted}`);
      });
    }
    
    return response.data;
  } catch (error) {
    console.error("❌ Query test failed:", error.message);
    
    // If /test-query endpoint doesn't exist, try a different approach
    console.log("\n🔄 Trying alternative approach...");
    await checkJobs();
  }
}

// Main function
async function main() {
  console.log("🧪 STARTING JOB CLEANUP TEST");
  console.log("=".repeat(50));
  
  // Step 1: Check current state
  const beforeStats = await checkJobs();
  
  // Step 2: Create test jobs
  console.log("\n" + "=".repeat(50));
  console.log("📝 CREATING TEST JOBS");
  console.log("=".repeat(50));
  
  const createdJobs = [];
  for (const jobData of testJobs) {
    const result = await createJob(jobData);
    if (result) {
      createdJobs.push(result);
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }
  
  console.log(`\n✅ Created ${createdJobs.length} test jobs`);
  
  // Step 3: Test the cleanup query
  console.log("\n" + "=".repeat(50));
  console.log("🔍 TESTING CLEANUP QUERY");
  console.log("=".repeat(50));
  
  await testCleanupQuery();
  
  // Step 4: Check final state
  console.log("\n" + "=".repeat(50));
  console.log("📊 FINAL STATE");
  console.log("=".repeat(50));
  
  const afterStats = await checkJobs();
  
  console.log("\n" + "=".repeat(50));
  console.log("📈 SUMMARY");
  console.log("=".repeat(50));
  
  if (beforeStats && afterStats) {
    console.log(`Total jobs before: ${beforeStats.totalJobs}`);
    console.log(`Total jobs after: ${afterStats.afterStats}`);
    console.log(`Expired auto jobs before: ${beforeStats.expiredAutoJobs}`);
    console.log(`Expired auto jobs after: ${afterStats.expiredAutoJobs}`);
    console.log(`Difference: ${afterStats.expiredAutoJobs - beforeStats.expiredAutoJobs}`);
  }
  
  console.log("\n🎯 Now run your cleanup endpoint to see if jobs get deleted!");
  console.log("Expected results:");
  console.log("1. 'TEST JOB - EXPIRED 2 DAYS AGO' - SHOULD be deleted");
  console.log("2. 'TEST JOB - EXPIRED 1 HOUR AGO' - SHOULD be deleted");
  console.log("3. 'TEST JOB - FUTURE DEADLINE' - SHOULD NOT be deleted");
  console.log("4. 'MANUAL JOB - EXPIRED' - SHOULD NOT be deleted");
  
  console.log("\n🔗 Cleanup endpoint: POST http://localhost:3001/api/jobs/cleanup");
  console.log("   or whatever your cleanup endpoint is");
}

// Run the test
main().catch(console.error);