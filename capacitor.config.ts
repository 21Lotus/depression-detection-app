import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ee192d37d5c1476db7be9c777b386f92',
  appName: 'depression-detection-app',
  webDir: 'dist',
  server: {
    url: 'https://ee192d37-d5c1-476d-b7be-9c777b386f92.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;