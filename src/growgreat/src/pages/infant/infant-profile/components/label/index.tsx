import { RoundIcon, Typography } from '@ecdlink/ui';

interface LabelProps {
  text: string;
}

export const Label = ({ text }: LabelProps) => {
  return (
    <div className="w flex items-center gap-4">
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
