import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullPipe',
  standalone: true,
})
export class NullPipe implements PipeTransform {
  transform(value: any, defaultValue: any): any {
    return value === null || value === undefined || value === ''
      ? defaultValue
      : value;
  }
}
