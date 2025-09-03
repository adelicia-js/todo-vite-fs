interface Config {
  API_URL: string;
  NODE_ENV: string;
}

const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
};

const getConfig = (): Config => {
  const nodeEnv = import.meta.env.MODE || 'development';
  
  let apiUrl: string;
  
  if (nodeEnv === 'production') {
    apiUrl = validateEnvVar('VITE_API_URL', import.meta.env.VITE_API_URL);
  } else {
    apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  // Validate API URL format
  try {
    new URL(apiUrl);
  } catch {
    throw new Error(`Invalid API URL format: ${apiUrl}`);
  }

  return {
    API_URL: apiUrl,
    NODE_ENV: nodeEnv,
  };
};

export const config = getConfig();