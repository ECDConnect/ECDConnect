import {
  Alert,
  BannerWrapper,
  Button,
  Divider,
  IconTitleDescriptionTile,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import ChildDevelopmentLevelsList from '../child-development-levels-list/child-development-levels-list';
import * as styles from './progress-tracking-tutorial.styles';
import { ProgressTrackingTutorialProps } from './progress-tracking-tutorial.types';

export const ProgressTrackingTutorial = ({
  onComplete,
  onClose,
}: ProgressTrackingTutorialProps) => {
  const { isOnline } = useOnlineStatus();
  return (
    <BannerWrapper
      size={'small'}
      showBackground={false}
      color={'primary'}
      onBack={onClose}
      title={'Tracking progress'}
      className={styles.bannerContentWrapper}
      displayOffline={!isOnline}
    >
      <div className={styles.wrapper}>
        <div className={'p-4'}>
          <Typography
            color={'textDark'}
            type={'body'}
            weight={'bold'}
            text={'When should you track each child’s progress?'}
          />
          <ul className={styles.listItems}>
            <li className={styles.spaceTop}>
              <Typography
                color={'textDark'}
                type={'body'}
                text={
                  'Start tracking progress within a month of the child joining in each of the four development areas (Social & emotional, Language & pre-literacy, Cognitive, and Physical)'
                }
              />
            </li>
            <li className={styles.spaceTop}>
              <Typography
                color={'textDark'}
                type={'body'}
                text={
                  'Continue to observe children and track progress throughout the year'
                }
              />
            </li>
            <li>
              <Typography
                className={styles.spaceTop}
                color={'textDark'}
                type={'body'}
                text={
                  'Each child is unique and may learn things in different orders and at different speeds'
                }
              />
            </li>
          </ul>
          <Typography
            color={'textDark'}
            className={styles.spaceTop}
            type={'body'}
            weight={'bold'}
            text={'When should you send reports to caregivers?'}
          />
          <Typography
            color={'textDark'}
            className={styles.spaceTop}
            type={'body'}
            text={
              'Create reports and send them to caregivers every June and November'
            }
          />
        </div>
        {/* <div className={'bg-infoMain flex flex-row items-center py-4 px-4'}>
          <div className={'mr-4 flex items-center'}>
            <div className={classNames('rounded-full p-2', `bg-infoDark`)}>
              {renderIcon('GiftIcon', `w-5 h-5 text-white`)}
            </div>
          </div>
          <div>
            <Typography
              color={'white'}
              type={'help'}
              weight={'normal'}
              hasMarkup={true}
              text={'Earn <b>100</b> SmartStart points per child per report'}
            />
            <Typography
              color={'white'}
              type={'help'}
              weight={'normal'}
              text={'Get R5 airtime for every 500 points you earn!'}
            />
          </div>
        </div> */}
        <div className={'bg-uiBg p-4'}>
          <Typography
            color={'textDark'}
            type={'body'}
            weight={'bold'}
            text={'What should you do?'}
          />
          <IconTitleDescriptionTile
            title={'1. Watch & listen'}
            subTitle={'Watch children often as they play and interact.'}
            icon={'EyeIcon'}
            iconBorderColour="primary"
          />
          <IconTitleDescriptionTile
            title={'2. Take notes'}
            subTitle={'Notice what they do easily and where they struggle.'}
            icon={'PencilIcon'}
            iconBorderColour="primary"
          />
          <IconTitleDescriptionTile
            title={'3. Complete progress form'}
            subTitle={
              'Think about activties that will stretch and extend learning.'
            }
            icon={'LightBulbIcon'}
            iconBorderColour="primary"
          />
          <IconTitleDescriptionTile
            title={'4. Think & do'}
            subTitle={
              'Think about activties that will stretch and extend learning. Prepare a Child Progress Report and talk through the report with caregivers. Together, think about activities that will help to develop the child.'
            }
            icon={'PresentationChartLineIcon'}
            iconBorderColour="primary"
          />
        </div>
        <div className="p-4">
          <Typography
            color={'textDark'}
            className={styles.spaceTop}
            type={'body'}
            weight={'bold'}
            text={'What do the stages mean?'}
          />
          <ChildDevelopmentLevelsList />
          <Alert
            className={'mt-2'}
            title={'Every child is unique!'}
            message={
              'That means that they may learn things in a different order and at different speeds.'
            }
            type={'info'}
          />
          <div className={'mt-4'}>
            <Divider />
          </div>
          <Button
            color={'primary'}
            type={'filled'}
            disabled={false}
            onClick={onComplete}
            className={styles.closeButton}
          >
            {renderIcon(
              'ArrowCircleRightIcon',
              classNames('h-5 w-5 mr-2 text-white')
            )}
            <Typography
              color={'white'}
              type={'help'}
              weight={'normal'}
              text={'Start tracking'}
            />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default ProgressTrackingTutorial;
