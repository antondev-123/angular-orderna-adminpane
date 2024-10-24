import { Role } from '@orderna/admin-panel/src/app/model/enum/role';
import { Status, WithStatus } from './enum/status';

export interface IUser extends WithStatus {
  id: number;
  role: Role;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: {
    countryCode: string;
    number: string;
  };
  jobTitle: string;
  isOnboardingCompleted: boolean;
}

export const USER_FIELDS: (keyof IUser)[] = [
  'id',
  'role',
  'token',
  'createdAt',
  'updatedAt',
  'username',
  'password',
  'firstName',
  'lastName',
  'email',
  'mobile',
  'jobTitle',
];

export type UserCredentials = Pick<IUser, 'email' | 'password'>;
export type UserRegistrationData = UserCredentials &
  Pick<IUser, 'firstName' | 'lastName' | 'mobile' | 'jobTitle' | 'username'>;
export type UserCreateData = Pick<
  IUser,
  'firstName' | 'lastName' | 'email' | 'mobile' | 'jobTitle' | 'role'
>;
export type UserUpdateData = UserCreateData & Pick<IUser, 'status' | 'id'>;

export class User implements IUser {
  constructor(
    public readonly id = 0,
    public readonly firstName = '',
    public readonly lastName = '',
    public readonly username = '',
    public readonly password = '',
    public readonly email = '',
    public readonly mobile = { countryCode: '', number: '' },
    public readonly role = Role.CASHIER,
    public readonly status = Status.ACTIVE,
    public readonly jobTitle = '',
    public readonly token = '',
    public isOnboardingCompleted = false,
    public readonly createdAt = new Date(),
    public readonly updatedAt = new Date()
  ) {}

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  static fromJSON(json: IUser) {
    return new User(
      json.id,
      json.firstName,
      json.lastName,
      json.username,
      json.password,
      json.email,
      json.mobile,
      json.role,
      json.status,
      json.jobTitle,
      json.token,
      json.isOnboardingCompleted,
      json.createdAt,
      json.updatedAt
    );
  }
}
