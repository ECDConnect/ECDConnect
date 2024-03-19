import {
  ActionModal,
  Colours,
  ComponentBaseProps,
  DialogPosition,
  classNames,
} from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { DialogBorderRadiusType } from '@ecdlink/ui/lib/components/dialog/models/DialogBorderRadiusType';

interface HomeVisitPromptProps {
  visible: boolean;
  actionButtons: ActionModalButton[];
}

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

export const getBottomDivStyle = (zIndex?: number) => {
  return !zIndex
    ? 'opacity-50 fixed inset-0 z-40 bg-black'
    : `opacity-50 fixed inset-0 bg-black`;
};

export const getBottomDivSolidStyle = (zIndex?: number) => {
  return !zIndex ? 'fixed inset-0 z-40' : `fixed inset-0`;
};

export const getWrapperStyle = (position: DialogPosition, zIndex?: number) => {
  let baseStyle = !zIndex
    ? `justify-center flex overflow-hidden fixed inset-0 z-50 outline-none focus:outline-none`
    : `justify-center flex overflow-hidden fixed inset-0 outline-none focus:outline-none`;

  switch (position) {
    case DialogPosition.Top:
      baseStyle = classNames(baseStyle, 'items-start');
      break;
    case DialogPosition.Middle:
      baseStyle = classNames(baseStyle, 'items-center');
      break;
    case DialogPosition.Bottom:
      baseStyle = classNames(baseStyle, 'items-end');
  }

  return baseStyle;
};

export const getContentWrapperStyles = (
  stretch: boolean,
  dialogBorderRadiusType: DialogBorderRadiusType,
  fullScreen: boolean
) => {
  if (fullScreen) {
    return `bg-white relative w-full h-full`;
  }

  const baseStyle = classNames(
    dialogBorderRadiusType === 'rounded' ? 'rounded-lg' : '',
    'bg-white relative'
  );

  return `${baseStyle} ${stretch ? 'w-screen' : 'w-96'} sm:w-full`;
};

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
  if (visible) console.log(`zIndex: ${zIndex}`);
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
            className={classNames(getWrapperStyle(position, zIndex), className)}
            data-testid="dialog-wrapper"
          >
            <div
              className={getContentWrapperStyles(
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
                ? getBottomDivSolidStyle(zIndex)
                : getBottomDivStyle(zIndex),
              `bg-${backdropColour}`
            )}
          ></div>
        </>
      )}
    </>
  );
};

export const HomeVisitPrompt = (props: HomeVisitPromptProps) => {
  return (
    <Dialog
      className={'mb-16 px-4'}
      visible={props.visible}
      position={DialogPosition.Middle}
      stretch={false}
      zIndex={2000}
    >
      <ActionModal
        importantText={`Which visit would you like to complete?`}
        actionButtons={props.actionButtons}
      />
    </Dialog>
  );
};
