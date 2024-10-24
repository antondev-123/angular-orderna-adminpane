import { Component, EventEmitter, inject, OnInit,input, Output, TemplateRef,Input, SimpleChanges } from '@angular/core';
import { StoreOpeningHourCardComponent } from '../store-opening-hour-card/store-opening-hour-card.component';
import { CommonModule } from '@angular/common';
import { StoresApiService } from '@orderna/admin-panel/src/app/core/stores/stores-api.service';
import { WeeklyOpeningHours, IOpeningHours } from '@orderna/admin-panel/src/app/model/store';
import { FormBuilder } from '@angular/forms';
import { WEEKLY, WeekDay } from '../../../onboarding/components/store-opening-hours/weekdays';

@Component({
  selector: 'app-opening-hours',
  standalone: true,
  imports: [StoreOpeningHourCardComponent, CommonModule],
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.css'],
})
export class OpeningHoursComponent implements OnInit {
  readonly WEEKLY = WEEKLY;
  @Output() openingHoursChange = new EventEmitter<any>();
  actionsTemplate = input<TemplateRef<any>>();
  storeService = inject(StoresApiService);
  formBuilder = inject(FormBuilder);
  @Input() openingHourData : any;
  // TODO: Add controls to this formGroup
  formGroup = this.formBuilder.group({});

  weeklyOpeningHours: WeeklyOpeningHours = {} as WeeklyOpeningHours;

  ngOnInit(): void {
    this.loadOpeningHours();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openingHourData'] && this.openingHourData) {
      this.setOpeningHourData();
    }
  }
  
  setOpeningHourData(): void {
    Object.keys(this.openingHourData).forEach((day: string) => {
      const dayData = this.openingHourData[day];
      this.weeklyOpeningHours[day as keyof WeeklyOpeningHours] = {
        timeSlots: dayData.timeSlots.map((slot: any) => ({
          open: { selectedHours: slot.open.split(':')[0], selectedMins: slot.open.split(':')[1] },
          close: { selectedHours: slot.close.split(':')[0], selectedMins: slot.close.split(':')[1] },
        })),
        isClosed: dayData.isClosed,
        is24Hours: dayData.is24Hours,
      };
    });
  }

  loadOpeningHours(): void {
    this.weeklyOpeningHours = {
      monday: {
        timeSlots: [
          {
            open: { selectedHours: '00', selectedMins: '00' },
            close: { selectedHours: '00', selectedMins: '00' },
          },
        ],
        isClosed: false,
        is24Hours: false,
      },
      tuesday: {
        timeSlots: [
          {
            open: { selectedHours: '00', selectedMins: '00' },
            close: { selectedHours: '00', selectedMins: '00' },
          },
        ],
        isClosed: false,
        is24Hours: false,
      },
      wednesday: {
        timeSlots: [
          {
            open: { selectedHours: '00', selectedMins: '00' },
            close: { selectedHours: '00', selectedMins: '00' },
          },
        ],
        isClosed: false,
        is24Hours: false,
      },
      thursday: {
        timeSlots: [
          {
            open: { selectedHours: '00', selectedMins: '00' },
            close: { selectedHours: '00', selectedMins: '00' },
          },
        ],
        isClosed: false,
        is24Hours: false,
      },
      friday: {
        timeSlots: [
          {
            open: { selectedHours: '00', selectedMins: '00' },
            close: { selectedHours: '00', selectedMins: '00' },
          },
        ],
        isClosed: false,
        is24Hours: false,
      },
      saturday: {
        timeSlots: [
          {
            open: { selectedHours: '00', selectedMins: '00' },
            close: { selectedHours: '00', selectedMins: '00' },
          },
        ],
        isClosed: false,
        is24Hours: false,
      },
      sunday: {
        timeSlots: [
          {
            open: { selectedHours: '00', selectedMins: '00' },
            close: { selectedHours: '00', selectedMins: '00' },
          },
        ],
        isClosed: false,
        is24Hours: false,
      },
    }
  }

  updateTimeslot(event: any): void {
    console.log('Data to update the week day', event);

    // Assuming event contains the storeId and the new openingHours
    const { storeId, openingHours } = event;

    // Call the service method to update opening hours
    this.storeService
      .updateStoreOpeningHours(storeId, openingHours)
      .subscribe((success: boolean) => {
        if (success) {
          console.log('Opening hours updated successfully');
        } else {
          console.error('Failed to update opening hours');
        }
      });
  }

  dataFromChild(data:IOpeningHours,index:number){
    this.weeklyOpeningHours[WEEKLY[index]]=data
    this.openingHoursChange.emit(this.weeklyOpeningHours)
  }
}
