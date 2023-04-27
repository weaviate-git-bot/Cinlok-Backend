declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_EMAIL: string;
      GOOGLE_PRIVATE_KEY: string;
      APP_PORT: string;
      DRIVE_PHOTOS_FOLDER_ID: string;
      DRIVE_UNIV_LOGO_FOLDER_ID: string;
      MIXER_BASE_URL: string;
      GOOGLE_APPLICATION_CREDENTIALS: string;
      WEAVIATE_HOST: string;
    }
  }
}

export { };