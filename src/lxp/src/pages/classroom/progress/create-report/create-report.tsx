import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import { ProgressCreateReportSkillsToWorkOnSummary } from './create-report-skills-to-work-on-summary';
import { useDialog } from '@ecdlink/core';

export type ProgressCreateReportState = {
  childId: string;
};

export const ProgressCreateReport: React.FC = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();

  const { state: routeState } = useLocation<ProgressCreateReportState>();

  const { childId } = routeState;
  const {
    child,
    currentObservationPeriod,
    currentReport,
    updateChildEnjoys,
    updateGoodProgressWith,
    updateHowCanCaregiverSupport,
    syncChildProgressReports,
    completeReport,
  } = useObserveProgressForChild(childId);

  const [currentStep, setCurrentStep] = useState<number>(1);

  const confirmCreateReport = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          icon="ExclamationCircleIcon"
          iconColor="alertMain"
          iconSize={12}
          importantText="Are you sure you want to create the report?"
          detailText="Once you create the report, you will not be able to edit it."
          actionButtons={[
            {
              text: 'Yes, create report',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                completeReport();
                syncChildProgressReports();
                history.push(ROUTES.PROGRESS_SHARE_REPORT, {
                  childId: routeState.childId,
                  reportId: currentReport?.id,
                });
                submit();
              },
              leadingIcon: 'DocumentReportIcon',
            },
            {
              text: 'No, edit report',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => {
                submit();
              },
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  }, [dialog]);

  const [howCanCaregiverSupport, setHowCanCaregiverSupport] = useState(
    currentReport?.howCanCaregiverSupport
  );
  const [goodProgressWith, setGoodProgressWith] = useState(
    currentReport?.goodProgressWith
  );
  const [childEnjoys, setChildEnjoys] = useState(currentReport?.childEnjoys);

  const save = () => {
    if (!!goodProgressWith) updateGoodProgressWith(goodProgressWith);
    if (!!childEnjoys) updateChildEnjoys(childEnjoys);
    if (!!howCanCaregiverSupport)
      updateHowCanCaregiverSupport(howCanCaregiverSupport);
  };

  const saveAndExit = () => {
    save();
    if (isOnline) {
      syncChildProgressReports();
    }
    history.replace(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
      childId: routeState.childId,
    });
  };

  return (
    <BannerWrapper
      size={'small'}
      title={`${child?.user?.firstName}'s report ${currentObservationPeriod?.reportNumber}`}
      subTitle={`Step ${currentStep} of 3`}
      onBack={() => {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        } else {
          history.goBack();
        }
      }}
      onClose={() => saveAndExit()}
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
            onChange={(event) => setChildEnjoys(event.target.value)}
            value={childEnjoys}
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
              onChange={(event) => setGoodProgressWith(event.target.value)}
              value={goodProgressWith}
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
            onChange={(event) => setHowCanCaregiverSupport(event.target.value)}
            value={howCanCaregiverSupport}
          />
        )}
        <Button
          onClick={() => {
            if (currentStep < 3) {
              setCurrentStep(currentStep + 1);
            } else {
              save();
              confirmCreateReport();
            }
          }}
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          text={currentStep < 3 ? 'Next' : 'Create caregiver report'}
          icon={currentStep < 3 ? 'ArrowCircleRightIcon' : 'DocumentReportIcon'}
          textColor="white"
          disabled={
            (currentStep === 1 && !childEnjoys) ||
            (currentStep === 2 && !goodProgressWith) ||
            (currentStep === 3 && !howCanCaregiverSupport)
          }
        />
        {currentStep === 3 && !!currentReport?.skillsToWorkOn.length && (
          <ProgressCreateReportSkillsToWorkOnSummary
            childFirstname={child?.user?.firstName || ''}
            skillsToWorkOn={currentReport?.skillsToWorkOn || []}
          />
        )}
        <Button
          onClick={() => saveAndExit()}
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
