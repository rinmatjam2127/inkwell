// @ts-check 
import { defineConfig, devices } from "@playwright/test"; 

/** 
 * @see https://playwright.dev/docs/test-configuration 
 */ 
export default defineConfig({ 
  testDir: "./e2e", 
  /* Run tests in files in parallel */ 
  fullyParallel: true, 
  /* Fail the build on CI if you accidentally left test.only in the source code. */ 
  forbidOnly: !!process.env.CI, 
  /* Retry on CI only */ 
  retries: process.env.CI ? 2 : 0, 
  /* Opt out of parallel tests on CI. */ 
  workers: process.env.CI ? 1 : undefined, 
  /* Reporter to use. See [suspicious link removed] */ 
  reporter: "html", 
  /* Shared settings for all the projects below. */ 
  use: { 
    /* Collect trace when retrying the failed test. */ 
    trace: "on-first-retry", 
  }, 
  /* Configure projects for major browsers */ 
  projects: [ 
    { 
      name: "chromium", 
      use: { ...devices["Desktop Chrome"] }, 
    }, 
    { 
      name: "firefox", 
      use: { ...devices["Desktop Firefox"] }, 
    }, 
    { 
      name: "webkit", 
      use: { ...devices["Desktop Safari"] }, 
    }, 
  ], 
  /* Run your local dev servers before starting the tests */ 
    /* Run your local dev servers before starting the tests */ 
    webServer: [ 
      { 
        command: "npm run dev", 
        cwd: "./server", 
        port: 4000, 
        reuseExistingServer: !process.env.CI, 
      }, 
      { 
        command: "npm run dev", 
        cwd: "./client", 
        url: "http://localhost:5173", 
        reuseExistingServer: !process.env.CI,
        timeout: 60000,       // 👈 Gives Vite extra time to spin up and bundle
        stdout: "pipe",       // 👈 Streams client console logs into your terminal output
        stderr: "pipe",
      }, 
    ],    
});