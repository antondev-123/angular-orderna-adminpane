import { DateFilter } from '../../types/date-filter';
import { generateDate } from '../../utils/dummy-data';
import { Customer } from '../model/customer';
import { CurrencyCode } from '../model/enum/currency-code';

export const CUSTOMERS: Customer[] = [
  {
    id: 1,
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2022-05-10'),
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '+639123456789',
    telephone: '+63212345678',
    email: 'john@example.com',
    birthday: new Date('1985-08-15'),
    note: 'Regular customer',
    company: 'ABC Company',
    zipCode: '1234',
    city: 'Makati',
    street: '123 Main St',
  },
  {
    id: 2,
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2022-05-11'),
    firstName: 'Jane',
    lastName: 'Doe',
    mobileNumber: '+639987654321',
    telephone: '+63212345678',
    email: 'jane@example.com',
    birthday: new Date('1990-03-20'),
    note: 'VIP customer',
    company: 'XYZ Corporation',
    zipCode: '5678',
    city: 'Quezon City',
    street: '456 Elm St',
  },
  {
    id: 3,
    createdAt: generateDate(DateFilter.LAST_7_DAYS),
    updatedAt: new Date('2022-05-12'),
    firstName: 'Michael',
    lastName: 'Smith',
    mobileNumber: '+639876543210',
    telephone: '+63212345678',
    email: 'michael@example.com',
    birthday: new Date('1982-11-10'),
    note: 'Preferred customer',
    company: 'DEF Enterprises',
    zipCode: '9012',
    city: 'Manila',
    street: '789 Oak St',
  },
  {
    id: 4,
    createdAt: generateDate(DateFilter.LAST_7_DAYS),
    updatedAt: new Date('2022-05-13'),
    firstName: 'Michael',
    lastName: 'Johnson',
    mobileNumber: '+639765432109',
    telephone: '+63212345678',
    email: 'emily@example.com',
    birthday: new Date('1978-06-25'),
    note: 'New customer',
    company: 'GHI Industries',
    zipCode: '3456',
    city: 'Pasig',
    street: '987 Pine St',
  },
  {
    id: 5,
    createdAt: generateDate(DateFilter.LAST_4_WEEKS),
    updatedAt: new Date('2022-05-14'),
    firstName: 'David',
    lastName: 'Williams',
    mobileNumber: '+639654321098',
    telephone: '+63212345678',
    email: 'david@example.com',
    birthday: new Date('1995-02-18'),
    note: 'Frequent customer',
    company: 'JKL Corporation',
    zipCode: '7890',
    city: 'Taguig',
    street: '654 Birch St',
  },
  {
    id: 6,
    createdAt: generateDate(DateFilter.LAST_4_WEEKS),
    updatedAt: new Date('2022-05-15'),
    firstName: 'Sarah',
    lastName: 'Brown',
    mobileNumber: '+639543210987',
    telephone: '+63212345678',
    email: 'sarah@example.com',
    birthday: new Date('1989-09-30'),
    note: 'Loyal customer',
    company: 'MNO Corporation',
    zipCode: '2345',
    city: 'Cebu City',
    street: '321 Cedar St',
  },
  {
    id: 7,
    createdAt: generateDate(DateFilter.LAST_12_MONTHS),
    updatedAt: new Date('2022-05-16'),
    firstName: 'Christopher',
    lastName: 'Lee',
    mobileNumber: '+639432109876',
    telephone: '+63212345678',
    email: 'christopher@example.com',
    birthday: new Date('1980-04-12'),
    note: 'Regular customer',
    company: 'PQR Enterprises',
    zipCode: '6789',
    city: 'Davao City',
    street: '876 Maple St',
  },
  {
    id: 8,
    createdAt: generateDate(DateFilter.LAST_12_MONTHS),
    updatedAt: new Date('2022-05-17'),
    firstName: 'Jessica',
    lastName: 'Martinez',
    mobileNumber: '+639321098765',
    telephone: '+63212345678',
    email: 'jessica@example.com',
    birthday: new Date('1976-12-03'),
    note: 'Preferred customer',
    company: 'STU Industries',
    zipCode: '1234',
    city: 'Antipolo',
    street: '543 Pine St',
  },
  {
    id: 9,
    createdAt: generateDate(DateFilter.MAX),
    updatedAt: new Date('2022-05-18'),
    firstName: 'Daniel',
    lastName: 'Garcia',
    mobileNumber: '+639210987654',
    telephone: '+63212345678',
    email: 'daniel@example.com',
    birthday: new Date('1992-07-08'),
    note: 'Frequent customer',
    company: 'VWX Corporation',
    zipCode: '5678',
    city: 'Bacolod City',
    street: '432 Oak St',
  },
  {
    id: 10,
    createdAt: generateDate(DateFilter.MAX),
    updatedAt: new Date('2022-05-19'),
    firstName: 'Amanda',
    lastName: 'Rodriguez',
    mobileNumber: '+639109876543',
    telephone: '+63212345678',
    email: 'amanda@example.com',
    birthday: new Date('1987-01-22'),
    note: 'New customer',
    company: 'YZ Corporation',
    zipCode: '9012',
    city: 'Iloilo City',
    street: '765 Cedar St',
  },
].map((item) =>
  Customer.fromJSON({
    ...item,
    ...{
      totalTransactions: 0,
      totalRefunds: 0,
      totalAmountSpent: 0,
      lastTransactionDate: new Date(),
      lastTransactionId: '',
      averageAmountSpentPerTransaction: 0,
      currencyCode: CurrencyCode.PHP,
    },
  })
);
