import { classNames, RoundIcon, Typography } from '@ecdlink/ui';

interface LabelProps {
  text: string;
  className?: string;
}

export const Label = ({ text, className }: LabelProps) => {
  return (
    <div className={classNames('w flex items-center gap-4', className)}>
      <RoundIcon
        size={{ h: '9', w: '9' }}
        icon="ChatAlt2Icon"
        backgroundColor="infoMain"
        iconColor="white"
      />
      <Typography
        type="body"
        align="left"
        weight="skinny"
        text={text}
        className="text-infoDark"
      />
    </div>
  );
};
