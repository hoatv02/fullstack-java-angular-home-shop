export interface IUserAuth {
  userId: string;
  userName: string;
  fullName: string;
  accessToken: string;
  authenType: string;
  userType: number;
  orgId: string;
  identityId: string;
  lock: boolean | null;
}