import {
  BannerWrapper,
  Button,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import { ProgressCreateReportSkillsToWorkOnSumamry } from './create-report-skills-to-work-on-summary';

export type ProgressCreateReportState = {
  childId: string;
};

export const ProgressCreateReport: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const { state: routeState } = useLocation<ProgressCreateReportState>();

  const { childId } = routeState;
  const {
    child,
    currentReportingPeriod,
    currentReport,
    updateChildEnjoys,
    updateGoodProgressWith,
    updateHowCanCaregiverSupport,
    syncChildProgressReports,
  } = useObserveProgressForChild(childId);

  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <BannerWrapper
      size={'small'}
      title={`${child?.user?.firstName}'s report ${currentReportingPeriod?.reportNumber}`}
      subTitle={`Step ${currentStep} of 3`}
      onBack={() =>
        history.replace(ROUTES.CHILD_PROFILE, { childId: routeState.childId })
      }
    >
      <div className={'flex h-full flex-col px-4 pb-4 pt-4'}>
        <Typography
          type="h2"
          color="textDark"
          text={'Share more detail for the caregiver report'}
        />
        {/* STEP 1 */}
        {currentStep === 1 && (
          <FormInput
            label={`${child?.user?.firstName} enjoys:`}
            textInputType="textarea"
            placeholder={
              'E.g. Playing with balls. Soccer is his favourite. He is active. He likes playing with other children.'
            }
            className="mt-6 mb-4"
            onChange={(event) => updateChildEnjoys(event.target.value)}
            value={currentReport?.childEnjoys}
          />
        )}
        {/* STEP 2 */}
        {currentStep === 2 && (
          <>
            <FormInput
              label={`${child?.user?.firstName} has made good progress with:`}
              textInputType="textarea"
              placeholder={
                'E.g. Sharing his emotions. He can talk about how he is feeling.'
              }
              className="mt-6 mb-4"
              onChange={(event) => updateGoodProgressWith(event.target.value)}
              value={currentReport?.goodProgressWith}
            />
            {!!currentReport?.notes && (
              <>
                <Divider dividerType="dashed" />
                <Typography
                  type="h4"
                  color="textDark"
                  text={'Your observations notes'}
                />
                <Typography
                  type="body"
                  color="textMid"
                  text={currentReport?.notes}
                />
              </>
            )}
          </>
        )}
        {/* STEP 3 */}
        {currentStep === 3 && (
          <FormInput
            label={`How can ${child?.user?.firstName}'s caregiver help ${child?.user?.firstName} to learn and grow?`}
            textInputType="textarea"
            placeholder={
              'E.g. Asking him how he is feeling every morning and asking him to name items in and around the house.'
            }
            className="mt-6 mb-4"
            onChange={(event) =>
              updateHowCanCaregiverSupport(event.target.value)
            }
            value={currentReport?.howCanCaregiverSupport}
          />
        )}
        <Button
          onClick={() => {
            if (currentStep < 3) {
              setCurrentStep(currentStep + 1);
            } else {
              //goto share report
            }
          }}
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          text={currentStep < 3 ? 'Next' : 'Create caregiver report'}
          icon={currentStep < 3 ? 'ArrowCircleRightIcon' : 'DocumentReportIcon'}
          textColor="white"
        />
        {currentStep === 3 && (
          <ProgressCreateReportSkillsToWorkOnSumamry
            childFirstname={child?.user?.firstName || ''}
            skillsToWorkOn={currentReport?.skillsToWorkOn || []}
          />
        )}
        <Button
          onClick={() => {
            if (isOnline) {
              syncChildProgressReports();
            }
            history.replace(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
              childId: routeState.childId,
            });
          }}
          className="mb-4 w-full"
          size="normal"
          color="quatenary"
          type="outlined"
          icon="XIcon"
          text="Save & exit"
          textColor="quatenary"
        />
      </div>
    </BannerWrapper>
  );
};
