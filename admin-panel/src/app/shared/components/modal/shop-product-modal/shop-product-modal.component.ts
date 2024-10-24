import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-shop-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-product-modal.component.html',
  styleUrls: ['./shop-product-modal.component.css'],
})
export class ShopProductModalComponent implements OnInit, OnDestroy {
  @Input() id: string = '';
  @Input() modalOpen: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  private handleDocumentClick = (event: MouseEvent): void => {
    console.log('Document click event');
    if (!this.modalOpen) return;

    const modalContent = this.elementRef.nativeElement.querySelector('.modal-content');
    if (modalContent && !modalContent.contains(event.target as Node)) {
      this.onCloseModal();
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent): void => {
    console.log('Document keydown event');
    if (this.modalOpen && event.key === 'Escape') {
      this.onCloseModal();
    }
  };

  onCloseModal(): void {
    console.log('Closing modal');
    this.closeModal.emit();
  }
}