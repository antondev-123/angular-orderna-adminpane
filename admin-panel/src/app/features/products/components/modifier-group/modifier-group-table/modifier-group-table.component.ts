import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ModifierGroup } from '../../../../../model/modifier-group';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { TableColumn } from '@orderna/admin-panel/src/types/table';

@Component({
  selector: 'app-modifier-group-table',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './modifier-group-table.component.html',
  styleUrl: './modifier-group-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifierGroupTableComponent {
  data = input<ModifierGroup[]>();
  edit = output<ModifierGroup>();
  delete = output<ModifierGroup>();

  readonly columns: TableColumn<ModifierGroup>[] = [
    {
      key: 'title',
      type: 'string',
      label: 'Group',
    },
    {
      key: 'options',
      type: 'string',
      label: 'Options',
      getValue: (modifierGroup) =>
        modifierGroup.options.reduce((acc, option, index) => {
          const separator = index !== 0 ? ', ' : '';
          return `${acc}${separator}${option.title}`;
        }, ''),
      truncateAfter: 40, // characters
    },
  ];
}
