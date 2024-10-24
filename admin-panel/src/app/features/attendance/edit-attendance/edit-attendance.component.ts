import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import { AttendanceTrackingType } from '../../../model/attendance-tracking-type';
import { AttendanceTrackingComponent } from '../attendance-tracking/attendance-tracking.component';
import { AttendancesState } from '../attendance.state';
import { BreakSummaryComponent } from '../record-attendance/break-summary/break-summary.component';
import { BreakTrackingComponent } from '../record-attendance/break-tracking/break-tracking.component';
import { WageSummaryComponent } from '../record-attendance/wage-summary/wage-summary.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { StoresApiService } from '../../../core/stores/stores-api.service';

@Component({
  selector: 'app-edit-attendance',
  standalone: true,
  imports: [
    WageSummaryComponent,
    InputFilterImmediateComponent,
    BreakTrackingComponent,
    BreakSummaryComponent,
    AttendanceTrackingComponent,
    FileUploadComponent,
    MatIconModule,
    DatePipe,
    NgTemplateOutlet,
    BackButtonComponent,
  ],
  templateUrl: './edit-attendance.component.html',
  styleUrl: './edit-attendance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAttendanceComponent {
  AttendanceTrackingType = AttendanceTrackingType;

  id = input<number>();

  #attendancesState = inject(AttendancesState);
  #storesService = inject(StoresApiService);
  #router = inject(Router);

  attendance = this.#attendancesState.selectedAttendance;

  #stores = toSignal(this.#storesService.getStoreNames());

  storeFilterOptions = computed(() => [
    ...this.#stores()!.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ]);

  selectedStore = computed(() => this.attendance()?.store.id);
  user = computed(() => this.attendance()?.user);
  summary = computed(() => this.attendance()?.toAttendanceSummary());

  async ngOnInit() {
    this.#attendancesState.getAttendanceById(+this.id()!);
  }

  protected changeAttendanceStore(storeId: number) {
    this.#attendancesState.changeAttendanceStore(+this.id()!, +storeId);
  }

  protected onUpdateClockInImage(image: string) {
    this.#attendancesState.updateClockInImage(+this.id()!, image);
  }

  protected onClockOut(image: string) {
    this.#attendancesState.clockOut(+this.id()!, image);
  }

  protected onUpdateClockOutImage(image: string) {
    this.#attendancesState.updateClockOutImage(+this.id()!, image);
  }

  protected backToAttendanceList() {
    this.#router.navigateByUrl('/attendances');
  }
}
