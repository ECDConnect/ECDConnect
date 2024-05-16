import { CaregiverDto } from '@ecdlink/core';
import getWeek from 'date-fns/getWeek';
import { createSelector } from 'reselect';
import { Weekdays } from '@utils/practitioner/playgroups-utils';
import { RootState } from '../types';
import {
  CaregiverContactHistory,
  CaregiverContactReason,
} from './caregiver.types';
