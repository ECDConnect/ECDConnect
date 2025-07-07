import { Typography } from '../../components';
import { Colours, ComponentBaseProps } from '../../models';
import { classNames, renderIcon } from '../../utils';
import * as styles from './icon-title-description-tile.styles';
export interface IconTitleDescriptionTileProps extends ComponentBaseProps {
  title: string;
  subTitle: string;
  icon: string;
  iconColour?: Colours;
  iconBorderColour?: Colours;
}

export const IconTitleDescriptionTile = ({
  title,
  subTitle,
  icon,
  iconColour = 'white',
  iconBorderColour = 'tertiary',
  className,
}: IconTitleDescriptionTileProps) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={'mr-4'}>
        <div
          className={classNames(styles.iconWrapper, `bg-${iconBorderColour}`)}
        >
          {renderIcon(icon, `w-5 h-5 text-${iconColour}`)}
        </div>
      </div>
      <div>
        <Typography
          color={'textDark'}
          type={'small'}
          weight={'bold'}
          text={title}
        />
        <Typography
          color={'textMid'}
          type={'help'}
          weight={'normal'}
          text={subTitle}
        />
      </div>
    </div>
  );
};

export default IconTitleDescriptionTile;
