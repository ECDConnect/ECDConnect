import * as Yup from 'yup';
import { SettingsDto } from '../models/dto/Settings';

export const initialSettingValues: SettingsDto = {
  grouping: '',
  name: '',
  value: '',
};

export const settingSchema = Yup.object().shape({
  grouping: Yup.string(),
  name: Yup.string(),
  value: Yup.string(),
});
