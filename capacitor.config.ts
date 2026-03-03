import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'TuMascota',
  webDir: 'www',
  android: {
    allowMixedContent: true
  },
  server: {
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;
