import { Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

export default <Routes>[
  {
    path: '',
    component: TransactionsComponent,
  },
  {
    path: ':transactionId',
    component: TransactionDetailComponent,
  },
];
