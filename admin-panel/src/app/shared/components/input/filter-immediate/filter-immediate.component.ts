import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  FilterOption,
  FilterOptionItem,
} from '@orderna/admin-panel/src/types/filter';
import { isGroup } from '@orderna/admin-panel/src/utils/filter';

@Component({
  selector: 'app-input-filter-immediate',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './filter-immediate.component.html',
  styleUrls: ['./filter-immediate.component.scss'],
})
export class InputFilterImmediateComponent<T, K extends keyof T> {
  @Input() options!: FilterOption<T, K>[];
  @Input() ariaLabel!: string;
  @Input() svgIcon!: string;

  @Input('initialValue') set initialFilter(value: T[K]) {
    this.filter = value;
  }
  @Input() multiple: boolean = false;

  @Output() filterChange = new EventEmitter<T>();

  filter!: FilterOptionItem<T[K]>['value'];
  isGroup = isGroup;

  get count() {
    return (this.filter as []).length;
  }

  handleFilterChange(option: MatSelectChange) {
    this.filterChange.emit(option.value);
  }
}
