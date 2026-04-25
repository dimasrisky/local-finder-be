export interface IUser {
  username: string;
  fullName: string | null;
  password: string;
  email: string;
  currentRequest: number;
}
