import { DateFilter } from '../../types/date-filter';
import { generateDate, getRandomString } from '../../utils/dummy-data';
import { IFeedback } from '../model/feedback';
import { CUSTOMERS } from './customers';
import { TRANSACTIONS } from './transactions';

export function getDummyFeedbacks(): IFeedback[] {
  const feedbacks = Array.from({ length: 10 }, (_, index) => {
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    return {
      id: index,
      feedback: `This is feedback number ${index + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      createdAt: generateDate(DateFilter.LAST_4_WEEKS),
      updatedAt: generateDate(DateFilter.LAST_4_WEEKS),
      profile: customer,
      comment: getRandomString(10, 100),
      transaction: TRANSACTIONS.filter(
        (transaction) =>
          transaction.user.id ===
          CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)].id
      )[0],
    };
  }).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return feedbacks;
}
