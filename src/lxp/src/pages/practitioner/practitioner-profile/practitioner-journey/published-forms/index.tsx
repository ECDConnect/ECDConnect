import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  LoadingSpinner,
  StackedList,
  StackedListItemType,
  Typography,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  getJourneyTimelineAssessmentFormDataSelector,
  getJourneyTimelinePublishedFormsSelector,
} from '@/store/pqa/pqa.selectors';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import { useTenant } from '@/hooks/useTenant';
import {
  getJourneyAssessmentFormData,
  getJourneyPublishedAssessmentForms,
} from '@/store/pqa/pqa.actions';
import { CompletePublishedForm } from './published-form-complete';
import { useSnackbar } from '@ecdlink/core/lib/services/snackbar';
import { useDialog } from '@ecdlink/core';
import { classroomsSelectors } from '@/store/classroom';
import { ReactComponent as RobotIcon } from '@/assets/iconRobot.svg';
import { PublishedFormCertificate } from './published-form-certificate';

interface FormProps {
  onBack: () => void;
}

export const PublishedFormsList = ({ onBack }: FormProps) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const tenant = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const { showMessage } = useSnackbar();
  const dialog = useDialog();
  const classroom = useSelector(classroomsSelectors.getClassroom);

  // Published Forms
  const publishedForms = useSelector(getJourneyTimelinePublishedFormsSelector);

  // Fetch Published Forms
  useEffect(() => {
    const fetchPublishedForms = async () => {
      setIsLoading(true);
      try {
        await appDispatch(getJourneyPublishedAssessmentForms({})).unwrap();
      } catch (error) {
        console.error('Failed to fetch published forms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedForms();
  }, [appDispatch]); // only run once on mount

  const formItemlist: StackedListItemType[] = publishedForms
    ? publishedForms.map((formItem) => ({
        title: formItem?.name || '',
        subTitle: `${formItem?.name} created by ${formItem.provider}`,
        showIcon: false,
        onActionClick: () => handleFormItemClicked(Number(formItem?.id)),
        classNames: 'bg-uiBg',
      }))
    : [];

  // Form Data
  const [showAssessmentFormData, setShowAssessmentFormData] = useState(false);
  const assessmentFormData = useSelector(
    getJourneyTimelineAssessmentFormDataSelector
  );

  const handleFormItemClicked = (id: number) => {
    appDispatch(getJourneyAssessmentFormData({ id }));
    setShowAssessmentFormData(true);
  };

  const onFormComplete = (visitId: string) => {
    setShowAssessmentFormData(false);
    if (assessmentFormData.name === 'Health and safety check') {
      setCompletedVisitId(visitId);
      showCertificatePopup();
    } else {
      showMessage({
        message: `${
          assessmentFormData.name === 'Self-assessment'
            ? 'Self-assessment form'
            : 'Health and safety check'
        } completed!`,
      });
      onBack();
    }
  };

  const [completedVisitId, setCompletedVisitId] = useState('');
  const [showCertificateCheckForm, setShowCertificateCheckForm] =
    useState(false);
  const showCertificatePopup = () => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onSubmit) => {
        return (
          <ActionModal
            customIcon={<RobotIcon />}
            title={`Well done ${classroom?.principal?.firstName}, your certificate is ready for download!`}
            detailText={`You have completed the Health & Safety Check for ${classroom?.name}.`}
            actionButtons={[
              {
                text: 'Download certificate',
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  setShowAssessmentFormData(false);
                  setShowCertificateCheckForm(true);
                  onSubmit();
                },
                leadingIcon: 'DownloadIcon',
              },
              {
                colour: 'quatenary',
                text: 'Do this later',
                textColour: 'quatenary',
                type: 'outlined',
                leadingIcon: 'ClockIcon',
                onClick: () => {
                  onSubmit();
                },
              },
            ]}
            icon={'QuestionMarkCircleIcon'}
            iconClassName="w-96 h-96"
            className="bg-white"
            iconColor="infoMain"
          />
        );
      },
    });
  };

  if (showAssessmentFormData) {
    return (
      <CompletePublishedForm
        assessmentFormData={assessmentFormData}
        onBack={setShowAssessmentFormData}
        onFormComplete={onFormComplete}
      />
    );
  }

  if (showCertificateCheckForm) {
    return (
      <PublishedFormCertificate
        completedVisitId={completedVisitId}
        onBack={() => {
          setShowCertificateCheckForm(false);
          onBack();
        }}
      />
    );
  }
  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={onBack}
      onClose={onBack}
      title="Fill in a form"
      displayOffline={!isOnline}
    >
      <div className="w-12/12 ml-4 mr-4 mt-5">
        {isLoading ? (
          <LoadingSpinner
            size="medium"
            spinnerColor="primary"
            backgroundColor="uiLight"
            className="tex pt-4"
          />
        ) : publishedForms?.length > 0 ? (
          <>
            <Typography
              className="mt-3 mb-4"
              color="textDark"
              type={'h3'}
              text="Which form would you like to fill?"
            />
            <StackedList
              listItems={formItemlist}
              className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
              type="MenuList"
            />
          </>
        ) : (
          <>
            <Typography
              className="mt-3 mb-4"
              color="textDark"
              type={'h3'}
              text="No forms available yet"
            />
            <div className="grid grid-cols-1 justify-center gap-8">
              <div className="flex justify-center">
                <img src={AlienImage} alt="alien" />
              </div>
              <div className="flex justify-center">
                <div className="flex w-8/12 justify-center">
                  <Typography
                    color="textDark"
                    type={'h3'}
                    text={`There are no forms availabe on ${tenant?.tenant?.applicationName}`}
                    className={'text-center'}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </BannerWrapper>
  );
};
