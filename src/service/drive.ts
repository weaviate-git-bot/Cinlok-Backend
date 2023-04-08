import { drive } from "@googleapis/drive";
import { GoogleAuth } from "google-auth-library";
import { Readable } from "stream";

const oAuth2Client = new GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const service = drive({
  version: "v3",
  auth: oAuth2Client,
});

// If you want to add more folders, add them here
const folders = {
  photos: process.env.DRIVE_PHOTOS_FOLDER_ID,
  univ_logo: process.env.DRIVE_UNIV_LOGO_FOLDER_ID,
};

type FolderName = keyof typeof folders;

const uploadFile = async (file: Express.Multer.File, folderName: FolderName, filename: string) => {
  const fileMetadata = {
    name: filename,
    parents: [folders[folderName]],
  };
  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.buffer),
  };

  const res = await service.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });

  if (!res.data.id) {
    return null;
  }
  return res.data.id!;
};

const deleteFile = async (fileId: string) => {
  try {
    const res = await service.files.delete({
      fileId: fileId,
    });
    return res.data;
  } catch (err) {
    // Sometimes, the file is not found, so we just ignore it
    console.log(err);
    return null;
  }
};

const getFiles = async (folderName: FolderName) => {
  const res = await service.files.list({
    q: `'${folders[folderName]}' in parents`,
    fields: "files(id, name, mimeType, webViewLink, webContentLink)",
  });
  return res.data.files;
};

const DriveService = {
  uploadFile,
  deleteFile,
  getFiles,
  folderNames: Object.keys(folders) as [FolderName, ...FolderName[]],
};
export default DriveService;
