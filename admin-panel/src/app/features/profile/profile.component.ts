import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, User } from '../../model/user';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from '../../shared/components/input/text/text.component';
import { InputEmailComponent } from '../../shared/components/input/email/email.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  SlideToggleComponent,
  SlideToggleDirective,
} from '../../shared/components/slide-toggle/slide-toggle.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableSkeletonComponent } from '../../shared/components/table/table-skeleton.component';
import { RowControlComponent } from '../../shared/components/row-controls/row-controls.component';
import { TableColumn } from '@orderna/admin-panel/src/types/table';
import { IInvoice, Invoice } from '../../model/invoice';
import {
  Observable,
  combineLatest,
  forkJoin,
  map,
  of,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  BillingIntervalUpdateData,
  BillingInvoice,
} from '../../model/billing-invoice';
import {
  PrinterSetting,
  PrinterSettingUpdateData,
} from '../../model/printer-settings';
import {
  SubscriptionPlan,
  SubscriptionPlanUpdateData,
} from '../../model/subscription-plan';
import { UserProfile, UserProfileUpdateData } from '../../model/user-profile';
import { BillingInterval } from '../../model/enum/billing-interval';
import { SubscriptionPlanType } from '../../model/enum/subscription-plan-type';
import { LoaderService } from '../../services/shared/loader/loader.service';
import { Feedback, FeedbackUpdateData } from '../../model/feedback';
import { InputTextAreaComponent } from '../../shared/components/input/textarea/textarea.component';
import { UsersApiService } from '../../services/users/users-api.service';
import { UserProfilesApiService } from '../../services/user-profiles/user-profiles-api.service';
import { PrinterSettingsApiService } from '../../services/printer-settings/printer-settings-api.service';
import { SubscriptionPlansApiService } from '../../services/subscription-plans/subscription-plans-api.service';
import { BillingInvoicesApiService } from '../../services/billing-invoices/billing-invoices-api.service';
import { InvoicesApiService } from '../../services/invoices/invoices-api.service';
import { FeedbacksApiService } from '../../services/feedbacks/feedbacks-api.service';
import { ProfileSkeletonComponent } from './components/profile-skeleton/profile-skeleton.component';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentOverdueModalComponent } from './components/payment-overdue-modal/payment-overdue-modal.component';

type TabSelector = 'account' | 'printer' | 'plans' | 'billing' | 'feedback';

interface PageData {
  profile: Maybe<UserProfile>;
  printerSetting: Maybe<PrinterSetting>;
  subscriptionPlan: Maybe<SubscriptionPlan>;
  billingInvoice: Maybe<BillingInvoice>;
  invoices: Maybe<Invoice[]>;
  feedback: Maybe<Feedback>;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ButtonComponent,
    ButtonTextDirective,

    InputTextComponent,
    InputEmailComponent,
    InputTextAreaComponent,

    SlideToggleComponent,
    SlideToggleDirective,

    TableComponent,
    TableSkeletonComponent,
    RowControlComponent,
    ProfileSkeletonComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  Validators = Validators;
  currentUser: User;
  loading: boolean = false;

  readonly columns: TableColumn<IInvoice>[] = [
    {
      key: 'year',
      type: 'string',
      label: 'Year',
    },
    {
      key: 'plan',
      type: 'string',
      label: 'Plan',
    },
    {
      key: 'amount',
      type: 'currency',
      label: 'Amount',
    },
  ];

  @ViewChild(TableComponent) table!: TableComponent<Invoice>;

  formGroup!: FormGroup;
  printerSettingsFormGroup!: FormGroup;

  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthApiService);
  dialog = inject(MatDialog);

  currentTab: TabSelector = 'account';
  currentPlan: SubscriptionPlanType = SubscriptionPlanType.BASIC;

  isPlanAnnually: boolean = true;
  feedbackRate: number = 3;
  initialFeedbackRate: number = 1;

  printerToggles = new Map<string, boolean>();
  initialPrinterToggles = new Map<string, boolean>();

  showPhoneNumber: boolean = false;
  showCustomerName: boolean = false;
  showNoteToCustomer: boolean = false;
  showCustomerAddress: boolean = false;
  showStore: boolean = false;
  printInvoiceAutomatically: boolean = false;
  showEmailAddress: boolean = false;
  showTaxDiscountShipping: boolean = false;

  initialShowPhoneNumber: boolean = false;
  initialShowCustomerName: boolean = false;
  initialShowNoteToCustomer: boolean = false;
  initialShowCustomerAddress: boolean = false;
  initialShowStore: boolean = false;
  initialPrintInvoiceAutomatically: boolean = false;
  initialShowEmailAddress: boolean = false;
  initialShowTaxDiscountShipping: boolean = false;
  initialPrinterNote: string = '';

  billingInterval?: string = '';
  userProfileId?: number = 0;
  printerSettingId?: number = 0;
  subscriptionPlanId?: number = 0;
  billingInvoiceId?: number = 0;
  feedbackId?: number = 0;

  data$!: Observable<PageData>;

  initialValues!: any;

  get userFilterValue() {
    return this.currentUser.id;
  }

  constructor(
    private feedbacksService: FeedbacksApiService,
    private invoicesService: InvoicesApiService,
    private subscriptionPlansService: SubscriptionPlansApiService,
    private billingInvoicesService: BillingInvoicesApiService,
    private usersService: UsersApiService,
    private printerSettingsService: PrinterSettingsApiService,
    private userProfilesService: UserProfilesApiService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.data$ = this.userProfilesService
      .getUserProfile(this.currentUser.id)
      .pipe(
        switchMap((profile) => {
          return this.billingInvoicesService
            .getBillingInvoice(profile?.id!)
            .pipe(
              switchMap((billingInvoice) => {
                const printerSetting$ = this.printerSettingsService
                  .getPrinterSetting(profile?.id!)
                  .pipe(startWith(null));

                const subscriptionPlan$ = this.subscriptionPlansService
                  .getSubscriptionPlan(profile?.id!)
                  .pipe(startWith(null));

                const feedback$ = this.feedbacksService
                  .getFeedback(profile?.id!)
                  .pipe(startWith(null));

                const invoices$ = this.invoicesService
                  .getInvoices(billingInvoice?.id!)
                  .pipe(startWith(null));

                return combineLatest([
                  of(profile),
                  printerSetting$,
                  subscriptionPlan$,
                  of(billingInvoice),
                  invoices$,
                  feedback$,
                ]).pipe(
                  map(
                    ([
                      profile,
                      printerSetting,
                      subscriptionPlan,
                      billingInvoice,
                      invoices,
                      feedback,
                    ]) => {
                      return {
                        profile,
                        printerSetting,
                        subscriptionPlan,
                        billingInvoice,
                        invoices,
                        feedback,
                      };
                    }
                  )
                );
              })
            );
        })
      );

    this.data$.subscribe((data) => {
      this.formGroup = this.formBuilder.group({
        accountName: [
          { value: data.profile?.accountName, disabled: false },
          [Validators.required],
        ],
        affiliatedStores: [
          { value: data.profile?.affiliatedStores, disabled: false },
          [Validators.required],
        ],
        userAddress: [
          { value: data.billingInvoice?.userAddress, disabled: false },
        ],
        printerNote: [
          { value: data.printerSetting?.printerNote, disabled: false },
        ],
        email: [
          { value: this.currentUser.email, disabled: false },
          [Validators.required, Validators.email],
        ],
        feedbackComment: [
          { value: data.feedback?.feedbackComment ?? '', disabled: false },
        ],
        showPhoneNumber: [
          {
            value: '',
            disabled: !(data.printerSetting?.showPhoneNumber ?? false),
          },
        ],
        showCustomerName: [
          {
            value: '',
            disabled: !(data.printerSetting?.showCustomerName ?? false),
          },
        ],
        showNoteToCustomer: [
          {
            value: '',
            disabled: !(data.printerSetting?.showNoteToCustomer ?? false),
          },
        ],
        showCustomerAddress: [
          {
            value: '',
            disabled: !(data.printerSetting?.showCustomerAddress ?? false),
          },
        ],
        showStore: [
          { value: '', disabled: !(data.printerSetting?.showStore ?? false) },
        ],
        printInvoiceAutomatically: [
          {
            value: '',
            disabled: !(
              data.printerSetting?.printInvoiceAutomatically ?? false
            ),
          },
        ],
        showEmailAddress: [
          {
            value: '',
            disabled: !(data.printerSetting?.showEmailAddress ?? false),
          },
        ],
        showTaxDiscountShipping: [
          {
            value: '',
            disabled: !(data.printerSetting?.showTaxDiscountShipping ?? false),
          },
        ],
      });

      // Set printer settings toggles
      this.showPhoneNumber = data.printerSetting?.showPhoneNumber ?? false;
      this.showCustomerName = data.printerSetting?.showCustomerName ?? false;
      this.showNoteToCustomer =
        data.printerSetting?.showNoteToCustomer ?? false;
      this.showCustomerAddress =
        data.printerSetting?.showCustomerAddress ?? false;
      this.showStore = data.printerSetting?.showStore ?? false;
      this.printInvoiceAutomatically =
        data.printerSetting?.printInvoiceAutomatically ?? false;
      this.showEmailAddress = data.printerSetting?.showEmailAddress ?? false;
      this.showTaxDiscountShipping =
        data.printerSetting?.showTaxDiscountShipping ?? false;

      // Subscription Plan
      this.currentPlan =
        data.subscriptionPlan?.subscriptionPlan ?? SubscriptionPlanType.BASIC;
      this.isPlanAnnually =
        data.billingInvoice?.billingInterval === BillingInterval.ANNUALLY;
      this.billingInterval =
        data.billingInvoice?.billingInterval === BillingInterval.ANNUALLY
          ? 'Annually'
          : 'Monthly';

      // Ids
      this.userProfileId = data.profile?.id;
      this.printerSettingId = data.printerSetting?.id;
      this.subscriptionPlanId = data.subscriptionPlan?.id;
      this.billingInvoiceId = data.billingInvoice?.id;
      this.feedbackId = data.feedback?.id;

      this.feedbackRate = data.feedback?.rating ?? 3;
      this.saveInitialValues();
    });
  }

  changeProfileImage() { }

  saveInitialValues() {
    this.initialValues = this.formGroup.value;
    this.initialShowPhoneNumber = this.showPhoneNumber;
    this.initialShowCustomerName = this.showCustomerName;
    this.initialShowNoteToCustomer = this.showNoteToCustomer;
    this.initialShowCustomerAddress = this.showCustomerAddress;
    this.initialShowStore = this.showStore;
    this.initialPrintInvoiceAutomatically = this.printInvoiceAutomatically;
    this.initialShowEmailAddress = this.showEmailAddress;
    this.initialShowTaxDiscountShipping = this.showTaxDiscountShipping;
    this.initialFeedbackRate = this.feedbackRate;
  }

  changeTab(tab: TabSelector) {
    this.currentTab = tab;
  }

  changePlan(plan: string) {
    this.currentPlan = plan as SubscriptionPlanType;
  }

  toggleShow(event: MatSlideToggleChange) {
    if (event.checked) this.formGroup.controls[event.source.id].enable();
    else this.formGroup.controls[event.source.id].disable();

    switch (event.source.id) {
      case 'showCustomerAddress':
        this.showCustomerAddress = event.checked;
        break;
      case 'showCustomerName':
        this.showCustomerName = event.checked;
        break;
      case 'showEmailAddress':
        this.showEmailAddress = event.checked;
        break;
      case 'showNoteToCustomer':
        this.showNoteToCustomer = event.checked;
        break;
      case 'showPhoneNumber':
        this.showPhoneNumber = event.checked;
        break;
      case 'showStore':
        this.showStore = event.checked;
        break;
      case 'showTaxDiscountShipping':
        this.showTaxDiscountShipping = event.checked;
        break;
      default:
        this.printInvoiceAutomatically = event.checked;
        break;
    }
  }

  cancel() {
    this.formGroup.reset(this.initialValues);

    // reset printer settings slide toggle value
    this.showCustomerAddress = this.initialShowCustomerAddress;
    this.showCustomerName = this.initialShowCustomerName;
    this.showEmailAddress = this.initialShowEmailAddress;
    this.showNoteToCustomer = this.initialShowNoteToCustomer;
    this.showPhoneNumber = this.initialShowPhoneNumber;
    this.showStore = this.initialShowStore;
    this.showTaxDiscountShipping = this.initialShowTaxDiscountShipping;
    this.printInvoiceAutomatically = this.initialPrintInvoiceAutomatically;

    // Disable input text for printer settings
    if (this.showPhoneNumber)
      this.formGroup.controls['showPhoneNumber'].enable();
    else this.formGroup.controls['showPhoneNumber'].disable();

    if (this.showStore) this.formGroup.controls['showStore'].enable();
    else this.formGroup.controls['showStore'].disable();

    if (this.showTaxDiscountShipping)
      this.formGroup.controls['showTaxDiscountShipping'].enable();
    else this.formGroup.controls['showTaxDiscountShipping'].disable();

    if (this.printInvoiceAutomatically)
      this.formGroup.controls['printInvoiceAutomatically'].enable();
    else this.formGroup.controls['printInvoiceAutomatically'].disable();

    if (this.showCustomerAddress)
      this.formGroup.controls['showCustomerAddress'].enable();
    else this.formGroup.controls['showCustomerAddress'].disable();

    if (this.showCustomerName)
      this.formGroup.controls['showCustomerName'].enable();
    else this.formGroup.controls['showCustomerName'].disable();

    if (this.showEmailAddress)
      this.formGroup.controls['showEmailAddress'].enable();
    else this.formGroup.controls['showEmailAddress'].disable();

    if (this.showNoteToCustomer)
      this.formGroup.controls['showNoteToCustomer'].enable();
    else this.formGroup.controls['showNoteToCustomer'].disable();

    if (this.showPhoneNumber)
      this.formGroup.controls['showPhoneNumber'].enable();
    else this.formGroup.controls['showPhoneNumber'].disable();
  }

  changeEmail() {
    this.loaderService.setLoading(true);
    if (this.formGroup.controls['email'].invalid) {
      this.loaderService.setLoading(false);
      this.loading = false;
      return;
    }

    const { email } = this.formGroup.value;
    const updateUser: IUser = {
      ...this.currentUser,
      email,
    };

    this.usersService
      .updateUser(updateUser)
      .pipe(take(1))
      .subscribe({
        next: () => {
          localStorage.setItem('currentUser', JSON.stringify(updateUser));
          this.currentUser = JSON.parse(
            localStorage.getItem('currentUser') || '{}'
          );
          this.formGroup.patchValue({ email: email });
          this.loaderService.setLoading(false);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }

  save() {
    this.loading = true;
    this.loaderService.setLoading(true);

    switch (this.currentTab) {
      // My Account
      case 'account':
        if (
          this.formGroup.controls['accountName'].invalid ||
          this.formGroup.controls['affiliatedStores'].invalid ||
          this.formGroup.controls['userAddress'].invalid
        ) {
          this.loaderService.setLoading(false);
          this.loading = false;
          return;
        }

        const { accountName, affiliatedStores, userAddress } =
          this.formGroup.value;

        const updateUserProfile: UserProfileUpdateData = {
          id: this.userProfileId!,
          accountName,
          affiliatedStores,
        };

        this.userProfilesService
          .updateUserProfile(updateUserProfile)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.loaderService.setLoading(false);
              this.loading = false;
            },
            error: (err) => {
              this.loaderService.setLoading(false);
              this.loading = false;
            },
          });
        break;
      // Printer Settings
      case 'printer':
        const { printerNote } = this.formGroup.value;

        const updatePrinterSetting: PrinterSettingUpdateData = {
          id: this.printerSettingId!,
          printerNote,
          showPhoneNumber: this.showPhoneNumber,
          showCustomerName: this.showCustomerName,
          showNoteToCustomer: this.showNoteToCustomer,
          showCustomerAddress: this.showCustomerAddress,
          showStore: this.showPhoneNumber,
          printInvoiceAutomatically: this.printInvoiceAutomatically,
          showEmailAddress: this.showEmailAddress,
          showTaxDiscountShipping: this.showTaxDiscountShipping,
        };

        this.printerSettingsService
          .updatePrinterSetting(updatePrinterSetting)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.loaderService.setLoading(false);
              this.loading = false;
            },
            error: (err) => {
              console.log(err);
              this.loaderService.setLoading(false);
              this.loading = false;
            },
          });
        break;
      // Subscription Plan
      case 'plans':
        const updateSubscriptionPlan: SubscriptionPlanUpdateData = {
          id: this.subscriptionPlanId!,
          subscriptionPlan: this.currentPlan!,
        };
        const updateBillingInterval: BillingIntervalUpdateData = {
          id: this.billingInvoiceId!,
          billingInterval: this.isPlanAnnually
            ? BillingInterval.ANNUALLY
            : BillingInterval.MONTHLY,
        };

        const subscriptionPlan =
          this.subscriptionPlansService.updateSubscriptionPlan(
            updateSubscriptionPlan
          );

        const billingInvoice =
          this.billingInvoicesService.updateBillingInterval(
            updateBillingInterval
          );

        forkJoin([subscriptionPlan, billingInvoice]).subscribe((results) => {
          const [plan, billing] = results;
          console.log('Subscription plan:', plan);
          console.log('Billing Invoice:', billing);

          this.loaderService.setLoading(false);
          this.loading = false;
        });

        break;
      // Billing Invoice
      case 'billing':
        break;
      // Feedback
      default:
        if (this.formGroup.controls['feedbackComment'].invalid) {
          this.loaderService.setLoading(false);
          this.loading = false;
          return;
        }

        const { feedbackComment } = this.formGroup.value;

        const updateFeedback: FeedbackUpdateData = {
          id: this.feedbackId!,
          rating: this.feedbackRate,
          feedbackComment,
        };

        this.feedbacksService
          .updateFeedback(updateFeedback)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.loaderService.setLoading(false);
              this.loading = false;
            },
            error: (err) => {
              console.log(err);
              this.loaderService.setLoading(false);
              this.loading = false;
            },
          });
        break;
    }

    // Update initial values
    this.saveInitialValues();
  }

  openPaymentOverdueModal(): void {
    this.dialog
      .open(PaymentOverdueModalComponent, {
        id: 'payment-overdue-modal',
        disableClose: true,
        data: {
          email: this.authService.currentUserValue?.email ?? 'Unknown email',

          // Dummy data
          daysOverdue: 200,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        console.log(result);
      });
  }
}
