import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  Alert,
  BannerWrapper,
  Button,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { traineeSelectors } from '@/store/trainee';
import { differenceInMonths, format } from 'date-fns';

export const StartupSupportEnding = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { practitionerId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const practitionerFirstName = practitioner?.user?.firstName;
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const currentDate = new Date();
  const startUpSupportEndDate = new Date(timeline?.startUpSupportEndDate);
  const monthDifference = differenceInMonths(
    startUpSupportEndDate,
    currentDate
  );

  const callForHelp = () => {
    window.open('tel:' + practitioner?.user?.phoneNumber);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${practitioner?.user?.phoneNumber}`);
  };

  return (
    <>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="Not submitted"
        onBack={() => history.goBack()}
        className="p-4"
      >
        <div className="mt-4 flex justify-center">
          <div className="w-11/12">
            <div className="flex items-center gap-2">
              <span
                className={`text-l p-3 font-semibold text-white bg-${'alertMain'} rounded-full`}
              >
                {' '}
                &nbsp;{monthDifference}&nbsp;
              </span>
              <Typography
                type="h3"
                text={
                  ' Months until ' +
                  practitionerFirstName +
                  '’s start-up support ends.'
                }
              />
            </div>

            <div>
              <Typography
                className="mt-2 text-left"
                color="textDark"
                text={
                  practitionerFirstName +
                  '’s monthly start-up support of R ' +
                  timeline?.startUpSupportAmount?.toFixed(2) +
                  ' will be coming to and on '
                }
                type={'h3'}
              />
              <Typography
                className="mt-2 text-left"
                color="textDark"
                text={format(startUpSupportEndDate, 'dd LLLL yyyy') + '.'}
                type={'body'}
              />
            </div>

            <div className="mt-10">
              <Typography
                type="h4"
                weight="bold"
                lineHeight="snug"
                text={'Contact ' + practitionerFirstName}
              />
              <Typography
                type="h5"
                weight="bold"
                lineHeight="snug"
                color="secondary"
                text={`${
                  practitioner?.user?.phoneNumber == null
                    ? 'Number not available'
                    : practitioner?.user?.phoneNumber
                }`}
              />
              <Button
                color={'primary'}
                type={'outlined'}
                className={'mr-4 mt-2'}
                size={'small'}
                onClick={whatsapp}
              >
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className="text-primary mr-1 h-5 w-5"
                />
                <Typography
                  color={'primary'}
                  type={'small'}
                  weight="bold"
                  text={`WhatsApp client`}
                />
              </Button>
              <Button
                text="Call client"
                icon="PhoneIcon"
                type="outlined"
                size="small"
                color="primary"
                textColor="primary"
                iconPosition="start"
                onClick={callForHelp}
                className="mt-2"
              />
            </div>
            <div>
              <Alert
                type={'info'}
                className="items-left justify-left mt-4 flex"
                title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
              />
            </div>
            <div className="flex flex-col justify-center p-4">
              <Button
                shape="normal"
                color="primary"
                type="filled"
                icon="CheckCircleIcon"
                onClick={() => {
                  history.goBack();
                }}
                className="mt-6 rounded-2xl"
              >
                <Typography
                  type="help"
                  color="white"
                  text={`I have contacted ${practitionerFirstName}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
