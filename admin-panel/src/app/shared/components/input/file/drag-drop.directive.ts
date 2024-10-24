import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
  standalone: true,
})
export class DragDropDirective {
  @Output() files: EventEmitter<File[]> = new EventEmitter();

  @HostBinding('style.background') private background = '';

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '';

    let files: File[] = [];
    const loop = evt.dataTransfer?.files.length || 0;
    for (let i = 0; i < loop; i++) {
      const file = evt.dataTransfer?.files[i];
      file && files.push(file);
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
