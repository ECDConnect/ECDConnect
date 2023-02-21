import {
  Button,
  Dialog,
  DialogPosition,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import roadToHealth from '../../../../assets/roadToHealth.png';

export const MaternalRecordExample = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => (
  <Dialog
    visible={isVisible}
    position={DialogPosition.Middle}
    fullScreen
    className="m-4 overflow-auto rounded-2xl"
  >
    <div className="flex h-full flex-col items-center overflow-auto px-4 pt-7 pb-6">
      <div>
        {renderIcon('InformationCircleIcon', 'h-12 w-12 text-infoMain')}
      </div>

      <Typography
        type="h2"
        align="center"
        weight="bold"
        color={'textDark'}
        text={'Page ii of the Road to Health Book'}
        className="pt-4"
      />
      <img
        src={roadToHealth}
        alt="maternal record"
        className="h-9/12 w-7/12 py-4"
      />
      <Typography
        type="body"
        align="center"
        color={'textMid'}
        text={
          "Page ii is the first page you should see when opening the book. It should have the child's basic details."
        }
      />
      <Typography
        type="body"
        align="center"
        color={'textMid'}
        weight={'bold'}
        lineHeight={'none'}
        text={`OR page 4 of the old Road to \n Health Book.`}
        className="py-6"
      />
      <Typography
        type="body"
        align="center"
        color={'textMid'}
        text={
          'If your client has an old version of the book, you can see the personal details on page 4.'
        }
      />
      <div className={'mt-4 flex h-full w-full items-end'}>
        <Button
          type={'filled'}
          color={'primary'}
          className={'w-full'}
          textColor={'white'}
          text={`Close`}
          icon={'XIcon'}
          iconPosition={'start'}
          onClick={onClose}
        />
      </div>
    </div>
  </Dialog>
);
