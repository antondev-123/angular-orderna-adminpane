import { Injectable } from '@angular/core';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import {
  Data,
  getItem,
  updateItem,
} from '@orderna/admin-panel/src/utils/service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PRINTER_SETTINGS } from '../../data/printer-settings';
import {
  IPrinterSetting,
  PrinterSetting,
  PrinterSettingUpdateData,
} from '../../model/printer-settings';
import { IUserProfile } from '../../model/user-profile';
import { IPrinterSettingsApiService } from './printer-settings-api.interface';

@Injectable({
  providedIn: 'root',
})
export class PrinterSettingsMockApiService
  implements IPrinterSettingsApiService
{
  data = {
    printer_settings: {
      items: [...PRINTER_SETTINGS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IPrinterSetting>,
      subject: new BehaviorSubject<Maybe<PrinterSetting[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get printerSettingsData() {
    return this.data['printer_settings'] as Data<
      PrinterSetting,
      IPrinterSetting
    >;
  }

  getPrinterSetting(
    profileId: IUserProfile['id']
  ): Observable<Maybe<PrinterSetting>> {
    return getItem(this.printerSettingsData, profileId);
  }

  updatePrinterSetting(
    printerSetting: PrinterSettingUpdateData
  ): Observable<IPrinterSetting> {
    return updateItem(this.printerSettingsData, printerSetting);
  }
}
