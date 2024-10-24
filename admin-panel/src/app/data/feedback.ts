import { generateDate, getRandomNumber } from '../../utils/dummy-data';
import { Feedback } from '../model/feedback';
import { USER_PROFILES } from './user-profiles';
import { DateFilter } from '../../types/date-filter';
import { STORES } from './stores';

export const FEEDBACKS = USER_PROFILES.reduce((acc: Feedback[], profile) => {
  let feedbackCount = getRandomNumber(1000, 1000);
  while (feedbackCount--) {
    acc.push(
      new Feedback({
        id: getRandomNumber(10000000, 99999999),
        profile: profile,
        rating: getRandomNumber(3, 5),
        feedbackComment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ex enim, auctor non mi a, pharetra elementum lectus. Duis elementum maximus tellus id posuere. Nulla rhoncus ultricies volutpat. Quisque risus augue, accumsan et est in, ornare luctus lorem.',
        createdAt: generateDate(DateFilter.LAST_12_MONTHS),
        store: STORES[getRandomNumber(1, 5)],
      })
    );
  }
  return acc;
}, []);
