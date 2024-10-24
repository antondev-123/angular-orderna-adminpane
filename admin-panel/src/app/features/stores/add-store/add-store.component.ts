import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, signal, computed, inject, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Store, WeeklyOpeningHours } from '../../../model/store';
import { StoresApiService } from '../../../core/stores/stores-api.service';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../shared/components/button/button.component';
import { StoreCreationSuccessModalComponent } from '../components/store-creation-success-modal/store-creation-success-modal.component';
import { GeneralComponent } from '../store-settings/general/general.component';
import { OpeningHoursComponent } from '../store-settings/opening-hours/opening-hours.component';

interface Step {
  order: number;
  description: string;
}
@Component({
  selector: 'app-add-store',
  standalone: true,
  imports: [
    GeneralComponent,
    OpeningHoursComponent,
    BackButtonComponent,
    ButtonComponent,
    ButtonTextDirective,
    StoreCreationSuccessModalComponent,
  ],
  templateUrl: './add-store.component.html',
  styleUrl: './add-store.component.scss',
})
export class AddStoreComponent {
  readonly STEPS: Step[] = [
    {
      order: 1,
      description: 'Set General Store Details',
    },
    {
      order: 2,
      description: 'Set Store Opening Hours',
    },
  ];

  currentStep = signal<Step>(this.STEPS[0]);
  nextStep = computed<Step | null>(
    () =>
      this.STEPS.find((step) => step.order === this.currentStep().order + 1) ??
      null
  );
  previousStep = computed<Step | null>(
    () =>
      this.STEPS.find((step) => step.order === this.currentStep().order - 1) ??
      null
  );

  loading = signal<boolean>(false);

  // TODO: Use proper type
  // Data of new store will be stored here
  data: any;
  addOpeningHour:any;
  router = inject(Router);
  storeService = inject(StoresApiService);
  dialog = inject(MatDialog);
  scrollDispatcher = inject(ScrollDispatcher);
  elementRef = inject(ElementRef);

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

    this.currentStep.set(previousStep);
    this.scrollToTop();
  }

  goToNextStep(data: any) {
    if(data.telephone.number == '')
    {
       delete data.telephone;
    }
    const nextStep = this.nextStep();
    if (!nextStep) {
      throw new Error('No next step');
    }

    this.data = data;

    this.currentStep.set(nextStep);
    this.scrollToTop();
  }

  handleLastStepCompleted(data: any) {
    console.log('handleLastStepCompleted', data);

    this.loading.set(true);
    this.storeService
      .createStore(this.data)
      .pipe(take(1))
      .subscribe((store:any) => {
        this.loading.set(false);
        this.openStoreCreationSuccessModal(store.name);
        this.onAddOpeningHour(store.data.id);
      });
  }

  getOpeningHour(dataHour:WeeklyOpeningHours)  {
    const modifiedObj = Object.entries(dataHour).reduce<Record<string, any>>((acc, [dayKey, dayData]) => {
          acc[dayKey] = {
            ...dayData,
            timeSlots: dayData.timeSlots.map(time => ({
              close: `${time.close.selectedHours}:${time.close.selectedMins}`,
              open: `${time.open.selectedHours}:${time.open.selectedMins}`,
            })),
          };
          return acc;
      }, {});
    this.addOpeningHour = modifiedObj;
  }
  
  onAddOpeningHour(storeId:number)
  {
      this.storeService.createStoreOpeningHours(storeId,this.addOpeningHour).subscribe(res=>{});
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
