import { classNames } from '../../utils';

type EmptyPageProps = {
  className?: string;
  image: string;
  title: string;
  subTitle?: string;
  isSmallScreen?: boolean;
};

export const EmptyPage = ({
  className,
  image,
  title,
  subTitle,
  isSmallScreen,
}: EmptyPageProps) => {
  return (
    <div
      className={classNames(
        className,
        `flex flex-col items-center justify-center ${
          isSmallScreen ? 'pt-2' : 'pt-16'
        } text-center`
      )}
    >
      <img src={image} alt="alien" />
      <p className="text-textDark text-18 mt-4 mb-2 font-semibold">{title}</p>
      <p className="text-textMid">{subTitle}</p>
    </div>
  );
};
