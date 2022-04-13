import * as Yup from 'yup';
import { WorkflowStatusDto } from '../models/dto/StaticData/workflow-status.dto';

export const initialWorkflowStatusValues: () => WorkflowStatusDto = () => ({
  description: '',
  workflowType: '',
  enumId: '',
});

export const workflowStatusSchema = Yup.object().shape({
  description: Yup.string(),
  workflowType: Yup.string(),
});
