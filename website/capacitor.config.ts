import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dust.web',
  appName: 'dust-web',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
