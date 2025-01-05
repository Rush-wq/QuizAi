const BACKEND_URL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_BACKEND_DEV_URL
  : import.meta.env.VITE_BACKEND_PROD_URL;

const QUIZ_API_PATH = import.meta.env.VITE_QUIZ_GENERATION_API_URL;

export const QUIZ_API_URL = `${BACKEND_URL}${QUIZ_API_PATH}`;