import { SearchDropDownOption } from '@ecdlink/ui';
import { Step1 } from './components/step1';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClinicDto, HealthCareWorkerDto, UserDto } from '@ecdlink/core';
import { Step3 } from './components/step3';
import { Step2 } from './components/step2';

export interface ClinicPanelCreateProps {
  closeDialog: (value: boolean) => void;
  isEdit?: boolean;
  clinics?: ClinicDto[];
  healthCareWorkersData?: HealthCareWorkerDto[];
  user?: UserDto;
}

export const AddTeamMeetingReport = (props: ClinicPanelCreateProps) => {
  const [step, setStep] = useState(0);
  const [healthCareWorkers, setHealthCareWorkers] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [clinics, setClinics] = useState<SearchDropDownOption<string>[]>([]);
  const [clinic, setClinic] = useState('');
  const [optOutHcws, setOptOutHcws] = useState([]);

  const [inFieldSupportVisits, setInFieldSupportVisits] = useState('');
  const [participantsInFields, setParticipantsInFields] = useState([]);
  const [positiveStory, setPositiveStory] = useState('');
  const [reportissue, setReportIssue] = useState('');

  useEffect(() => {
    if (props?.healthCareWorkersData?.length > 0) {
      const healthCareWorkersSorted = props?.healthCareWorkersData
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
  }, [props?.healthCareWorkersData]);

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

  const handleSaveMeetingReport = useCallback(() => {
    console.log('Handle the add meeting report');
  }, []);

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
  ]);

  return <div>{renderContent}</div>;
};
