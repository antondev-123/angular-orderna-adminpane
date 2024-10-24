import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef, input } from '@angular/core';
import {
  StoreTimeslotComponent,
  TimeslotChangeEvent,
} from '../store-timeslot/store-timeslot.component';
import { FormsModule } from '@angular/forms';
import { IOpeningHours } from '@orderna/admin-panel/src/app/model/store';
import { WeekDay } from '../../../onboarding/components/store-opening-hours/weekdays';

@Component({
  selector: 'app-store-opening-hour-card',
  standalone: true,
  imports: [CommonModule, StoreTimeslotComponent, FormsModule],
  templateUrl: './store-opening-hour-card.component.html',
  styleUrls: ['./store-opening-hour-card.component.css'],
})
export class StoreOpeningHourCardComponent {
  day = input.required<WeekDay>();
  openingHours = input.required<IOpeningHours>();
  @Output() openingHoursChange = new EventEmitter<any>();

  addTimeslot(): void {
    const tsLength = this.openingHours().timeSlots.length + 1;
    this.openingHours().timeSlots.push({
      open: { selectedHours: '00', selectedMins: '00' },
      close: { selectedHours: '00', selectedMins: '00' },
    });
  }

  deleteSelectedTimeslot(index: number): void {
    this.openingHours().timeSlots.splice(index, 1);
  }

  toggleClosed(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.openingHours().isClosed = true;
      this.openingHours().is24Hours = false;
    } else {
      this.openingHours().isClosed = false;
    }
    this.openingHoursChange.emit(this.openingHours());
  }

  toggle24Hours(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.openingHours().is24Hours = true;
      this.openingHours().isClosed = false;
    } else {
      this.openingHours().is24Hours = false;
    }
    this.openingHoursChange.emit(this.openingHours());
  }

  isAnyTimeslotClosedOr24Hours(): boolean {
    return (
      this.openingHours().isClosed ||
      this.openingHours().is24Hours
    );
  }

  onTimeslotChange(event: TimeslotChangeEvent, timeslotIndex: number): void {
    if (event.timeType === 'start') {
      this.openingHours().timeSlots[timeslotIndex].open.selectedHours =
        event.selectedHours;
      this.openingHours().timeSlots[timeslotIndex].open.selectedMins =
        event.selectedMins;
    } else if (event.timeType === 'end') {
      this.openingHours().timeSlots[timeslotIndex].close.selectedHours =
        event.selectedHours;
      this.openingHours().timeSlots[timeslotIndex].close.selectedMins =
        event.selectedMins;
    }
    this.openingHoursChange.emit(this.openingHours());
  }
}
