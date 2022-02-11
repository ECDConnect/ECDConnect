import { Button, Card, Typography } from '@ecdlink/ui';
import { classNames, renderIcon } from '@ecdlink/ui';
import { ChildProgressNoteCardProps } from './child-progress-note-card.types';

export const ChildProgressNoteCard: React.FC<ChildProgressNoteCardProps> = ({
  note,
  onEdit,
  className,
}) => {
  return (
    <Card className={classNames(className, 'p-4')} borderRaduis={'lg'} shadowSize={'lg'}>
      <Typography type="h3" text="Notes" />
      <Typography type="body" text={note} weight={'skinny'} className={'mt-4'} />
      <Button
        type={'outlined'}
        color={'primary'}
        size={'small'}
        onClick={onEdit}
        className={'mt-4'}
      >
        {renderIcon('PencilIcon', 'w-5 h-5 text-primary mr-1')}
        <Typography type="small" color="primary" text="Edit" className="mr-1" />
      </Button>
    </Card>
  );
};
