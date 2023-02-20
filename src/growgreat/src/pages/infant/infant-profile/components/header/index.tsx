import { Colours, RoundIcon, Typography } from '@ecdlink/ui';

interface HeaderProps {
  customIcon?: string;
  icon?: string;
  title: string;
  subTitle?: string;
  tag?: string;
  backgroundColor: Colours;
}
export const Header = ({
  customIcon,
  icon,
  title,
  subTitle,
  tag,
  backgroundColor,
}: HeaderProps) => {
  return (
    <div className="bg-uiBg flex gap-2 p-4">
      <RoundIcon
        {...(customIcon
          ? {
              imageUrl: customIcon,
            }
          : {})}
        {...(icon
          ? {
              icon,
            }
          : {})}
        iconColor="white"
        backgroundColor={backgroundColor}
      />
      <div className="flex flex-col justify-center">
        <Typography
          type="h2"
          align="left"
          weight="bold"
          text={title}
          color="textDark"
        />
        <Typography
          type="body"
          align="left"
          weight="skinny"
          text={subTitle}
          color="textMid"
        />
        <div className="flex">
          {tag && (
            <p className="bg-successMain text-14 w-fit rounded-2xl py-1 px-2 font-semibold text-white">
              {tag}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
