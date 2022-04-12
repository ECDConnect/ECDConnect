import * as Yup from 'yup';
import { RaceDto } from '../models/dto/StaticData/race.dto';

export const initialRaceValues: RaceDto = {
  description: '',
  enumId: '',
};

export const raceSchema = Yup.object().shape({
  description: Yup.string(),
});
