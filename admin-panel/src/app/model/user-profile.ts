import { User } from './user';

export interface IUserProfile {
  id: number;
  user: User;
  accountName: string;
  affiliatedStores: string;
}

export type UserProfileUpdateData = Pick<
  IUserProfile,
  'id' | 'accountName' | 'affiliatedStores'
>;

export class UserProfile implements IUserProfile {
  id: number;
  user: User;
  accountName: string;
  affiliatedStores: string;

  constructor({
    id = 0,
    user = new User(),
    accountName = '',
    affiliatedStores = '',
  }: Partial<UserProfile>) {
    this.id = id;
    this.user = user;
    this.accountName = accountName;
    this.affiliatedStores = affiliatedStores;
  }
}
