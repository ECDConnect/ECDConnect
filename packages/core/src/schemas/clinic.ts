import * as Yup from 'yup';
import { ClinicDto } from '../models';

// export const initialClinicValues: ClinicDto = {
//   name: '',
//   phoneNumber: '',
// };

export const clkinicSchema = Yup.object().shape({
  name: Yup.string(),
  phoneNumber: Yup.string(),
});
