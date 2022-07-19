import { Colours, ComponentBaseProps } from '../../models';
import React from 'react';
import * as styles from './dialog.style';
import { DialogPosition } from './models/DialogPosition';
import { classNames } from '../../utils/style-class.utils';
import { DialogBorderRadiusType } from './models/DialogBorderRadiusType';

interface DialogProps extends ComponentBaseProps {
  visible: boolean;
  stretch?: boolean;
  solidBackdrop?: boolean;
  backdropColour?: Colours;
  position: DialogPosition;
  fullScreen?: boolean;
  borderRadius?: DialogBorderRadiusType;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  children,
  position,
  stretch = false,
  solidBackdrop = false,
  backdropColour = 'modalBg',
  borderRadius = 'rounded',
  fullScreen = false,
  className = '',
}) => {
  return (
    <>
      {visible && (
        <>
          <div
            className={classNames(styles.getWrapperStyle(position), className)}
            data-testid="dialog-wrapper"
          >
            <div
              className={styles.getContentWrapperStyles(
                stretch,
                borderRadius,
                fullScreen
              )}
            >
              {children}
            </div>
          </div>
          <div
            className={classNames(
              solidBackdrop ? styles.bottomDivSolid : styles.bottomDiv,
              `bg-${backdropColour}`
            )}
          ></div>
        </>
      )}
    </>
  );
};
