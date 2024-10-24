import { Store } from './store';

export interface IZReport {
  id: number;
  date: Date;
  totalTransactions: number;
  grossRevenues: number;
  cardPayments: number;
  cashPayments: number;
  tips: number;
  serviceCharges: number;
  averageValue: number;
  deliveryFees: number;
  discounts: number;
  quantityOfRefunds: number;
  totalRefunds: number;
  store: Store;
}

export class ZReport implements IZReport {
  id: number;
  date: Date;
  totalTransactions: number;
  grossRevenues: number;
  cardPayments: number;
  cashPayments: number;
  tips: number;
  serviceCharges: number;
  averageValue: number;
  deliveryFees: number;
  discounts: number;
  quantityOfRefunds: number;
  totalRefunds: number;
  store: Store;

  constructor(
    id = 0,
    date = new Date(),
    totalTransactions = 0,
    grossRevenues = 0,
    cardPayments = 0,
    cashPayments = 0,
    tips = 0,
    serviceCharges = 0,
    averageValue = 0,
    deliveryFees = 0,
    discounts = 0,
    quantityOfRefunds = 0,
    totalRefunds = 0,
    store = new Store()
  ) {
    this.id = id;
    this.date = date;
    this.totalTransactions = totalTransactions;
    this.grossRevenues = grossRevenues;
    this.cardPayments = cardPayments;
    this.cashPayments = cashPayments;
    this.tips = tips;
    this.serviceCharges = serviceCharges;
    this.averageValue = averageValue;
    this.deliveryFees = deliveryFees;
    this.discounts = discounts;
    this.quantityOfRefunds = quantityOfRefunds;
    this.totalRefunds = totalRefunds;
    this.store = store;
  }
}
