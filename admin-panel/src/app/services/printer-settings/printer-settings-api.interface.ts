import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { Observable } from 'rxjs';
import {
  PrinterSetting,
  PrinterSettingUpdateData,
} from '../../model/printer-settings';
import { IUserProfile } from '../../model/user-profile';

export interface IPrinterSettingsApiService {
  getPrinterSetting(
    profileId: IUserProfile['id']
  ): Observable<Maybe<PrinterSetting>>;
  updatePrinterSetting(
    printerSetting: PrinterSettingUpdateData
  ): Observable<PrinterSetting>;
}
