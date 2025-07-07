import {
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
} from '@ecdlink/core';
import {
  ChildProgressReport,
  ChildProgressReportInput,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentReportService } from '@services/ContentReportService';
import { RootState, ThunkApiType } from '../../types';
import { ChildProgressReportQueryParams } from './report.types';
