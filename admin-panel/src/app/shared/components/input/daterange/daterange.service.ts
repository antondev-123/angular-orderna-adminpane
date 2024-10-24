import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class InputDateRangeService {
  public applyDisabled = new BehaviorSubject(false);
  public customPresets: string[] = [];
}
