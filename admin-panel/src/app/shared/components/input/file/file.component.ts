import { ChangeDetectorRef, EventEmitter, inject, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DragDropDirective } from './drag-drop.directive';
import { MatIconModule } from '@angular/material/icon';
import { FileSizePipe } from '@orderna/admin-panel/src/app/common/pipes/file-size.pipe';

type fileTypes = 'png' | 'jpg' | 'jpeg' | 'webp';

const toBytes = (val: number) => val * 1024 * 1024;

const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.pop()?.toLowerCase() || '';
};

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [DragDropDirective, MatIconModule, FileSizePipe],
  templateUrl: './file.component.html',
  styleUrl: '../input.component.scss',
})
export class InputFileComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() controlName!: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() value?: string = '';
  @Input() fileTypes!: fileTypes;
  @Output() public hideEvent = new EventEmitter<any>();
  /* The `@Input() set size(value: number)` is a setter method which takes maximum file size limit in MB format */
  @Input() set size(value: number) {
    this.maxFileSize = toBytes(value);
  }
  currentFile!: File;
  file!: FormControl;
  imageUrl!: any;
  parentContainer = inject(ControlContainer);
  files: File[] = [];
  private maxFileSize: number = toBytes(10); //default size 10 MB

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.file.hasValidator(Validators.required);
  }

  ngOnInit() {
    this.file = new FormControl(this.value, this.validators);
    this.parentFormGroup.addControl(this.controlName, this.file);
  }

  handleFileDrop(files: File[]) {
    const approved: File[] = [];
    files.forEach((file: File) => {
      if (
        !(file.size > this.maxFileSize) &&
        this.fileTypes.includes(getFileExtension(file.name))
      ) {
        approved.push(file);
      } else {
        console.error('Invalid File');
      }
    });
    this.files = this.files.concat(approved);
    this.parentFormGroup.get(this.controlName)?.patchValue(this.files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.parentFormGroup.get(this.controlName)?.patchValue(this.imageUrl);
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlName);
  }

  selectFile(event: any): void {
    this.files = [];
    this.currentFile = event.target.files.item(0);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.parentFormGroup.get(this.controlName)?.setValue(this.imageUrl);
    };
    reader.readAsDataURL(this.currentFile);
    this.files.push(this.currentFile);
    this.hideEvent.emit(this.files);
  }
}
