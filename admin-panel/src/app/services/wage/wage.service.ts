import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Wage } from '../../model/wage';

@Injectable({ providedIn: 'root' })
export class WageService {
  getWageSummaryByUserId(userId: number): Observable<Wage[]> {
    return of([
      {
        id: 1,
        startDate: new Date('2024-02-01'),
        wagePerHour: 40,
        isActive: true,
      },
      {
        id: 2,
        startDate: new Date('2023-09-02'),
        endDate: new Date('2024-02-01'),
        wagePerHour: 29,
        isActive: false,
      },
      {
        id: 3,
        startDate: new Date('2023-04-09'),
        endDate: new Date('2023-09-02'),
        wagePerHour: 20,
        isActive: false,
      },
      {
        id: 5,
        startDate: new Date('2022-02-09'),
        endDate: new Date('2023-04-09'),
        wagePerHour: 9,
        isActive: false,
      },
    ] as Wage[]);
  }
}
