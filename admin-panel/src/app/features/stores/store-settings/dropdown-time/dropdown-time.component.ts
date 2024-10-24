import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-time.component.html',
})
export class DropDownComponent implements OnInit{
  @Input() timeSlots: any;
  @Input() timeType: any;
  @Output() timeslotChange = new EventEmitter<{
    selectedHours: string;
    selectedMins: string;
  }>();
  dropdownOpenHours = false;
  dropdownOpenMins = false;
  hours = Array.from({ length: 24 }, (_, i) => ('0' + i).slice(-2));
  minutes = Array.from({ length: 60 }, (_, i) => ('0' + i).slice(-2));

  ngOnInit(): void {
    // console.log('f', this.timeSlots)
    // throw new Error('Method not implemented.');
  }
  toggleDropdown(type: string): void {
    if (type === 'hours') {
      this.dropdownOpenHours = !this.dropdownOpenHours;
      this.dropdownOpenMins = false; // Close other dropdown
    } else {
      this.dropdownOpenMins = !this.dropdownOpenMins;
      this.dropdownOpenHours = false; // Close other dropdown
    }
  }

  selectHour(hour: string): void {
    this.timeSlots.selectedHours = hour;
    this.dropdownOpenHours = false;
    this.emitChange();
  }

  selectMin(min: string): void {
    this.timeSlots.selectedMins = min;
    this.dropdownOpenMins = false;
    this.emitChange();
  }

  private emitChange(): void {
    this.timeslotChange.emit({
      selectedHours: this.timeSlots.selectedHours,
      selectedMins: this.timeSlots.selectedMins,
    });
  }
  
}
