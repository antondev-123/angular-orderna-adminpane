import { Maybe } from '../../types/maybe';
import { QueryOptions } from '../../types/query-options';
import { getRandomNumber } from '../../utils/dummy-data';
import { PaymentType } from '../model/enum/payment-type';
import { IZReport } from '../model/z-report';
import { TRANSACTIONS } from './transactions';
import { TransactionStatus } from '../model/enum/transaction-status';

function getDatesInRange(min: Date, max: Date): Date[] {
  const dateArray: Date[] = [];
  let currentDate = new Date(min);

  while (currentDate <= max) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export function fetchZReports(
  options: QueryOptions<IZReport>
): Maybe<IZReport[]> {
  const dateFilterValue = options.dateFilter;

  if (dateFilterValue) {
    const storeFilterValue =
      options.filters?.find((f) => f.field === 'store')?.value ?? [];

    const [startDateValue, endDateValue] = dateFilterValue.split('_');

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let count = 0;

    const reports = getDatesInRange(startDate, endDate).map((date) => {
      const transactions = TRANSACTIONS.filter(
        (transaction) =>
          transaction.transactionDate.toLocaleDateString() ===
            date.toLocaleDateString() &&
          storeFilterValue.includes(`${transaction.store.id}`)
      );

      const grossRevenues = transactions
        .map((transaction) => transaction.grossAmount)
        .reduce((acc, grossAmount) => acc + grossAmount, 0);

      const cardPayments = transactions
        .filter(
          (transaction) =>
            transaction.paymentType === PaymentType.DEBIT_CARD ||
            transaction.paymentType === PaymentType.CREDIT_CARD
        )
        .map((transaction) => transaction.grossAmount)
        .reduce((acc, grossAmount) => acc + grossAmount, 0);

      const cashPayments = transactions
        .filter((transaction) => transaction.paymentType === PaymentType.CASH)
        .map((transaction) => transaction.grossAmount)
        .reduce((acc, grossAmount) => acc + grossAmount, 0);

      const tips = transactions
        .map((transaction) => transaction.tip)
        .reduce((acc: number, tip) => acc + (tip ?? 0), 0);

      const serviceCharges = transactions
        .map((transaction) => transaction.service)
        .reduce((acc, service) => acc + service, 0);

      const averageValue =
        grossRevenues > 0
          ? (grossRevenues - ((tips ?? 0) + serviceCharges)) /
            transactions.length
          : 0;

      const discounts = transactions
        .map((transaction) => transaction.discountAmount)
        .reduce((acc, discount) => acc + discount, 0);

      const refunds = transactions.filter(
        (transaction) => transaction.status === TransactionStatus.REFUNDED
      );

      const totalRefunds = refunds
        .map((refund) => refund.grossAmount)
        .reduce((acc, grossAmount) => acc + grossAmount, 0);

      count++;
      return {
        id: count,
        date,
        totalTransactions: transactions.length,
        grossRevenues,
        cardPayments,
        cashPayments,
        tips,
        serviceCharges,
        averageValue,
        deliveryFees: getRandomNumber(0, 100),
        discounts,
        quantityOfRefunds: refunds.length,
        totalRefunds,
      } as IZReport;
    });

    return reports;
  }

  return [];
}
