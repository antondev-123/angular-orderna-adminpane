import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropDownComponent } from '../dropdown-time/dropdown-time.component';

export interface TimeslotChangeEvent {
  selectedHours: string;
  selectedMins: string;
  timeType: string;
  timeslotId: string;
}

@Component({
  selector: 'app-store-timeslot',
  standalone: true,
  imports: [CommonModule, DropDownComponent],
  templateUrl: './store-timeslot.component.html',
  styleUrls: ['./store-timeslot.component.css'], // Corrected from styleUrl to styleUrls
})
export class StoreTimeslotComponent {
  @Input() selectedTimeslotId!: string;
  @Input() timeSlots: any;
  @Input() alltimeSlots: any;
  @Output() deleteSelection = new EventEmitter<number>();
  @Output() timeslotChange = new EventEmitter<TimeslotChangeEvent>(); // Use the interface

  deleteTimeslot(): void {
    const index = parseInt(this.selectedTimeslotId.substring(3), 10);
    this.deleteSelection.emit(index);
  }

  onTimeslotChange(
    event: { selectedHours: string; selectedMins: string },
    timeType: string
  ): void {
    this.timeslotChange.emit({ ...event, timeType, timeslotId: this.selectedTimeslotId });
  }
}
