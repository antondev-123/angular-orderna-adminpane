import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrinterSettingUpdateData } from '../../model/printer-settings';

import { UserProfile } from '../../model/user-profile';
import { IPrinterSettingsApiService } from './printer-settings-api.interface';

let API_URL = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root',
})
export class PrinterSettingsApiService implements IPrinterSettingsApiService {
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
}
