import { trigger, transition, style, animate } from '@angular/animations';

export const dropdownFadeInOutAnimation = trigger('dropdownFadeInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-2rem)' }),
    animate(
      '200ms ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
]);

export const modalBackdropFadeInOutAnimation = trigger(
  'modalBackdropFadeInOut',
  [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('200ms ease-out', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('100ms ease-out', style({ opacity: 0 }))]),
  ]
);

export const modalFadeInOutAnimation = trigger('modalFadeInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(4px)' }),
    animate(
      '200ms ease-in-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in-out',
      style({ opacity: 0, transform: 'translateY(4px)' })
    ),
  ]),
]);
