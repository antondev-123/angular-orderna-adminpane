import { Supplier } from '../model/supplier';
import { generateDate } from '../../utils/dummy-data';
import { DateFilter } from '../../types/date-filter';
import { Status } from '../model/enum/status';
import { PaymentType } from '../model/enum/payment-type';

export const SUPPLIERS: Supplier[] = [
  {
    id: 1,
    firstName: 'Patricia',
    lastName: 'Semklo',
    email: 'patricia.semklo@app.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 24,
    lastOrder: '#123567',
    toatlSpend: 2890.66,
    refunds: 0,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.CASH,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Tesla',
  },
  {
    id: 2,
    firstName: 'Dominik',
    lastName: 'Lamakani',
    email: 'dominik.lamakani@gmail.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 77,
    lastOrder: '#779912',
    toatlSpend: 14767.04,
    refunds: 4,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.CREDIT_CARD,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Tesla',
  },
  {
    id: 3,
    firstName: 'Ivan',
    lastName: 'Mesaros',
    email: 'imivanmes@gmail.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 44,
    lastOrder: '#889924',
    toatlSpend: 4996.0,
    refunds: 1,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.DEBIT_CARD,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Tesla',
  },
  {
    id: 4,
    firstName: 'Maria',
    lastName: 'Martinez',
    email: 'martinezhome@gmail.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 29,
    lastOrder: '#897726',
    toatlSpend: 3220.66,
    refunds: 2,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.GCASH,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Tesla',
  },
  {
    id: 5,
    firstName: 'Vicky',
    lastName: 'Jung',
    email: 'itsvicky@contact.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 22,
    lastOrder: '#123567',
    toatlSpend: 2890.66,
    refunds: 0,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.CASH,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Tesla',
  },
  {
    id: 6,
    firstName: 'Dominik',
    lastName: 'Lamakani',
    email: 'dominik.lamakani@gmail.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 77,
    lastOrder: '#779912',
    toatlSpend: 14767.04,
    refunds: 4,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.CASH,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Tesla',
  },
  {
    id: 7,
    firstName: 'Tisho',
    lastName: 'Yanchev',
    email: 'tisho.y@kurlytech.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 14,
    lastOrder: '#896644',
    toatlSpend: 1649.99,
    refunds: 1,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.CASH,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Tesla',
  },
  {
    id: 8,
    firstName: 'James',
    lastName: 'Cameron',
    email: 'james.ceo@james.tech',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 34,
    lastOrder: '#136988',
    toatlSpend: 3569.87,
    refunds: 2,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.CREDIT_CARD,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Tesla',
  },
  {
    id: 9,
    firstName: 'Haruki',
    lastName: ' Masuno',
    email: 'haruki@supermail.jp',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 112,
    lastOrder: '#442206',
    toatlSpend: 19246.07,
    refunds: 6,
    store: '2',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.ACTIVE,
    paymentType: PaymentType.DEBIT_CARD,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Nokia',
  },
  {
    id: 10,
    firstName: 'Joe',
    lastName: 'Huang',
    email: 'joehuang@hotmail.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 64,
    lastOrder: '#764321',
    toatlSpend: 12276.92,
    refunds: 0,
    store: '1',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.INACTIVE,
    paymentType: PaymentType.GCASH,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'Apple',
  },
  {
    id: 11,
    firstName: 'Carolyn',
    lastName: 'McNeail',
    email: 'carolynlove@gmail.com',
    zipCode: '1000',
    city: 'Manila',
    street: '123 Sizzling Street',
    orders: 19,
    lastOrder: '#908764',
    toatlSpend: 1289.97,
    refunds: 2,
    store: '2',
    createdAt: generateDate(DateFilter.TODAY),
    updatedAt: new Date('2024-05-02T14:30:00Z'),
    note: 'this is a note',
    status: Status.PENDING,
    paymentType: PaymentType.CASH,
    mobileNumber: '+631234567891',
    telephoneNumber: '+65123466789',
    company: 'facebbok',
  },
].map((item) => Supplier.fromJSON(item));
