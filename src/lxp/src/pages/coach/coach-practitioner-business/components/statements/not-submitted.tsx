import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Alert, BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { traineeSelectors } from '@/store/trainee';

export const StatementNotSubmitted = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { practitionerId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const location = useLocation<PractitionerBusinessParams>();
  const incomeStatementMonth = location.state.incomeStatementMonth;
  const practitionerFirstName = practitioner?.user?.firstName;
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const hasStartUpSupport =
    timeline?.startUpSupportStartDate !== null &&
    timeline?.startUpSupportEndDate !== null;

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
            <div>
              <Typography
                className="mt-4 text-left"
                color="textDark"
                text={
                  practitionerFirstName +
                  ' has not submitted their ' +
                  incomeStatementMonth +
                  ' income statement yet.'
                }
                type={'h3'}
              />
            </div>

            <div>
              <Typography
                className="mt-2 text-left"
                color="textMid"
                text={
                  'Remind ' +
                  practitionerFirstName +
                  ' to submit income statements by the 7th of every month.'
                }
                type={'body'}
              />
            </div>

            {hasStartUpSupport && (
              <>
                <div>
                  <Typography
                    className="mt-2 text-left"
                    color="textMid"
                    text={
                      'To receive monthly start-up support,  ' +
                      practitionerFirstName +
                      ' needs to submit statements on a monthly basis.'
                    }
                    type={'body'}
                  />
                </div>
                <div>
                  <Typography
                    className="mt-2 text-left"
                    color="textMid"
                    text={
                      'By submitting statements on time, ' +
                      practitionerFirstName +
                      ' will earn 25 points!'
                    }
                    type={'body'}
                  />
                </div>
              </>
            )}

            <div>
              <Typography
                className="mt-2 text-left"
                color="textMid"
                text={
                  'Income statements are also valuable for reporting purposes.'
                }
                type={'body'}
              />
            </div>

            <div className="mt-14">
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
