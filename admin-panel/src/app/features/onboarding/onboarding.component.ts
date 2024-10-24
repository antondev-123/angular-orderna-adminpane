import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StoreCreationSuccessModalComponent } from '../stores/components/store-creation-success-modal/store-creation-success-modal.component';
import { Store, StoreCreateData, WeeklyOpeningHours } from '../../model/store';
import { StoresApiService } from '../../core/stores/stores-api.service';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../shared/components/button/button.component';
import { AbstractControl, FormGroup } from '@angular/forms';
import { StoreDetailsComponent } from './components/store-details/store-details.component';
import {
  StoreAddressControl,
  StoreContactInformationControl,
  StoreDetailsControl,
} from './types/tcontrol';
import { StoreContactInformationComponent } from './components/store-contact-information/store-contact-information.component';
import { StoreAddressComponent } from './components/store-address/store-address.component';
import { StoreOpeningHoursComponent } from './components/store-opening-hours/store-opening-hours.component';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {convertOpeningHours, WEEKLY, WEEKLY_OPENING_HOURS } from './components/store-opening-hours/weekdays';

class OnboardingStep<
  TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
  } = any
> {
  public form: FormGroup<TControl> = new FormGroup({} as TControl);
  constructor(
    public readonly description: string,
    public readonly component: any
  ) { }

  get componentInputs() {
    return { form: this.form };
  }
}

export const WEEKLY_OPENING_HOURS_TOKEN = new InjectionToken('WEEKDAYS');

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    NgComponentOutlet,
    ButtonComponent,
    ButtonTextDirective,
    StoreDetailsComponent,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: WEEKLY_OPENING_HOURS_TOKEN,
      useValue: WEEKLY_OPENING_HOURS,
    }
  ]
})
export class OnboardingComponent {
  authService = inject(AuthApiService);
  weekendDays = inject(WEEKLY_OPENING_HOURS_TOKEN);

  readonly steps: OnboardingStep[] = [
    new OnboardingStep<StoreDetailsControl>(
      'Store Details',
      StoreDetailsComponent
    ),
    new OnboardingStep<StoreContactInformationControl>(
      'Store Contact Information',
      StoreContactInformationComponent
    ),
    new OnboardingStep<StoreAddressControl>(
      'Store Address',
      StoreAddressComponent
    ),
    new OnboardingStep('Store Opening Hours', StoreOpeningHoursComponent),
  ];
  readonly numberOfSteps = this.steps.length;
  readonly lastStepIndex = this.steps.length - 1;
  readonly lastStepButtonText = 'Create Store';

  currentStepIndex = signal<number>(0);
  currentStep = computed<OnboardingStep | null>(() =>
    this.isValidStepIndex(this.currentStepIndex())
      ? this.steps[this.currentStepIndex()]
      : null
  );
  nextStep = computed<OnboardingStep | null>(() => {
    const nextStepIndex = this.currentStepIndex() + 1;
    return this.isValidStepIndex(nextStepIndex)
      ? this.steps[nextStepIndex]
      : null;
  });
  previousStep = computed<OnboardingStep | null>(() => {
    const previousStepIndex = this.currentStepIndex() - 1;
    return this.isValidStepIndex(previousStepIndex)
      ? this.steps[previousStepIndex]
      : null;
  });

  loading = signal<boolean>(false);

  router = inject(Router);
  storeService = inject(StoresApiService);
  dialog = inject(MatDialog);
  scrollDispatcher = inject(ScrollDispatcher);
  elementRef = inject(ElementRef);

  isValidStepIndex(index: number) {
    return index >= 0 && index < this.steps.length;
  }

  scrollToTop() {
    if (!this.elementRef) return;
    const scrollContainers = this.scrollDispatcher.getAncestorScrollContainers(
      this.elementRef
    );
    if (scrollContainers && scrollContainers.length > 0) {
      scrollContainers[0].scrollTo({ top: 0 });
    }
  }

  goToStoresPage() {
    this.router.navigate(['stores']);
  }

  goToPreviousStep() {
    const previousStep = this.previousStep();
    if (!previousStep) {
      throw new Error('No previous step');
    }

    this.currentStepIndex.update((index) => index - 1);
    this.scrollToTop();
  }

  goToNextStep() {
    const nextStep = this.nextStep();
    const currentStep = this.currentStep();
    if (!nextStep || !currentStep) {
      throw new Error('No next step');
    }

    this.currentStepIndex.update((index) => index + 1);
    this.scrollToTop();
  }

  handleLastStepCompleted() {
    this.createStore();
  }

  createStore() {
    const details = (
      this.steps[0].form as FormGroup<StoreDetailsControl>
    ).getRawValue();
    const contactInformation = (
      this.steps[1].form as FormGroup<StoreContactInformationControl>
    ).getRawValue();

    const address = (
      this.steps[2].form as FormGroup<StoreAddressControl>
    ).getRawValue();

    const data: StoreCreateData = {
      ...details,
      ...address,
      ...contactInformation,
      isOpen: true,
      telephone: contactInformation.telephone?.number ? contactInformation.telephone : undefined,
    };
 
    this.storeService
      .createStore(data)
      .subscribe((store:any) => {
        const AddStoreData = store.data;
        localStorage.setItem('currentUser', JSON.stringify(AddStoreData));
        this.router.navigate(['/onboarding']);
        this.loading.set(false);
        this.openStoreCreationSuccessModal(store.name);
        const openingHours = convertOpeningHours(this.weekendDays)
        this.storeService.createStoreOpeningHours(store.data.id, openingHours as any).subscribe(res => {});
      });
  }

  openStoreCreationSuccessModal(storeName: Store['name']) {
    this.dialog.open(StoreCreationSuccessModalComponent, {
      id: 'store-creation-success-modal',
      data: {
        storeName,
      },
      disableClose: true,
    });
  }
}
