import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { traineeSelectors } from '@/store/trainee';
import { WhatsappCall } from '../contact/whatsapp-call';

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

            <WhatsappCall />

            <div className="flex flex-col justify-center">
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
