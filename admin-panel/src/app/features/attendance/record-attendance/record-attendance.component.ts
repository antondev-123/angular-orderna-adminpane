import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import { BreakDto } from '../../../model/break';
import { AttendanceTrackingComponent } from '../attendance-tracking/attendance-tracking.component';
import { AttendancesState } from '../attendance.state';
import { AttendanceTrackingType } from './../../../model/attendance-tracking-type';
import { BreakSummaryComponent } from './break-summary/break-summary.component';
import { BreakTrackingComponent } from './break-tracking/break-tracking.component';
import { WageSummaryComponent } from './wage-summary/wage-summary.component';
import { WebcamTrackerComponent } from './webcam-tracker/webcam-tracker.component';
import { StoresApiService } from '../../../core/stores/stores-api.service';
import { AuthApiService } from '../../../core/auth/auth-api.service';

@Component({
  selector: 'app-record-attendance',
  templateUrl: './record-attendance.component.html',
  styleUrls: ['./record-attendance.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WageSummaryComponent,
    InputFilterImmediateComponent,
    BreakTrackingComponent,
    BreakSummaryComponent,
    AttendanceTrackingComponent,
    WebcamTrackerComponent,
    BackButtonComponent,
    BadgeComponent,
  ],
})
export class RecordAttendanceComponent implements OnInit {
  AttendanceTrackingType = AttendanceTrackingType;

  #storesService = inject(StoresApiService);
  #stores = toSignal(this.#storesService.getStoreNames());

  #attendancesState = inject(AttendancesState);
  #authService = inject(AuthApiService);

  storeFilterOptions = computed(() => [
    ...this.#stores()!.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ]);

  protected selectedStore = signal<number | undefined>(undefined);
  protected clockIn = signal<Date | undefined>(undefined);
  protected clockInImage = signal<string>('');
  protected clockOut = signal<Date | undefined>(undefined);
  protected clockOutImage = signal<string | undefined>(undefined);
  protected activeBreak = signal<Date | undefined>(undefined);
  protected breaks = signal<BreakDto[]>([]);

  #userId = this.#authService.currentUserValue!.id;
  #todayAttendance = this.#attendancesState.selectedAttendance;
  #router = inject(Router);

  #initData = effect(
    () => {
      const todayAttendance = this.#todayAttendance();
      if (!todayAttendance) {
        return;
      }

      this.selectedStore.set(todayAttendance.store.id);
      this.clockIn.set(todayAttendance.clockIn);
      this.clockOut.set(todayAttendance.clockOut);
      this.clockInImage.set(todayAttendance.clockInImage);
      this.clockOutImage.set(todayAttendance.clockOutImage);
      this.activeBreak.set(todayAttendance.activeBreak);
      this.breaks.set(todayAttendance.breaks);
    },
    { allowSignalWrites: true }
  );

  #changeAttendanceStore = effect(() => {
    const selectedStore = this.selectedStore();
    const todayAttendance = this.#todayAttendance();

    if (selectedStore && todayAttendance) {
      this.#attendancesState.changeAttendanceStore(
        todayAttendance.id,
        selectedStore
      );
    }
  });

  ngOnInit() {
    this.#attendancesState.getTodayAttendance(this.#userId);
  }

  protected onClockIn(image: string) {
    this.#attendancesState.clockIn(this.#userId, this.selectedStore()!, image);
  }

  protected onUpdateClockInImage(image: string) {
    this.#attendancesState.updateClockInImage(
      this.#todayAttendance()!.id,
      image
    );
  }

  protected onClockOut(image: string) {
    this.#attendancesState.clockOut(this.#todayAttendance()!.id, image);
  }

  protected onUpdateClockOutImage(image: string) {
    this.#attendancesState.updateClockOutImage(
      this.#todayAttendance()!.id,
      image
    );
  }

  protected onBreakStart() {
    this.#attendancesState.startBreak(this.#todayAttendance()!.id);
    this.#router.navigateByUrl('/freeze');
  }

  protected onBreakEnd() {
    this.#attendancesState.endBreak(this.#todayAttendance()!.id);
  }

  protected backToAttendanceList() {
    this.#router.navigateByUrl('/attendances');
  }
}
