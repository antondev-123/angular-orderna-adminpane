import { Params } from '@angular/router';
import { isPaymentType } from '../app/model/enum/payment-type';
import { isRole } from '../app/model/enum/role';
import { isStatus } from '../app/model/enum/status';
import { isTransactionStatus } from '../app/model/enum/transaction-status';
import { DateFilter, isDateFilter } from './date-filter';
import { Maybe } from './maybe';
import { isTransactionType } from '../app/model/enum/transaction-type';
import { isDiscountStatus } from '../app/model/enum/discount-status';

type SortDirection = 'asc' | 'desc';

export interface QueryOptions<T> {
  page: number;
  perPage: number;
  searchQuery?: string;
  dateFilter?: DateFilter | string;
  filters?: Array<{ field: string; value: string | string[] }>;
  sort?: { field: keyof T; direction: SortDirection };
  searchFilters?: Array<{ field: string; value: string }>;
}

export const DEFAULT_QUERY_OPTIONS = {
  page: 1,
  perPage: 10,
};

const DEFAULT_PARAM_KEYS = ['page', 'dateFilter', 'search', 'sort'];

type ValidatorFn = (value: string) => true | string;
const validators: { [key: string]: ValidatorFn | undefined } = {
  page: (value: string) =>
    (!!value && !isNaN(Number(value)) && Number(value) >= 0) || 'Invalid page',
  perPage: (value: string) =>
    (!!value && !isNaN(Number(value)) && Number(value) >= 0) ||
    'Invalid per page',
  dateFilter: (value: string) => {
    if (isDateFilter(value)) return true;

    const [start, end] = value.split('_');
    const startDate = new Date(start);
    const endDate = new Date(end);

    return (
      !isNaN(startDate.getTime()) ||
      !isNaN(endDate.getTime()) ||
      'Invalid date filter'
    );
  },
  search: (value: string) => !!value || 'Invalid search query',
  sort: (value: string) => {
    const [field, direction] = value.split('_');
    return (
      (!!field && direction === 'asc') ||
      direction === 'desc' ||
      'Invalid sort direction'
    );
  },
  role: (value: string) =>
    value.split(',').every((v) => isRole(v)) || 'Invalid role',
  status: (value: string) =>
    value
      .split(',')
      .every(
        (v) =>
          isStatus(v) ||
          isTransactionStatus(v) ||
          isDiscountStatus(v) ||
          isTransactionType(v) ||
          v === 'all'
      ) || 'Invalid status',
  store: (value: string | string[]) =>
    (!!value && !isNaN(Number(value)) && Number(value) >= 0) ||
    (Array.isArray(value) &&
      value.every((v) => !isNaN(Number(v)) && Number(v) >= 0)) ||
    'Invalid store ID',
  paymentType: (value: string) =>
    value.split(',').every((v) => isPaymentType(v)) || 'Invalid payment type',
};

function validate(key: string, value: any): Error | null {
  const validator = validators[key];
  if (!validator) {
    return new Error(`Invalid param key: ${key}`);
  }
  const validationResult = validator(value);
  return typeof validationResult == 'string'
    ? new Error(validationResult)
    : null;
}

export function toQueryOptions<T>(
  params: Params,
  fallbackOptions: QueryOptions<T> = DEFAULT_QUERY_OPTIONS,
  optionalParamKeys: string[] = [],
  mandatoryParamKeys: string[] = []
): { queryOptions: Maybe<QueryOptions<T>>; error: Maybe<Error> } {
  const queryOptions: QueryOptions<T> = { ...fallbackOptions };

  // Validate param keys
  for (const paramKey of Object.keys(params)) {
    if (
      ![
        ...DEFAULT_PARAM_KEYS,
        ...mandatoryParamKeys,
        ...optionalParamKeys,
      ].includes(paramKey)
    ) {
      return {
        queryOptions: null,
        error: new Error(`Invalid param key: ${paramKey}`),
      };
    }
  }

  // Check if mandatory params exists
  for (const mandatoryParam of mandatoryParamKeys) {
    if (!Object.keys(params).includes(mandatoryParam)) {
      return {
        queryOptions: null,
        error: new Error(`Missing mandatory param: ${mandatoryParam}`),
      };
    }
  }

  // Validate param values
  for (const [key, value] of Object.entries(params)) {
    const error = validate(key, value);
    if (error) {
      return { queryOptions: null, error };
    }

    switch (key) {
      case 'page': {
        queryOptions.page = +value;
        break;
      }
      case 'dateFilter': {
        if (isDateFilter(value)) queryOptions.dateFilter = value as DateFilter;
        else queryOptions.dateFilter = value as string;
        break;
      }
      case 'search': {
        queryOptions.searchQuery = value;
        break;
      }
      case 'sort': {
        const [field, direction] = value.split('_');
        queryOptions.sort = { field, direction };
        break;
      }
      default: {
        const filter = { field: key, value };
        if (queryOptions.filters) {
          const existedFilter = queryOptions.filters.find(
            (_filter) => _filter.field === key
          );

          if (existedFilter) {
            existedFilter.value = value;
          } else {
            queryOptions.filters.push(filter);
          }
        } else {
          queryOptions.filters = [filter];
        }
      }
    }
  }
  return { queryOptions, error: null };
}
