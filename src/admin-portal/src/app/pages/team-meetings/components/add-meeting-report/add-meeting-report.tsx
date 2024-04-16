import { SearchDropDownOption } from '@ecdlink/ui';
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

export interface ClinicPanelCreateProps {
  closeDialog: (value: boolean) => void;
  isEdit?: boolean;
  clinics?: ClinicDto[];
  healthCareWorkersData?: HealthCareWorkerDto[];
  user?: UserDto;
  selectedTabId?: string;
}

export const AddTeamMeetingReport = (props: ClinicPanelCreateProps) => {
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
      clinicId: props?.selectedTabId,
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

  const handleSaveMeetingReport = useCallback(async () => {
    const inputModel: AddClinicMeetingInputModelInput = {
      clinicId: props?.selectedTabId,
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

  return <div>{renderContent}</div>;
};
