import { envConfig } from './env.config';

if (!envConfig.apiUrl) {
  console.error('[environment] API URL is not configured. Check your .env.local file.');
}

export const environment = {
  production: true,
  apiUrl: envConfig.apiUrl,
};
