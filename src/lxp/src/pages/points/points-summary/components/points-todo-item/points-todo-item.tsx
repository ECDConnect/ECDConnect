import { Card, renderIcon, Typography } from '@ecdlink/ui';
import { ClipboardListIcon } from '@heroicons/react/solid';

interface PointsTodoItemProps {
  text: string;
  icon: string;
}

export const PointsTodoItem: React.FC<PointsTodoItemProps> = ({
  text,
  icon,
}) => {
  return (
    <Card className="bg-adminBackground mt-1.5 rounded-2xl p-3">
      <div className="flex items-center gap-4">
        <div className="bg-secondary rounded-full p-4">
          {renderIcon(icon, `w-5 h-5 text-white`)}
        </div>
        <Typography type="h4" color={'textDark'} text={text} />
      </div>
    </Card>
  );
};
