import { CalendarEventParticipantModel } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  StackedList,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { mapCalendarEventParticipantModelToListDataItem } from '../../calendar.utils';
import { ListDataItem } from '../../calendar.types';

interface HomeVisitMultipleClientsPromptProps {
  clients: CalendarEventParticipantModel[];
  onCancel: () => void;
  onSelected: (id: string) => void;
  subTitle: string;
  title: string;
  visible: boolean;
}

export const HomeVisitMultipleClientsPrompt = (
  props: HomeVisitMultipleClientsPromptProps
) => {
  const items = props.clients.map((c) =>
    mapCalendarEventParticipantModelToListDataItem(c)
  );
  return (
    <Dialog visible={props.visible} position={DialogPosition.Full}>
      <BannerWrapper
        size={'small'}
        backgroundColour={'white'}
        renderBorder={true}
        title={props.title}
        color={'primary'}
        onBack={props.onCancel}
        onClose={props.onCancel}
      >
        <div className="flex justify-center">
          <div className="w-11/12">
            <div
              className={'mt-2 mb-2 text-center'}
              data-testid="important-wrapper"
            >
              <Typography
                type="unspecified"
                fontSize="18"
                hasMarkup
                text={'Which client visit do you want to start?'}
                className={'font-semibold leading-snug'}
                color="textDark"
              />
            </div>
            <StackedList
              className={'mt-4 flex flex-col gap-1 pb-2'}
              listItems={items}
              type={'UserAlertList'}
              onClickItem={(item: ListDataItem) => {
                props.onSelected(item.id || '');
              }}
            />
            <div>
              <Button
                onClick={props.onCancel}
                className="w-full"
                size="normal"
                color="primary"
                type="outlined"
              >
                {renderIcon('XIcon', classNames('h-5 w-5 text-primary'))}
                <Typography
                  type="h6"
                  className="ml-2"
                  text={'Cancel'}
                  color="primary"
                />
              </Button>
            </div>
          </div>
        </div>
      </BannerWrapper>
    </Dialog>
  );
};
