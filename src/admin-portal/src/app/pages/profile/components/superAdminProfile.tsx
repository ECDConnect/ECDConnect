import { Typography } from '@ecdlink/ui';
import { UserContextType } from '../../../hooks/useUser';

interface SuperAdminProfileProps {
  user: UserContextType;
}

export const SuperAdminProfile: React.FC<SuperAdminProfileProps> = ({
  user,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Typography
        type={'body'}
        weight={'bold'}
        color={'textMid'}
        text={'Email address:'}
      />
      <Typography type={'body'} color={'textMid'} text={user?.user?.email} />
    </div>
  );
};
