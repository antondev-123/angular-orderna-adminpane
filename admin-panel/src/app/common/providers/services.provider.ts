import { Provider } from '@angular/core';
import { environment } from '@orderna/admin-panel/src/environments/environment';
import { AllTransactionsApiService } from '../../services/accounting-analytics/all-transactions/all-transactions-api.service';
import { AllTransactionsMockApiService } from '../../services/accounting-analytics/all-transactions/all-transactions-mock-api.service';
import { DailySummariesApiService } from '../../services/accounting-analytics/daily-summaries/daily-summaries-api.service';
import { DailySummariesMockApiService } from '../../services/accounting-analytics/daily-summaries/daily-summaries-mock-api.service';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { BillingInvoicesApiService } from '../../services/billing-invoices/billing-invoices-api.service';
import { BillingInvoicesMockApiService } from '../../services/billing-invoices/billing-invoices-mock-api.service';
import { CashDrawersApiService } from '../../services/cash-drawers/cash-drawers-api.service';
import { CashDrawersMockApiService } from '../../services/cash-drawers/cash-drawers-mock-api.service';
import { CashRegistersApiService } from '../../services/cash-registers-analytics/cash-registers/cash-registers-api.service';
import { CashRegistersMockApiService } from '../../services/cash-registers-analytics/cash-registers/cash-registers-mock-api.service';
import { CategoriesApiService } from '../../services/categories/categories-api.service';
import { CategoriesMockApiService } from '../../services/categories/categories-mock-api.service';
import { CustomersApiService } from '../../services/customers/customers-api.service';
import { CustomersMockApiService } from '../../services/customers/customers-mock-api.service';
import { DiscountsApiService } from '../../services/discounts/discounts-api.service';
import { DiscountsMockApiService } from '../../services/discounts/discounts-mock-api.service';
import { FeedbacksApiService } from '../../services/feedbacks/feedbacks-api.service';
import { FeedbacksMockApiService } from '../../services/feedbacks/feedbacks-mock-api.service';
import { InventoryApiService } from '../../services/inventory/inventory-api.service';
import { InventoryMockApiService } from '../../services/inventory/inventory-mock-api.service';
import { InvoicesApiService } from '../../services/invoices/invoices-api.service';
import { InvoicesMockApiService } from '../../services/invoices/invoices-mock-api.service';
import { PrinterSettingsApiService } from '../../services/printer-settings/printer-settings-api.service';
import { PrinterSettingsMockApiService } from '../../services/printer-settings/printer-settings-mock-api.service';
import { ProductsApiService } from '../../services/products/products-api.service';
import { ProductsMockApiService } from '../../services/products/products-mock-api.service';
import { PurchasesApiService } from '../../services/purchases/purchases-api.service';
import { PurchasesMockApiService } from '../../services/purchases/purchases-mock-api.service';
import { AverageOrderValuesApiService } from '../../services/sales-analytics/average-order-values/average-order-values-api.service';
import { AverageOrderValuesMockApiService } from '../../services/sales-analytics/average-order-values/average-order-values-mock-api.service';
import { CategorySalesApiService } from '../../services/sales-analytics/category-sales/category-sales-api.service';
import { CategorySalesMockApiService } from '../../services/sales-analytics/category-sales/category-sales-mock-api.service';
import { DayOfWeekSalesApiService } from '../../services/sales-analytics/day-of-week-sales/day-of-week-sales-api.service';
import { DayOfWeekSalesMockApiService } from '../../services/sales-analytics/day-of-week-sales/day-of-week-sales-mock-api.service';
import { DiscountSummariesApiService } from '../../services/sales-analytics/discount-summaries/discount-summaries-api.service';
import { DiscountSummariesMockApiService } from '../../services/sales-analytics/discount-summaries/discount-summaries-mock-api.service';
import { DiscountedTransactionsApiService } from '../../services/sales-analytics/discounted-transactions/discounted-transactions-api.service';
import { DiscountedTransactionsMockApiService } from '../../services/sales-analytics/discounted-transactions/discounted-transactions-mock-api.service';
import { FailedTransactionsApiService } from '../../services/sales-analytics/failed-transactions/failed-transactions-api.service';
import { FailedTransactionsMockApiService } from '../../services/sales-analytics/failed-transactions/failed-transactions-mock-api.service';
import { ProductSalesApiService } from '../../services/sales-analytics/product-sales/product-sales-api.service';
import { ProductSalesMockApiService } from '../../services/sales-analytics/product-sales/product-sales-mock-api.service';
import { RefundedTransactionsApiService } from '../../services/sales-analytics/refunded-transactions/refunded-transactions-api.service';
import { RefundedTransactionsMockApiService } from '../../services/sales-analytics/refunded-transactions/refunded-transactions-mock-api.service';
import { RevenuesApiService } from '../../services/sales-analytics/revenues/revenues-api.service';
import { RevenuesMockApiService } from '../../services/sales-analytics/revenues/revenues-mock-api.service';
import { TimeOfDaySalesApiService } from '../../services/sales-analytics/time-of-day-sales/time-of-day-sales-api.service';
import { TimeOfDaySalesMockApiService } from '../../services/sales-analytics/time-of-day-sales/time-of-day-sales-mock-api.service';
import { TipsByDaysApiService } from '../../services/sales-analytics/tips-by-days/tips-by-days-api.service';
import { TipsByDaysMockApiService } from '../../services/sales-analytics/tips-by-days/tips-by-days-mock-api.service';
import { ZReportsApiService } from '../../services/sales-analytics/z-reports/z-reports-api.service';
import { ZReportsMockApiService } from '../../services/sales-analytics/z-reports/z-reports-mock-api.service';
import { SalesApiService } from '../../services/sales/sales-api.service';
import { SalesMockApiService } from '../../services/sales/sales-mock-api.service';
import { SubscriptionPlansApiService } from '../../services/subscription-plans/subscription-plans-api.service';
import { SubscriptionPlansMockApiService } from '../../services/subscription-plans/subscription-plans-mock-api.service';
import { SuppliersApiService } from '../../services/suppliers/suppliers-api.service';
import { SuppliersMockApiService } from '../../services/suppliers/suppliers-mock-api.service';
import { TransactionsApiService } from '../../services/transactions/transactions-api.service';
import { TransactionsMockApiService } from '../../services/transactions/transactions-mock-api.service';
import { UserProfilesApiService } from '../../services/user-profiles/user-profiles-api.service';
import { UserProfilesMockApiService } from '../../services/user-profiles/user-profiles-mock-api.service';
import { UsersApiService } from '../../services/users/users-api.service';
import { UsersMockApiService } from '../../services/users/users-mock-api.service';

export const serviceProviders: Provider[] = [
  {
    provide: UsersApiService,
    useClass:
      environment.mode == 'prod' && environment.service.users == true ? UsersApiService : UsersMockApiService,
  },
  {
    provide: CustomersApiService,
    useClass:
      environment.mode == 'prod' && environment.service.customer == true 
        ? CustomersApiService
        : CustomersMockApiService,
  },
  {
    provide: TransactionsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.transactions == true 
        ? TransactionsApiService
        : TransactionsMockApiService,
  },
  {
    provide: SuppliersApiService,
    useClass:
      environment.mode == 'prod' && environment.service.suppliers == true 
        ? SuppliersApiService
        : SuppliersMockApiService,
  },
  {
    provide: ProductsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.products == true ? ProductsApiService : ProductsMockApiService,
  },
  {
    provide: DiscountsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.discounts == true 
        ? DiscountsApiService
        : DiscountsMockApiService,
  },
  {
    provide: UserProfilesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.userProfiles == true
        ? UserProfilesApiService
        : UserProfilesMockApiService,
  },
  {
    provide: PrinterSettingsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.printerSettings == true
        ? PrinterSettingsApiService
        : PrinterSettingsMockApiService,
  },
  {
    provide: SubscriptionPlansApiService,
    useClass:
      environment.mode == 'prod' && environment.service.subscriptionPlans == true
        ? SubscriptionPlansApiService
        : SubscriptionPlansMockApiService,
  },
  {
    provide: BillingInvoicesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.billingInvoices == true
        ? BillingInvoicesApiService
        : BillingInvoicesMockApiService,
  },
  {
    provide: InvoicesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.invoices == true ? InvoicesApiService : InvoicesMockApiService,
  },
  {
    provide: FeedbacksApiService,
    useClass:
      environment.mode == 'prod' && environment.service.feedbacks == true
        ? FeedbacksApiService
        : FeedbacksMockApiService,
  },
  {
    provide: InventoryApiService,
    useClass:
      environment.mode == 'prod' && environment.service.inventory == true
        ? InventoryApiService
        : InventoryMockApiService,
  },
  {
    provide: PurchasesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.purchases == true
        ? PurchasesApiService
        : PurchasesMockApiService,
  },
  {
    provide: RevenuesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.revenues == true ? RevenuesApiService : RevenuesMockApiService,
  },
  {
    provide: ZReportsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.zReports == true ? ZReportsApiService : ZReportsMockApiService,
  },
  {
    provide: AverageOrderValuesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.averageOrderValues == true
        ? AverageOrderValuesApiService
        : AverageOrderValuesMockApiService,
  },
  {
    provide: DayOfWeekSalesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.dayOfWeekSales == true
        ? DayOfWeekSalesApiService
        : DayOfWeekSalesMockApiService,
  },
  {
    provide: TimeOfDaySalesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.timeOfDaySales == true
        ? TimeOfDaySalesApiService
        : TimeOfDaySalesMockApiService,
  },
  {
    provide: ProductSalesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.productSales == true
        ? ProductSalesApiService
        : ProductSalesMockApiService,
  },
  {
    provide: CategorySalesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.categorySales == true
        ? CategorySalesApiService
        : CategorySalesMockApiService,
  },
  {
    provide: TipsByDaysApiService,
    useClass:
      environment.mode == 'prod' && environment.service.tipsByDays == true
        ? TipsByDaysApiService
        : TipsByDaysMockApiService,
  },
  {
    provide: DiscountSummariesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.discountSummaries == true
        ? DiscountSummariesApiService
        : DiscountSummariesMockApiService,
  },
  {
    provide: DiscountedTransactionsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.discountedTransactions == true
        ? DiscountedTransactionsApiService
        : DiscountedTransactionsMockApiService,
  },
  {
    provide: RefundedTransactionsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.refundedTransactions == true
        ? RefundedTransactionsApiService
        : RefundedTransactionsMockApiService,
  },
  {
    provide: FailedTransactionsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.failedTransactions == true
        ? FailedTransactionsApiService
        : FailedTransactionsMockApiService,
  },
  {
    provide: DailySummariesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.dailySummaries == true
        ? DailySummariesApiService
        : DailySummariesMockApiService,
  },
  {
    provide: AllTransactionsApiService,
    useClass:
      environment.mode == 'prod' && environment.service.allTransactions == true
        ? AllTransactionsApiService
        : AllTransactionsMockApiService,
  },
  {
    provide: CashRegistersApiService,
    useClass:
      environment.mode == 'prod' && environment.service.cashRegisters == true
        ? CashRegistersApiService
        : CashRegistersMockApiService,
  },
  {
    provide: CashDrawersApiService,
    useClass:
      environment.mode == 'prod' && environment.service.cashDrawers == true
        ? CashDrawersApiService
        : CashDrawersMockApiService,
  },
  {
    provide: SalesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.sales == true ? SalesApiService : SalesMockApiService,
  },
  {
    provide: CategoriesApiService,
    useClass:
      environment.mode == 'prod' && environment.service.categories == true
        ? CategoriesApiService
        : CategoriesMockApiService,
  },
];
