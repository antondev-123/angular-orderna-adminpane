import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FilterOption } from '@orderna/admin-panel/src/types/filter';
import { dropdownFadeInOutAnimation } from '@orderna/admin-panel/src/utils/animations';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../button/button.component';
import { hasGroup, isGroup } from '@orderna/admin-panel/src/utils/filter';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';

@Component({
  selector: 'app-input-filter-checkbox',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ButtonComponent,
    ButtonTextDirective,
    MatCheckboxModule,
  ],
  templateUrl: './filter-checkbox.component.html',
  styleUrls: ['./filter-checkbox.component.css'],
  animations: [dropdownFadeInOutAnimation],
})
export class InputFilterCheckboxComponent<T, K extends keyof T>
  implements OnInit
{
  @Input() options!: FilterOption<T, K>[];
  @Input() initialValue!: QueryOptions<T>['filters'];

  @Output() filtersChange = new EventEmitter<
    (T[K] | { groupName: K; filters: T[K][] })[]
  >();

  isOpen: boolean = false;
  optionsByGroup: Partial<Record<K | 'none', Map<T[K], boolean>>> = {};
  isGroup = isGroup;
  hasGroup = hasGroup;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.optionsByGroup;
    for (const { field, value: values } of this.initialValue ?? []) {
      this.optionsByGroup[field as K] = new Map();
      for (const value of (values as string).split(',')) {
        this.optionsByGroup[field as K]?.set(value as T[K], true);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  isChecked(value: T[K], groupName: K | 'none' = 'none') {
    if (!this.optionsByGroup[groupName]) {
      this.optionsByGroup[groupName] = new Map();
    }
    return this.optionsByGroup[groupName]?.get(value);
  }

  toggleOption(value: T[K], groupName: K | 'none' = 'none') {
    this.optionsByGroup[groupName]?.set(
      value,
      !(this.optionsByGroup[groupName]?.get(value) ?? false)
    );
  }

  handleApply() {
    const filtersToApply: (T[K] | { groupName: K; filters: T[K][] })[] = [];
    for (const [groupName, options] of Object.entries(this.optionsByGroup)) {
      if (groupName === 'none') {
        options.forEach((isSelected: boolean, value: T[K]) => {
          if (isSelected) {
            filtersToApply.push(value);
          }
        });
      } else {
        const groupFilters: T[K][] = [];
        options.forEach((isSelected: boolean, value: T[K]) => {
          if (isSelected) {
            groupFilters.push(value);
          }
        });
        filtersToApply.push({
          groupName: groupName as K,
          filters: groupFilters,
        });
      }
    }
    this.filtersChange.emit(filtersToApply);
    this.isOpen = false;
  }

  handleClear() {
    for (const selectedOptions of Object.values(this.optionsByGroup)) {
      selectedOptions.clear();
    }
  }
}
