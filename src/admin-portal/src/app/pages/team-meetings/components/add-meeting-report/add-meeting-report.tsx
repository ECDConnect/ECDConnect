import {
  ActionModal,
  Dialog,
  DialogPosition,
  SearchDropDownOption,
} from '@ecdlink/ui';
import { Step1 } from './components/step1';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ClinicDto,
  HealthCareWorkerDto,
  NOTIFICATION,
  UserDto,
  useNotifications,
} from '@ecdlink/core';
import { Step3 } from './components/step3';
import { Step2 } from './components/step2';
import {
  AddClinicMeeting,
  AddClinicMeetingInputModelInput,
  GetHealthCareWorkersForClinicId,
} from '@ecdlink/graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { formatISO } from 'date-fns';
import { XIcon } from '@heroicons/react/solid';

export interface ClinicPanelCreateProps {
  closeDialog: (value: boolean) => void;
  isEdit?: boolean;
  clinics?: ClinicDto[];
  healthCareWorkersData?: HealthCareWorkerDto[];
  user?: UserDto;
  selectedTabId?: string;
}

export const AddTeamMeetingReport = (props: ClinicPanelCreateProps) => {
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);
  const { setNotification } = useNotifications();
  const [step, setStep] = useState(0);
  const [healthCareWorkers, setHealthCareWorkers] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [clinics, setClinics] = useState<SearchDropDownOption<string>[]>([]);
  const [clinic, setClinic] = useState('');
  const [optOutHcws, setOptOutHcws] = useState([]);
  const optOutIds = useMemo(
    () => optOutHcws?.map((item) => item?.id),
    [optOutHcws]
  );
  const [inFieldSupportVisits, setInFieldSupportVisits] = useState('');
  const [participantsInFields, setParticipantsInFields] = useState([]);
  const participantsInFieldIds = useMemo(
    () => participantsInFields?.map((item) => item?.id),
    [participantsInFields]
  );
  const [positiveStory, setPositiveStory] = useState('');
  const [reportissue, setReportIssue] = useState('');
  const todaysDate = useMemo(() => new Date(), []);
  const todaysDateFormatted = formatISO(todaysDate, { representation: 'date' });

  const [
    getHealthCareWorkersForClinic,
    { data: healtCareWorkersForClinicData, loading: loadingHCWs },
  ] = useLazyQuery(GetHealthCareWorkersForClinicId, {
    fetchPolicy: 'cache-and-network',
    variables: {
      clinicId: clinic,
    },
  });

  const [addRepotMeetingMutation] = useMutation(AddClinicMeeting);

  const healthCareWorkersForClinic =
    healtCareWorkersForClinicData?.healthCareWorkersForClinicId;

  useEffect(() => {
    if (clinic) {
      getHealthCareWorkersForClinic();
    }
  }, [getHealthCareWorkersForClinic, clinic]);

  useEffect(() => {
    if (healthCareWorkersForClinic?.length > 0) {
      const healthCareWorkersSorted = healthCareWorkersForClinic
        ?.slice()
        ?.sort((a, b) =>
          a?.user?.fullName < b?.user?.fullName
            ? -1
            : a?.user?.fullName > b?.user?.fullName
            ? 1
            : 0
        );

      setHealthCareWorkers(
        healthCareWorkersSorted?.map((item) => {
          return {
            value: item?.id,
            label: item?.user?.fullName,
            id: item?.id,
          };
        })
      );
    }
  }, [healthCareWorkersForClinic]);

  useEffect(() => {
    if (props?.clinics?.length > 0) {
      const clinicsSorted = props?.clinics
        ?.slice()
        ?.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

      setClinics(
        clinicsSorted?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
            id: item?.id,
          };
        })
      );
    }
  }, [props?.clinics]);

  const handleNextButton = useCallback(() => {
    if (step < 2) {
      setStep(step + 1);
    }
  }, [step]);

  useEffect(() => {
    if (clinic) {
      setFormIsDirty(true);
    }
  }, [clinic]);

  const handleSaveMeetingReport = useCallback(async () => {
    const inputModel: AddClinicMeetingInputModelInput = {
      clinicId: clinic,
      meetingDate: todaysDateFormatted,
      teamLeadUserId: props?.user?.id,
      positiveStory: positiveStory,
      reportingIssue: reportissue,
      totalSupportVisits: Number(inFieldSupportVisits),
      participantsOptedOutIds: optOutIds,
      participantsInFieldIds: participantsInFieldIds,
    };

    const response = await addRepotMeetingMutation({
      variables: {
        input: inputModel,
      },
    });

    if (response) {
      setNotification({
        title: `Meeting report added!`,
        variant: NOTIFICATION.SUCCESS,
      });
    }

    props.closeDialog(true);
  }, [
    addRepotMeetingMutation,
    clinic,
    inFieldSupportVisits,
    optOutIds,
    participantsInFieldIds,
    positiveStory,
    props,
    reportissue,
    setNotification,
    todaysDateFormatted,
  ]);

  const renderContent = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <Step1
            healthCareWorkers={healthCareWorkers}
            user={props?.user}
            setOptOutHcws={setOptOutHcws}
            optOutHcws={optOutHcws}
            clinics={clinics}
            handleNextButton={handleNextButton}
            setClinic={setClinic}
            clinic={clinic}
            loadingHCWs={loadingHCWs}
          />
        );
      case 1:
        return (
          <Step2
            healthCareWorkers={healthCareWorkers}
            handleNextButton={handleNextButton}
            setPositiveStory={setPositiveStory}
            positiveStory={positiveStory}
            setReportIssue={setReportIssue}
            reportissue={reportissue}
          />
        );
      case 2:
        return (
          <Step3
            healthCareWorkers={healthCareWorkers}
            handleSaveMeetingReport={handleSaveMeetingReport}
            setParticipantsInFields={setParticipantsInFields}
            participantsInFields={participantsInFields}
            setInFieldSupportVisits={setInFieldSupportVisits}
            inFieldSupportVisits={inFieldSupportVisits}
            loadingHCWs={loadingHCWs}
          />
        );
      default:
        return null;
    }
  }, [
    clinic,
    clinics,
    handleNextButton,
    handleSaveMeetingReport,
    healthCareWorkers,
    inFieldSupportVisits,
    optOutHcws,
    participantsInFields,
    positiveStory,
    props?.user,
    reportissue,
    step,
    loadingHCWs,
  ]);

  return (
    <div>
      {formIsDirty && (
        <div className="focus:outline-none focus:ring-primary absolute right-5 -top-20 z-10 mt-6 flex h-7 items-center rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2">
          <button
            className="focus:outline-none focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2"
            onClick={() => setDisplayFormIsDirty(true)}
          >
            <span className="sr-only">Close panel</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}
      {renderContent}
      <Dialog
        className="right-50 absolute w-6/12"
        stretch
        visible={displayFormIsDirty}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Discard unsaved changes?`}
          detailText={'If you leave now, you will lose all of your changes.'}
          buttonClass="rounded-2xl"
          actionButtons={[
            {
              text: 'Keep editing',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => setDisplayFormIsDirty(false),
              leadingIcon: 'XIcon',
            },
            {
              text: 'Discard changes',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: () => {
                props.closeDialog(true);
              },
              leadingIcon: 'TrashIcon',
            },
          ]}
        />
      </Dialog>
    </div>
  );
};
