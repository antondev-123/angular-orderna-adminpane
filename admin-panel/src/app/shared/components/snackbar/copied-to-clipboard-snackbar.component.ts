import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-copied-to-clipboard-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './copied-to-clipboard-snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class CopiedToClipboardSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}

  snackBarRef = inject(MatSnackBarRef);
}
