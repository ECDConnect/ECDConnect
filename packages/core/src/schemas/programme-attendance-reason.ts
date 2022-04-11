import * as Yup from 'yup';
import { ProgrammeAttendanceReasonDto } from '../models/dto/Classroom';

export const initialAttendenceReasonValues: ProgrammeAttendanceReasonDto = {
  reason: '',
};

export const attendenceReasonSchema = Yup.object().shape({
  reason: Yup.string(),
});
