import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/* Used to represent the entire app's loading state */

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  getLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
