declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_EMAIL: string;
      GOOGLE_PRIVATE_KEY: string;
      APP_PORT: string;
      DRIVE_PHOTOS_FOLDER_ID: string;
    }
  }
}

export { }