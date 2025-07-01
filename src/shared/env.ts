type EnvType = {
   API_URL: string;
};

export const env: EnvType = {
   API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};
