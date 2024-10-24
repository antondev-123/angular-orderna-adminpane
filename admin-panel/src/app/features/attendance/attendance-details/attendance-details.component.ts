import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import { SwitcherComponent } from '../../../shared/components/switcher/switcher.component';
import { AttendancesState } from '../attendance.state';
import { BreakSummaryComponent } from '../record-attendance/break-summary/break-summary.component';
import { WageSummaryComponent } from '../record-attendance/wage-summary/wage-summary.component';
import { StoresApiService } from '../../../core/stores/stores-api.service';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrls: ['./attendance-details.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SwitcherComponent,
    WageSummaryComponent,
    BreakSummaryComponent,
    InputFilterImmediateComponent,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FlatpickrModule,
    NgTemplateOutlet,
    DatePipe,
    BackButtonComponent,
  ],
})
export class AttendanceDetailsComponent implements OnInit {
  id = input<number>();

  #attendanceState = inject(AttendancesState);
  #storesService = inject(StoresApiService);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  attendance = this.#attendanceState.selectedAttendance;
  summary = computed(() => this.attendance()?.toAttendanceSummary());

  #stores = toSignal(this.#storesService.getStoreNames());

  storeFilterOptions = computed(() => [
    ...this.#stores()!.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ]);

  user = computed(() => this.attendance()?.user);

  async ngOnInit() {
    this.#attendanceState.getAttendanceById(+this.id()!);
  }

  protected backToAttendanceList(): void {
    this.#router.navigate(['../..'], { relativeTo: this.#activatedRoute });
  }
}
