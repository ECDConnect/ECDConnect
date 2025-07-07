import {
  Button,
  classNames,
  Colours,
  ComponentBaseProps,
  IconWrapper,
  Typography,
} from '@ecdlink/ui';
import { DateFormats } from '../../../constants/Dates';

interface MessageCardProps extends ComponentBaseProps {
  status: 'new' | 'viewed' | 'actioned';
  title: string;
  message: string;
  dateCreated: string;
  icon: string;
  iconBackgroundColor: Colours;
  actionText: string;

  onAction: () => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  status,
  title,
  message,
  dateCreated,
  icon,
  iconBackgroundColor,
  actionText,
  onAction,
  className,
}) => {
  const wrapperStyles =
    status === 'new'
      ? 'p-4 flex flex-row items-start bg-uiBg'
      : 'p-4 flex flex-row items-start bg-white';

  return (
    <div className={classNames(className, wrapperStyles)}>
      <div className="w-1/5">
        <IconWrapper
          icon={icon}
          iconBorderColor={iconBackgroundColor}
          iconColor={'white'}
        />
      </div>
      <div className="flex w-4/5 flex-col items-start">
        <div className="flex flex-row items-center">
          <Typography
            className="mr-2"
            type="unspecified"
            fontSize="12"
            color="textLight"
            weight="skinny"
            text={new Date(dateCreated).toLocaleString(
              'en-ZA',
              DateFormats.standardDate
            )}
          />
          {status === 'new' && (
            <div className={'bg-infoMain h-2 w-2 rounded-full p-1'}></div>
          )}
        </div>

        <Typography
          type="unspecified"
          fontSize="16"
          weight="bold"
          text={title}
        />

        <Typography
          type="unspecified"
          fontSize="14"
          weight="normal"
          text={message}
        />

        {actionText && (
          <Button
            className="mt-2"
            type="filled"
            size="small"
            textColor="white"
            text={actionText}
            onClick={onAction}
            color="primary"
          />
        )}
      </div>
    </div>
  );
};
