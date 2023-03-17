export interface Media {
  id: number;
  fileUrl: string;
  name: string;
  mimetype?: string;
  size?: string;
  type?: string;
  path?: string;
  userId?: number;
  createdAt?: Date;
  user?: {
    id: number;
    username: string;
  };
}
