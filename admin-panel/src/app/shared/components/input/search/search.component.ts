import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class InputSearchComponent {
  searchTerm!: string;

  @Input() placeholder!: string;
  @Output() searchTermChange = new EventEmitter<string>();

  @Input() set initialValue(value: string | undefined) {
    this.searchTerm = value ?? '';
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.searchTermChange.emit(this.searchTerm.trim());
  }
}
