export type ReceivedFiles = MulterDiskUploadedFiles | undefined;

interface MulterDiskUploadedFiles {
  [fieldname: string]: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  }[];
}
