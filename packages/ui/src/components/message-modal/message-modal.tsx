import { ComponentBaseProps } from '../../models';
import { renderIcon } from '../../utils';
import { classNames } from '../../utils/style-class.utils';
import Typography from '../typography/typography';
import * as styles from './message-modal.styles';

export interface MessageModalProps extends ComponentBaseProps {
  icon: string;
  title?: string;
  message?: string;
  visible: boolean;
  onClose: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  icon = '',
  title = '',
  message = '',
  visible,
  onClose,
  className,
}: MessageModalProps) => {
  return (
    <div
      className={classNames(className, styles.overlayWrapper)}
      data-testid="dialog-wrapper"
    >
      {visible && (
        <div className={classNames(styles.wrapper)}>
          <div className={styles.contentWrapper}>
            <div className={'flex flex-1 flex-row'}>
              <div className={styles.iconWrapper}>
                <div className={styles.iconRound}>
                  {renderIcon(icon, 'h-6 w-6 text-white')}
                </div>
              </div>
              <div
                className={styles.textWrapper}
                data-testid="important-wrapper"
              >
                {title?.length > 0 && (
                  <div>
                    <div className={'w-9/12'}>
                      <Typography
                        type={'help'}
                        weight={'bold'}
                        text={title}
                        color={'white'}
                      />
                    </div>
                  </div>
                )}
                {message?.length > 0 && (
                  <div>
                    <div className={'w-10/12'}>
                      <Typography
                        type={'small'}
                        weight={'bold'}
                        text={message}
                        color={'white'}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.closeWrapper}>
                <div onClick={() => onClose && onClose()}>
                  {renderIcon('XIcon', 'h-6 w-6 text-white')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageModal;
