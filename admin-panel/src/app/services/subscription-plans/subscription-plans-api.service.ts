import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrinterSettingUpdateData } from '../../model/printer-settings';

import { UserProfile } from '../../model/user-profile';
import { ISubscriptionPlansApiService } from './subscription-plans-api.interface';
import { SubscriptionPlanUpdateData } from '../../model/subscription-plan';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlansApiService
  implements ISubscriptionPlansApiService
{
  private http = inject(HttpClient);

  getPrinterSetting(profileId: UserProfile['id']): Observable<any> {
    return this.http.get(API_URL + `billing-invoices/${profileId}`);
  }
  updatePrinterSetting(
    printerSetting: PrinterSettingUpdateData
  ): Observable<any> {
    return this.http.put(
      API_URL + 'printer-setting-update',
      JSON.stringify(printerSetting)
    );
  }

  getSubscriptionPlan(profileId: UserProfile['id']): Observable<any> {
    return this.http.get(API_URL + `billing-invoices/${profileId}`);
  }
  updateSubscriptionPlan(
    subscriptionPlan: SubscriptionPlanUpdateData
  ): Observable<any> {
    return this.http.put(
      API_URL + 'subscription-plan-update',
      JSON.stringify(subscriptionPlan)
    );
  }
}
