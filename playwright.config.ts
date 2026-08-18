import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect:{timeout: 10000},
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.TEST_BASE_URL,
    trace: 'on-first-retry',
    // Otorga permiso de geolocalización a todos los tests
    permissions: ['geolocation'],
    geolocation: { latitude: -12.1222, longitude: -77.0305 }
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'] 
      },
    },
  ],
});
