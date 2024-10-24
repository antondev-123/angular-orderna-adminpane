import { PaymentType } from '../../app/model/enum/payment-type';
import { Role } from '../../app/model/enum/role';
import { Status } from '../../app/model/enum/status';
import { TransactionStatus } from '../../app/model/enum/transaction-status';
import { DateFilter } from '../../types/date-filter';
import { DateGroup } from '../../types/date-group';
import { FilterOptionItem } from '../../types/filter';

export const DATE_FILTER_OPTIONS: FilterOptionItem<DateFilter>[] = [
  {
    label: 'Today',
    value: DateFilter.TODAY,
  },
  {
    label: 'Last 7 Days',
    value: DateFilter.LAST_7_DAYS,
  },
  {
    label: 'Last 4 Weeks',
    value: DateFilter.LAST_4_WEEKS,
  },
  {
    label: 'Last 12 Months',
    value: DateFilter.LAST_12_MONTHS,
  },
  {
    label: 'Max',
    value: DateFilter.MAX,
  },
];

export const STATUS_FILTER_OPTIONS: FilterOptionItem<Status>[] = [
  {
    label: 'Active',
    value: Status.ACTIVE,
  },
  {
    label: 'Inactive',
    value: Status.INACTIVE,
  },
  {
    label: 'Pending',
    value: Status.PENDING,
  },
];

export const ROLE_FILTER_OPTIONS: FilterOptionItem<Role>[] = [
  {
    label: 'Admin',
    value: Role.ADMIN,
  },
  {
    label: 'Manager',
    value: Role.MANAGER,
  },
  {
    label: 'Cashier',
    value: Role.CASHIER,
  },
];

export const TRANSACTION_STATUS_FILTER_OPTIONS: FilterOptionItem<TransactionStatus>[] =
  [
    { label: 'Approved', value: TransactionStatus.APPROVED },
    { label: 'Pending', value: TransactionStatus.PENDING },
    { label: 'Refunded', value: TransactionStatus.REFUNDED },
    { label: 'Fail', value: TransactionStatus.FAIL },
    { label: 'Completed', value: TransactionStatus.COMPLETED },
    { label: 'Void', value: TransactionStatus.VOID },
    { label: 'Parked', value: TransactionStatus.PARKED },
  ];

export const PAYMENT_FILTER_OPTIONS: FilterOptionItem<PaymentType>[] = [
  {
    label: 'Cash',
    value: PaymentType.CASH,
  },
  {
    label: 'Credit Card',
    value: PaymentType.CREDIT_CARD,
  },
  {
    label: 'Debit Card',
    value: PaymentType.DEBIT_CARD,
  },
  {
    label: 'Gcash',
    value: PaymentType.GCASH,
  },
];

export const PAYMENTTYPE_FILTER_OPTIONS: FilterOptionItem<PaymentType>[] = [
  {
    label: 'cash',
    value: PaymentType.CASH,
  },
  {
    label: 'credit card',
    value: PaymentType.CREDIT_CARD,
  },
  {
    label: 'debit card',
    value: PaymentType.DEBIT_CARD,
  },
  {
    label: 'gcash',
    value: PaymentType.GCASH,
  },
];

export const FEEDBACK_AVERAGE_GROUP_FILTER_OPTIONS: FilterOptionItem<DateGroup>[] =
  [
    {
      label: '',
      value: DateGroup.NONE,
    },
    {
      label: 'Day',
      value: DateGroup.DAY,
    },
    {
      label: 'Week',
      value: DateGroup.WEEK,
    },
    {
      label: 'Month',
      value: DateGroup.MONTH,
    },
    {
      label: 'Year',
      value: DateGroup.YEAR,
    },
  ];
