import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dust.web',
  appName: 'dust-web',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
