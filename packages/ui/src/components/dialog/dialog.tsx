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
  zIndex?: number;
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
  zIndex,
}) => {
  return (
    <>
      {visible && (
        <>
          <div
            ref={
              !zIndex
                ? undefined
                : (el) =>
                    el &&
                    el.style.setProperty('z-index', `${zIndex}`, 'important')
            }
            className={classNames(
              styles.getWrapperStyle(position, zIndex),
              className
            )}
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
            ref={
              !zIndex
                ? undefined
                : (el) =>
                    el &&
                    el.style.setProperty(
                      'z-index',
                      `${zIndex - 1}`,
                      'important'
                    )
            }
            className={classNames(
              solidBackdrop
                ? styles.getBottomDivSolidStyle(zIndex)
                : styles.getBottomDivStyle(zIndex),
              `bg-${backdropColour}`
            )}
          ></div>
        </>
      )}
    </>
  );
};
