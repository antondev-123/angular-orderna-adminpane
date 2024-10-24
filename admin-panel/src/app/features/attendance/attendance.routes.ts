import { Routes } from '@angular/router';

export default <Routes>[
  {
    path: '',
    loadComponent: async () =>
      (await import('./attendance.component')).AttendanceComponent,
    children: [
      {
        path: '',
        loadComponent: async () =>
          (await import('./attendance-list/attendance-list.component'))
            .AttendanceListComponent,
      },
      {
        path: 'record',
        loadComponent: async () =>
          (await import('./record-attendance/record-attendance.component'))
            .RecordAttendanceComponent,
      },
      {
        path: 'details/:id',
        loadComponent: async () =>
          (await import('./attendance-details/attendance-details.component'))
            .AttendanceDetailsComponent,
      },
      {
        path: 'edit/:id',
        loadComponent: async () =>
          (await import('./edit-attendance/edit-attendance.component'))
            .EditAttendanceComponent,
      },
      {
        path: 'freeze',
        data: { layout: 'auth' },
        loadComponent: async () =>
          (await import('./break-freeze/break-freeze.component'))
            .BreakFreezeComponent,
      },
    ],
  },
];
