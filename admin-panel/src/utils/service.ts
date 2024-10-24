import {
  Observable,
  throwError,
  forkJoin,
  delay,
  of,
  tap,
  BehaviorSubject,
} from 'rxjs';
import { DateFilter, isDateFilter } from '../types/date-filter';
import { Maybe } from '../types/maybe';
import { QueryOptions } from '../types/query-options';
import { isKeyOf } from './is-key-of';
import { IAverageOrderValue } from '../app/model/average-order-value';
import { IBillingInvoice } from '../app/model/billing-invoice';
import { ICashRegister } from '../app/model/cash-register';
import { ICategorySale } from '../app/model/category-sale';
import { ICustomer } from '../app/model/customer';
import { IDailySummary } from '../app/model/daily-summary';
import { IDayOfWeekSale } from '../app/model/day-of-week-sale';
import { IDiscountDetail } from '../app/model/discount';
import { ISaleDiscountSummary } from '../app/model/discount-summary';
import { IDiscountedTransaction } from '../app/model/discounted-transaction';
import { IFailedTransaction } from '../app/model/failed-transaction';
import { IFeedback } from '../app/model/feedback';
import { IInventoryItem } from '../app/model/inventory';
import { IInvoice } from '../app/model/invoice';
import { IPrinterSetting } from '../app/model/printer-settings';
import { IProduct } from '../app/model/product';
import { IProductSale } from '../app/model/product-sale';
import { IPurchase } from '../app/model/purchase';
import { IRefundedTransaction } from '../app/model/refunded-transaction';
import { IRevenue } from '../app/model/revenue';
import { IStore } from '../app/model/store';
import { ISubscriptionPlan } from '../app/model/subscription-plan';
import { ISupplier } from '../app/model/supplier';
import { ITimeOfDaySale } from '../app/model/time-of-day-sale';
import { ITipsByDay } from '../app/model/tips-by-day';
import { ITransaction } from '../app/model/transaction';
import { IUser } from '../app/model/user';
import { IUserProfile } from '../app/model/user-profile';
import { IZReport } from '../app/model/z-report';

export type IData =
  | IUser
  | ICustomer
  | IStore
  | ITransaction
  | ISupplier
  | IProduct
  | IDiscountDetail
  | IUserProfile
  | IPrinterSetting
  | ISubscriptionPlan
  | IBillingInvoice
  | IInvoice
  | IFeedback
  | IInventoryItem
  | IPurchase
  | IDailySummary
  | IRevenue
  | IZReport
  | IAverageOrderValue
  | IDayOfWeekSale
  | ITimeOfDaySale
  | IProductSale
  | ICategorySale
  | ITipsByDay
  | ISaleDiscountSummary
  | IDiscountedTransaction
  | IRefundedTransaction
  | IFailedTransaction
  | ICashRegister;
export type Data<T extends K, K extends IData> = {
  items: T[];
  queryOptions: QueryOptions<K>;
  subject: BehaviorSubject<Maybe<T[]>>;
  totalSubject: BehaviorSubject<Maybe<number>>;
  totalAfterFilterSubject: BehaviorSubject<Maybe<number>>;
};

export function createItem<T extends K, K extends IData>(
  data: Data<T, K>,
  newItem: T
): Observable<K> {
  data.items.unshift(newItem);
  console.log('Item created:', newItem);

  return createObservableWithDelayAndRefresh(data, newItem);
}

export function updateItem<T extends K, K extends IData>(
  data: Data<T, K>,
  updatedItem: Partial<T>
): Observable<K> {
  const index = data.items.findIndex((u) => u.id === updatedItem.id);

  if (index === -1) {
    return throwError(
      () => new Error(`Item with ID ${updatedItem.id} not found`)
    );
  }

  Object.assign(data.items[index], updatedItem);
  return createObservableWithDelayAndRefresh(data, updatedItem);
}

export function deleteItem<T extends K, K extends IData>(
  data: Data<T, K>,
  itemId: T['id']
): Observable<K> {
  const index = data.items.findIndex((u) => u.id === itemId);

  if (index === -1) {
    return throwError(() => new Error(`Item with ID ${itemId} not found`));
  }

  const deletedItem = { ...data.items[index] };
  data.items.splice(index, 1);

  return createObservableWithDelayAndRefresh(data, deletedItem);
}

export function deleteItems<T extends K, K extends IData>(
  data: Data<T, K>,
  itemIds: T['id'][]
): Observable<K[]> {
  return forkJoin(itemIds.map((itemId) => deleteItem(data, itemId)));
}

export function deleteAllItems<T extends K, K extends IData>(
  data: Data<T, K>
): Observable<K[]> {
  return deleteItems(
    data,
    data.items.map((item) => item.id)
  );
}

export function deleteAllItemsExcept<T extends K, K extends IData>(
  data: Data<T, K>,
  itemIds: T['id'][]
): Observable<K[]> {
  return deleteItems(
    data,
    data.items.reduce((acc: T['id'][], item) => {
      if (!itemIds.includes(item.id)) {
        acc.push(item.id);
      }
      return acc;
    }, [])
  );
}

export function filterItems<T extends K, K extends IData>(
  data: Data<T, K>,
  options?: QueryOptions<K>,
  additionalFilter?: (item: K) => boolean
): Observable<Maybe<T[]>> {
  data.queryOptions = options ?? { page: 1, perPage: 10 };
  refreshItems(data, additionalFilter);
  return data.subject.asObservable().pipe(delay(1000));
}

export function getTotalItems<T extends K, K extends IData>(
  data: Data<T, K>
): Observable<Maybe<number>> {
  refreshTotalItems(data);
  return data.totalSubject.asObservable();
}

export function getItem<T extends K, K extends IData>(
  data: Data<T, K>,
  id: K['id']
): Observable<Maybe<T>> {
  const item = data.items.find((item) => item.id === id);
  return of(item).pipe(delay(1000));
}

export function createObservableWithDelayAndRefresh<
  T extends K,
  K extends IData
>(data: Data<T, K>, output: any) {
  return of(output).pipe(
    delay(3000),
    tap(() => {
      refreshTotalItems(data);
    }),
    tap(() => {
      refreshItems(data);
    })
  );
}

export function refreshTotalItems<T extends K, K extends IData>(
  data: Data<T, K>
) {
  data.totalSubject.next(data.items.length);
}

export function refreshItems<T extends K, K extends IData>(
  data: Data<T, K>,
  additionalFilter?: (item: K) => boolean
) {
  const items = data.items;
  if (!items) {
    return;
  }

  let filteredItems = [...items];
  const {
    page,
    perPage,
    searchQuery,
    filters,
    sort,
    dateFilter,
    searchFilters,
  } = data.queryOptions;

  if (searchQuery) {
    filteredItems = filteredItems.filter((item) =>
      Object.keys(item).some((k) => {
        const value = item[k as keyof T];

        if (typeof value === 'string') {
          return value.toLowerCase() === searchQuery.toLowerCase();
        }
        if (searchFilters && typeof value === 'object' && value !== null) {
          // return value.toLowerCase() === searchQuery.toLowerCase();
          const SearchFilter = searchFilters.find((_) => _.field == k);
          if (SearchFilter) {
            if (hasStringProperty(value, SearchFilter?.value)) {
              return (
                (value[SearchFilter?.value] as string).toLowerCase() ===
                searchQuery.toLowerCase()
              );
            }
          }
        }
        return false;
      })
    );
  }

  // Apply date filter if provided
  if (dateFilter) {
    let startDate: Date | number;
    let endDate: Date;

    if (isDateFilter(dateFilter)) {
      startDate = getStartDate(dateFilter as DateFilter);
      endDate = new Date(); // Assumes end date is always now (up to the current time)
    } else {
      const [start, end] = dateFilter.split('_'); // get start and end date 'start_end'
      startDate = new Date(start);
      endDate = new Date(end);
    }

    filteredItems = filteredItems.filter((item) => {
      if (hasOpenedDateProperty(item)) {
        return item.opened >= startDate && item.opened <= endDate;
      } else if (hasTransactionDateProperty(item)) {
        return (
          item.transactionDate >= startDate && item.transactionDate <= endDate
        );
      } else if (hasCreatedAtProperty(item)) {
        return item.createdAt >= startDate && item.createdAt <= endDate;
      } else if (hasDateProperty(item)) {
        return item.date >= startDate && item.date <= endDate;
      } else {
        return false;
      }
    });
  }

  // Apply filter if provided
  if (filters) {
    const doesItemFieldMatchSomeValues = (
      item: T,
      filter: { field: string; value: string },
      values: string[]
    ) => {
      return values.some((value) => {
        if (!isKeyOf(item, filter.field) || filter.field === 'store')
          return true;

        return (
          (item[filter.field] as string).toLowerCase() === value.toLowerCase()
        );
      });
    };
    const doesItemPassFilter = (
      item: T,
      filter: { field: string; value: string }
    ) => {
      if (!isKeyOf(item, filter.field)) return true;
      let values: string[] = [];
      if (Array.isArray(filter.value)) values = filter.value;
      else values = filter.value.split(',');
      return doesItemFieldMatchSomeValues(item, filter, values);
    };
    filteredItems = filteredItems.filter((item) =>
      filters.every((filter) =>
        doesItemPassFilter(item, {
          field: filter.field,
          value: filter.value as string,
        })
      )
    );
  }

  // Apply additional filters
  if (additionalFilter) {
    filteredItems = filteredItems.filter((item) => additionalFilter(item));
  }

  // Apply sorting if provided
  if (sort) {
    const sortFactor = sort.direction === 'asc' ? 1 : -1;

    filteredItems.sort((a, b) => {
      const aValue = a[sort.field as keyof T];
      const bValue = b[sort.field as keyof T];

      // If values are the same, return 0
      if (aValue === bValue) {
        return 0;
      }

      // If any value is undefined or null, push it to the end (or the beginning, based on sort direction)
      if (aValue == null) {
        return -sortFactor;
      }
      if (bValue == null) {
        return sortFactor;
      }

      // Handle different types: number, string, Date
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortFactor * (aValue - bValue); // Sort by numerical comparison
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortFactor * aValue.localeCompare(bValue); // Sort with locale-sensitive string comparison
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortFactor * (aValue.getTime() - bValue.getTime()); // Sort by date comparison
      }

      // If types do not match, fall back to string comparison to avoid errors
      return sortFactor * aValue.toString().localeCompare(bValue.toString());
    });
  }

  // Limit results
  const start = (page - 1) * perPage;
  // NOTE: Not recommended to use code below.
  //       If 2 or more data are loaded on the same page, it will lead to weird errors.
  //       e.g. A page loads transactions and customers data
  //            Call to getTotalTransactions may return correct value initially
  //            But when getCustomers or getTotalCustomers is called
  //            getTotalTransactions observable will trigger and return the
  //            total number of customers instead. :(
  //
  // supplierData.totalSubject.next(filteredItems.length);
  // inventoryData.totalSubject.next(filteredItems.length);
  // purchaseData.totalSubject.next(filteredItems.length);
  // transactionsData.totalSubject.next(filteredItems.length);
  // dailySummariesData.totalSubject.next(filteredItems.length);
  // ...
  //
  // Please make use of instead:
  // (May be particularly useful in pages with tables and pagination)
  data.totalAfterFilterSubject.next(filteredItems.length);
  // See 'getTransactions' for reference.

  const end = start + perPage;
  filteredItems = filteredItems.slice(start, end);

  data.subject.next(filteredItems);
}

export function hasCreatedAtProperty(item: any): item is { createdAt: Date } {
  return 'createdAt' in item;
}

export function hasDateProperty(item: any): item is { date: Date } {
  return 'date' in item;
}

export function hasTransactionDateProperty(
  item: any
): item is { transactionDate: Date } {
  return 'transactionDate' in item;
}

export function hasOpenedDateProperty(item: any): item is { opened: Date } {
  return 'opened' in item;
}

export function getStartDate(dateFilter: DateFilter) {
  const now = new Date();
  switch (dateFilter) {
    case DateFilter.TODAY:
      return new Date(now.setHours(0, 0, 0, 0)); // Reset to the start of the day

    case DateFilter.LAST_7_DAYS:
      return new Date(new Date().setDate(now.getDate() - 6)).setHours(
        0,
        0,
        0,
        0
      ); // Start from 7 days ago

    case DateFilter.LAST_4_WEEKS:
      return new Date(new Date().setDate(now.getDate() - 27)).setHours(
        0,
        0,
        0,
        0
      ); // Start from 28 days ago

    case DateFilter.LAST_12_MONTHS:
      return new Date(
        new Date().setMonth(now.getMonth() - 12, now.getDate())
      ).setHours(0, 0, 0, 0); // Start from 12 months ago

    case DateFilter.MAX:
      return new Date(1900, 0, 1);
    default:
      throw new Error('Invalid date filter');
  }
}

export function hasStringProperty<K extends string>(
  obj: any,
  prop: K
): obj is { [P in K]: string } {
  return (
    obj &&
    typeof obj === 'object' &&
    prop in obj &&
    typeof obj[prop] === 'string'
  );
}
