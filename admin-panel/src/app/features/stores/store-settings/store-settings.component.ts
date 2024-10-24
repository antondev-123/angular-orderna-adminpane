import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import { StoresApiService } from '../../../core/stores/stores-api.service';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../shared/components/button/button.component';
import { take } from 'rxjs';
import { WeeklyOpeningHours } from '../../../model/store';

@Component({
  selector: 'app-store-settings',
  standalone: true,
  imports: [
    CommonModule,
    GeneralComponent,
    OpeningHoursComponent,
    BackButtonComponent,
    ButtonComponent,
    ButtonTextDirective,
  ],
  templateUrl: './store-settings.component.html',
  styleUrl: './store-settings.component.css',
})
export class StoreSettingsComponent {
  currentSetting!: string | null;
  router = inject(Router);
  route = inject(ActivatedRoute);
  storeService = inject(StoresApiService);

  loading = signal<boolean>(false);
  storeData : any;
  openingHourData: any;
  editOpeningHour:any;
  get slug() {
    return this.route.snapshot.params['storeName'];
  }

  ngOnInit(): void {
    this.storeService.getStoreBySlug(this.slug).subscribe(((store:any)=>{
      this.storeData = store.data;
    }))
    this.storeService.getOpeningHourById(this.slug).subscribe(((openingHour:any)=>{
      this.openingHourData = openingHour.data;
    }))
    this.route.paramMap.subscribe((params) => {
      this.currentSetting = params.get('settingSlug');
    });
  }

  goToStoreSettingsPage() {
    this.router.navigate(['stores', this.slug, 'edit']);
  }

  goToStoresPage() {
    this.router.navigate(['stores']);
  }

  handleStoreGeneralSettingSaved(data: any) {
    this.loading.set(true);

    this.storeService
      .updateStoreBySlug(this.slug, data)
      .pipe(take(1))
      .subscribe((store) => {
        this.loading.set(false);
        this.goToStoresPage();
      });
  }

  getEditOpeningHour(dataHour:WeeklyOpeningHours)  {
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
    this.editOpeningHour = modifiedObj;
  }
  
  handleStoreOpeningHoursSaved()
  {
    this.loading.set(true);
    this.storeService.createStoreOpeningHours(this.slug,this.editOpeningHour).subscribe(res=>{
      this.loading.set(false);
    })
  }
}
