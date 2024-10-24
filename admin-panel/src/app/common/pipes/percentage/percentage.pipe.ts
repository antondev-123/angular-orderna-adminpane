import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
  standalone: true,
})
export class PercentagePipe implements PipeTransform {
  transform(value: number = 0, mainValue: number): number {
    return (value * 100) / mainValue;
  }
}
