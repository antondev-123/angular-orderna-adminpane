import { getRandomItem } from '../../utils/dummy-data';
import { UserProfile } from '../model/user-profile';
import { STORES } from './stores';
import { USERS } from './users';

export const USER_PROFILES = USERS.reduce((acc: UserProfile[], user) => {
  acc.push({
    id: user.id,
    user: user,
    accountName: user.fullName,
    affiliatedStores: getRandomItem(STORES).name,
  });

  return acc;
}, []);
