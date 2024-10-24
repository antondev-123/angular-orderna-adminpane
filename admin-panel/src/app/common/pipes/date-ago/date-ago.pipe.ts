import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  standalone: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) {
      return '';
    }

    const now = new Date();
    const date = new Date(value);
    const seconds = Math.floor((+now - +date) / 1000);

    if (seconds < 29) {
      return 'Just now';
    }

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    let counter: number;
    for (const key in intervals) {
      counter = Math.floor(seconds / intervals[key]);
      if (counter > 0) {
        return counter === 1 ? `1 ${key} ago` : `${counter} ${key}s ago`;
      }
    }
    return value;
  }
}