import { ComponentBaseProps, TabItem, Typography } from '@ecdlink/ui';

export interface AttendanceTutorialProps extends ComponentBaseProps {
  onComplete: () => void;
  onClose: () => void;
}

export const tabItems: TabItem[] = [
  {
    title: 'Attendance',
    initActive: false,
    child: (
      <div className={'flex gap-12 p-4'}>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="successMain" text={'6'} />
          <Typography type={'h4'} color="textDark" text={'Present'} />
        </div>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="textDark" text={'0'} />
          <Typography type={'body'} color="textDark" text={'Absent'} />
        </div>
      </div>
    ),
  },
  {
    title: 'Children',
    initActive: false,
    child: (
      <div className={'flex gap-12 p-4'}>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="successMain" text={'6'} />
          <Typography type={'h4'} color="textDark" text={'Present'} />
        </div>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="textDark" text={'0'} />
          <Typography type={'body'} color="textDark" text={'Absent'} />
        </div>
      </div>
    ),
  },
  {
    title: 'Programme',
    initActive: false,
    child: (
      <div className={'flex gap-12 p-4'}>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="successMain" text={'6'} />
          <Typography type={'h4'} color="textDark" text={'Present'} />
        </div>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="textDark" text={'0'} />
          <Typography type={'body'} color="textDark" text={'Absent'} />
        </div>
      </div>
    ),
  },
  {
    title: 'Resources',
    initActive: false,
    child: (
      <div className={'flex gap-12 p-4'}>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="successMain" text={'6'} />
          <Typography type={'h4'} color="textDark" text={'Present'} />
        </div>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="textDark" text={'0'} />
          <Typography type={'body'} color="textDark" text={'Absent'} />
        </div>
      </div>
    ),
  },
];
