import { defineConfig } from 'mobilewright';

const config: MobilewrightConfig = {
  // tests are in the current directory
  testDir: '.',

  // if a test fails, don't try it again
  retries: 0,

  // bundle identifier of our app under test
  bundleId: 'com.mobilenext.Milliways',

  // install this app before starting
  installApps: "../build/Milliways-unsigned.ipa",

  // we want both list on screen, and an html directory
  reporter: [
    ['list'],
    ['html'],
  ],
};

// if environmet exists, we'll use mobile-use driver and allocate a device on the cloud
// otherwise we run it on a device locally with mobilecli
if (process.env['MOBILE_USE_API_KEY']) {
  config.driver = {
    type: 'mobile-use',
    apiKey: process.env['MOBILE_USE_API_KEY'],
  };
}

export default defineConfig(config);

