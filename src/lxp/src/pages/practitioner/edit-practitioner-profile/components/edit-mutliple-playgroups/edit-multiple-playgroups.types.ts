import { FormComponentProps } from '@ecdlink/core';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';

export interface EditMultiplePlayGroupsProps
  extends FormComponentProps<EditPlaygroupModel[]> {
  numberOfPlaygroups: number;
  editPlaygroupAtIndex?: number;
  defaultPlayGroups?: EditPlaygroupModel[];
  onPlayGroupDelete?: (playGroup: EditPlaygroupModel) => void;
}
