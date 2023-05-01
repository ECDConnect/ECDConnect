import { Button, classNames, Typography, renderIcon } from '@ecdlink/ui';
import ChildDevelopmentLevelsList from '../child-development-levels-list/child-development-levels-list';
import * as styles from './child-development-levels-display.styles';
import { ChildDevelopmentLevelsDisplayProps } from './child-development-levels-display.types';

export const ChildDevelopmentLevelsDisplay = ({
  onClose,
  className,
}: ChildDevelopmentLevelsDisplayProps) => {
  return (
    <div className={classNames(className, 'flex flex-col bg-white p-4')}>
      <Typography
        color={'textDark'}
        type={'h3'}
        weight={'bold'}
        text={'Developmental stages'}
      />
      <ChildDevelopmentLevelsList />
      <Button
        color={'primary'}
        type={'filled'}
        disabled={false}
        onClick={() => onClose && onClose()}
        className={styles.closeButton}
      >
        {renderIcon('XIcon', `text-white h-4 w-4 mr-2`)}
        <Typography
          color={'white'}
          type={'help'}
          weight={'normal'}
          text={'Close'}
        />
      </Button>
    </div>
  );
};

export default ChildDevelopmentLevelsDisplay;
