import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  CheckboxChange,
  CheckboxGroup,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface CertificateStepProps {
  onNext?: () => void;
  setValue: UseFormSetValue<any>;
  onSubmit?: (data: {
    certificatesAdded: string[];
    eCaresStatus?: string;
  }) => void;
  initialCertificates?: string[];
  initialECaresStatus?: string;
}

const optionList = [
  { id: '1', title: 'Bronze' },
  { id: '2', title: 'Silver' },
  { id: '3', title: 'Gold' },
  { id: '4', title: 'None' },
];

const eCaresOptions = [
  { text: 'Yes', value: 'true' },
  { text: 'No', value: 'false' },
  { text: 'Not sure', value: 'unsure' },
];

export const CertificateStep: React.FC<CertificateStepProps> = ({
  onNext,
  setValue,
  onSubmit,
  initialCertificates = [],
  initialECaresStatus,
}) => {
  const [certificatesAdded, setCertificatesAdded] =
    useState<string[]>(initialCertificates);
  const [eCaresStatus, setECaresStatus] = useState<string | undefined>(
    initialECaresStatus
  );

  const noneSelected = certificatesAdded.includes('None');

  const handleNextAction = () => {
    setValue('certificates', certificatesAdded);
    setValue('eCaresStatus', noneSelected ? eCaresStatus : undefined);
    if (onNext) onNext();
    if (onSubmit)
      onSubmit({
        certificatesAdded,
        eCaresStatus: noneSelected ? eCaresStatus : undefined,
      });
  };

  const updateArray = (event: CheckboxChange, id: string) => {
    if (event.checked) {
      if (id === 'None') {
        setCertificatesAdded(['None']);
        return;
      }
      setCertificatesAdded([
        ...certificatesAdded.filter((item) => item !== 'None'),
        id,
      ]);
    } else {
      setCertificatesAdded(certificatesAdded.filter((item) => item !== id));
    }
  };

  const isNextDisabled =
    certificatesAdded.length === 0 ||
    (noneSelected && eCaresStatus === undefined);

  return (
    <div className="flex h-full w-full flex-col bg-white p-4">
      <Typography
        type={'h1'}
        text={`Certificate information`}
        className={'text-sm'}
        color={'textDark'}
      />
      <div className="flex flex-col gap-2 py-4">
        <Typography
          type="h4"
          className={'mt-3 mb-3 font-semibold'}
          color={'textDark'}
          text={
            onSubmit
              ? `Which certificates have you received?`
              : `Have you received any of these certificates?`
          }
        />
        {optionList.map((item) => (
          <CheckboxGroup
            checkboxColor="quatenary"
            id={item.id}
            key={item.id}
            title={item.title}
            checked={certificatesAdded.some((option) => option === item.title)}
            disabled={
              item.title === 'None'
                ? certificatesAdded.some((c) => c !== 'None')
                : certificatesAdded.includes('None')
            }
            value={item.title}
            titleWeight="normal"
            onChange={(event) => updateArray(event, item.title)}
          />
        ))}
      </div>

      {noneSelected && (
        <div className="mb-4">
          <Typography
            type="h4"
            className={'mb-3 font-semibold'}
            color={'textDark'}
            text={`Have you signed up for eCares?`}
          />
          <ButtonGroup<string>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={eCaresOptions}
            selectedOptions={eCaresStatus}
            onOptionSelected={(option: string | string[]) => {
              setECaresStatus(option as string);
            }}
            notSelectedColor="secondaryAccent2"
            textColor="secondary"
          />
        </div>
      )}

      <Button
        size="normal"
        className="mt-auto w-full"
        type="filled"
        color="quatenary"
        text={onSubmit ? 'Save' : 'Next'}
        textColor="white"
        icon="ArrowCircleRightIcon"
        onClick={handleNextAction}
        disabled={isNextDisabled}
      />
    </div>
  );
};
