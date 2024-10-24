import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Clipboard } from '@angular/cdk/clipboard';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { TableColumn, TableRow } from '@orderna/admin-panel/src/types/table';
import { NullPipe } from '../../../common/pipes/null/null.pipe';
import { BadgeComponent } from '../badge/badge.component';
import { InputTextAreaComponent } from '../input/textarea/textarea.component';
import { CopiedToClipboardSnackbarComponent } from '../snackbar/copied-to-clipboard-snackbar.component';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { TableTotal } from '@orderna/admin-panel/src/types/table-total';
import { TruncatePipe } from '../../../common/pipes/truncate/truncate.pipe';

type TableAction = 'edit' | 'delete' | 'download';

@Directive({
  selector: '[appTableRowExpandableContent]',
  standalone: true,
})
export class TableRowExpandableContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-table',
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed,void',
        style({ height: '0px', minHeight: '0', padding: '0', margin: '0' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    NullPipe,
    TruncatePipe,
    InputTextAreaComponent,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T extends { id: string | number }>
  implements OnInit
{
  @Input() title!: string;
  @Input() totalRows!: number;
  @Input() totalProducts!: number;

  @Input() columns!: TableColumn<T>[];
  @Input() dataSource!: DataSource<T> | T[];

  @Input() initialSort!: QueryOptions<T>['sort'];
  @Input() actions: TableAction[] = ['edit', 'delete'];
  @Input() hasActions: boolean = true;

  @Input() selectable: boolean = true;
  @Input() sortable: boolean = true;

  @Input() expandable: boolean = false;
  @ContentChild(TableRowExpandableContentDirective)
  expandableContent!: TableRowExpandableContentDirective;

  @Input() hasSummary: boolean = false;

  @Input() rowClickable: boolean = false;

  @Input() set initSelectedRows(value: T['id'][]) {
    this.selectedRows = new Set(value);
  }

  @Input() set initSelectAll(value: boolean) {
    this.selectAll = value;
  }

  @Input() summary: Maybe<TableTotal<T>[]> = null;

  @Output() rowsSelectedChange = new EventEmitter<T['id'][]>();
  @Output() allRowsSelectedChange = new EventEmitter<boolean>();
  @Output() sort = new EventEmitter<QueryOptions<T>['sort']>();

  // Table actions
  @Output() delete = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() download = new EventEmitter<T['id']>();

  @Output() rowClick = new EventEmitter<T>();

  // The currently expanded row
  // Only one row can be expanded at a time
  expandedRow: T | null = null;

  readonly dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  isDisabled = true;
  sortState!: Pick<MatSort, 'active' | 'direction'>;
  imageSrc!: string;
  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.initialSort) {
      const { field, direction } = this.initialSort;
      this.sortState = {
        active: field as string,
        direction,
      };
    } else {
      this.sortState = {
        active: this.displayedColumns[1],
        direction: 'desc',
      };
    }
  }

  selectAll: boolean = false;
  // Stores ID of selected rows if selectAll is false, or
  //        ID of deselected rows if selectAll is true
  selectedRows: Set<T['id']> = new Set();

  get displayedColumns() {
    let columns = [...this.columns.map((c) => c.key)];
    if (this.selectable) columns = ['select', ...columns];
    if (this.hasActions) columns = [...columns, 'actions'];
    if (this.expandable) columns = [...columns, 'expand'];
    return columns;
  }

  get actionsColumnWidth() {
    const leftPadding = 12;
    const rightPadding = this.expandable ? 12 : 20;
    const actionButtonWidth = 32;
    return `${
      leftPadding + this.actions.length * actionButtonWidth + rightPadding
    }px`;
  }

  clearRowSelection(rowId?: T['id']) {
    if (rowId) {
      this.selectedRows.delete(rowId);
      this.rowsSelectedChange.emit(Array.from(this.selectedRows));
    } else {
      this.selectAll = false;
      this.selectedRows.clear();
      this.rowsSelectedChange.emit([]);
      this.allRowsSelectedChange.emit(this.selectAll);
    }
  }

  isLabel(column: TableColumn<T>) {
    const value = this.summary?.find((v) => v.field === column.key);

    return value?.isLabel;
  }

  getSummaryValue(column: TableColumn<T>) {
    if (!this.summary) return 0;

    const value = this.summary?.find((v) => v.field === column.key);

    return value?.value;
  }

  getValue(column: TableColumn<T>, row: TableRow<T>) {
    if (column.getValue) {
      if (column.type === 'square-img-plus-string') {
        this.imageSrc = '';
      }
      return column.getValue(row);
    }

    const value = row[column.key as keyof T];
    if (column.type === 'date') {
      return this.dateFormatter.format(value as Date);
    }
    return value;
  }

  handleCopy(event: MouseEvent, value: string) {
    event.stopPropagation();
    this.snackbar.openFromComponent(CopiedToClipboardSnackbarComponent, {
      data: value,
    });
    this.clipboard.copy(value);
  }

  handleDelete(event: MouseEvent, row: T) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  handleEdit(event: MouseEvent, row: T) {
    event.stopPropagation();
    this.edit.emit(row);
  }

  handleDownload(event: MouseEvent, rowId: T['id']) {
    event.stopPropagation();
    this.download.emit(rowId);
  }

  handleExpandRow(event: MouseEvent, row: T) {
    event.stopPropagation();
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  handleToggle(event: MouseEvent, row: T) {
    event.stopPropagation();
    this.expandedRow = row;
  }

  handleRowClicked(row: T) {
    this.rowClick.emit(row);
  }

  handleSort(sortState: Sort) {
    const { active: field, direction } = sortState;

    if (direction) {
      this.sort.emit({
        field,
        direction,
      } as QueryOptions<T>['sort']);
    } else {
      this.sort.emit(undefined);
    }

    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (direction) {
      this.liveAnnouncer.announce(
        `Sorted ${field} in ${direction}ending order`
      );
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  isRowSelectionIndeterminate() {
    return (
      this.selectedRows.size > 0 && this.selectedRows.size < (this.totalRows || this.totalProducts)
    );
  }


  toggleAllRowsSelection() {
    this.selectAll = !this.selectAll;
    this.selectedRows.clear(); 
    if (this.dataSource instanceof MatTableDataSource) {
      if (this.selectAll && this.dataSource.data.length === (this.totalProducts || this.totalRows)) {
        this.dataSource.data.forEach(item => {
          let id = item?.id || item?.productId;
          this.selectedRows.add(id);
        });
      }
      this.rowsSelectedChange.emit([...this.selectedRows]);
      this.allRowsSelectedChange.emit(this.selectAll);
    }
  }
  toggleRowSelection(rowId: T['id']) {
    if (this.selectedRows.has(rowId)) {
      this.selectedRows.delete(rowId);
    } else {
      this.selectedRows.add(rowId);
    }
    this.selectAll = this.selectedRows.size === (this.totalRows || this.totalProducts);

    this.rowsSelectedChange.emit([...this.selectedRows]);
    this.allRowsSelectedChange.emit(this.selectAll);
  }
  
  // Check if all rows are selected
  isAllRowsSelected(): boolean {
    return this.selectedRows.size === (this.totalRows || this.totalProducts);
  }

  // Check if row is selected
  isRowSelected(rowId: T['id']): boolean {
    return this.selectedRows.has(rowId);
  } 
  getRowAriaLabel(rowId: T['id']) {
    return `Select row ${rowId}`;
  }

  getSortActionDescription(label: string) {
    return `Sort by ${label.toLowerCase()}`;
  }
}
