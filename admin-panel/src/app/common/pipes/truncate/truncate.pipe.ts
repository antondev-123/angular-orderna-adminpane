import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit: number = 20,
    completeWords: boolean = false,
    ellipsis: string = '...'
  ): string {
    if (!value) return '';
    if (value.length > limit && completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }
}
