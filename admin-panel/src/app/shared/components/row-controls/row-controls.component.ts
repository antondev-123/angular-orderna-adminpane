import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../button/button.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-row-controls',
  standalone: true,
  imports: [CommonModule, MatIconModule, ButtonComponent, ButtonTextDirective],
  templateUrl: './row-controls.component.html',
  styleUrl: './row-controls.component.css',
})
export class RowControlComponent {
  @Input() numberOfSelectedRows!: number;
  @Output() delete = new EventEmitter();

  get show() {
    return this.numberOfSelectedRows > 0;
  }

  handleDelete() {
    this.delete.emit();
  }
}
