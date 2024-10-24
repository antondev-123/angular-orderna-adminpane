import { Provider } from '@angular/core';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatCheckboxDefaultOptions,
} from '@angular/material/checkbox';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogConfig,
} from '@angular/material/dialog';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';

const dialogConfigProvider = {
  provide: MAT_DIALOG_DEFAULT_OPTIONS,
  useValue: {
    autoFocus: 'input:first-of-type ',
    maxWidth: 512,
    ariaModal: true,
    hasBackdrop: true,
    enterAnimationDuration: 200,
    exitAnimationDuration: 100,
    backdropClass: 'ord-modal-backdrop',
    panelClass: 'ord-modal-panel',
  } as MatDialogConfig,
};

const checkboxConfigProvider = {
  provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
  useValue: {
    color: 'primary',
  } as MatCheckboxDefaultOptions,
};

const snackbarConfigProvider = {
  provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
  useValue: {
    duration: 3000,
    horizontalPosition: 'right',
  } as MatSnackBarConfig,
};

// https://material.angular.io/components/ripple/overview#disabling-animation
const rippleConfigProvider = {
  provide: MAT_RIPPLE_GLOBAL_OPTIONS,
  useValue: {
    disabled: true,
    animation: {
      enterDuration: 0,
      exitDuration: 0,
    },
  },
};

export const materialProviders: Provider[] = [
  dialogConfigProvider,
  checkboxConfigProvider,
  rippleConfigProvider,
  snackbarConfigProvider,
];
