import { ComponentBaseProps } from '@ecdlink/ui';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';

export interface ConfirmPlaygroupListItemProps extends ComponentBaseProps {
  index: number;
  playGroup: EditPlaygroupModel;
  onPlayGroupEdit: () => void;
}
