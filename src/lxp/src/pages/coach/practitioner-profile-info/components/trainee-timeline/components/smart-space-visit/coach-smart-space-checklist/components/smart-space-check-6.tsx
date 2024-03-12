import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Colours,
  Dialog,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { traineeSelectors } from '@/store/trainee';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { TraineeService } from '@/services/TraineeService';
import { TraineeAddressModelInput, VisitData } from '@ecdlink/graphql';
import { Step6Map } from './map/map';
import { coachSelectors } from '@/store/coach';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';

interface SmartSpaceCheck1Props {
  coachSmartSpaceVisitId: string;
  traineeChecklistVisitId: string;
  practitioner: PractitionerDto;
  saveSmartSpaceCheckData: (
    value: SmartSpaceVisitData[],
    visitSection: string
  ) => void;
  handleNextSection: () => void;
}

export const getGroupColor = (count: number): Colours => {
  if (count === 0) {
    return 'errorMain';
  }

  if (count < 17) {
    return 'alertMain';
  }

  return 'successMain';
};

const options = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const SmartSpaceCheck6: React.FC<SmartSpaceCheck1Props> = ({
  coachSmartSpaceVisitId,
  traineeChecklistVisitId,
  practitioner,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitSection = `Property details`;

  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [newAddress, setNewAddress] = useState('');
  const [enableButton, setEnableButton] = useState(false);
  const traineeProgrammeType = useSelector(
    traineeSelectors.getTraineeSmartSpaceAddress(traineeChecklistVisitId)
  );
  const visitData = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionAnswers(
      coachSmartSpaceVisitId,
      visitSection
    )
  );
  const traineeChecklistVisitData = useSelector(
    traineeSelectors.getTraineeVisitData(traineeChecklistVisitId)
  );
  const [showMap, setShowMap] = useState(false);
  const coach = useSelector(coachSelectors.getCoach);
  const isCoach = coach?.user?.id === userAuth?.id;

  const [questions, setAnswers] = useState<SmartSpaceVisitData[]>([
    {
      visitSection,
      question: 'Is this address correct?',
      questionAnswer: '',
    },
    {
      visitSection,
      question: `I have checked that ${practitioner?.user?.firstName} has the required forms proving ownership/lease agreement/permission to use premises.`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: 'Where is the programme site located?',
      questionAnswer: '',
    },
  ]);

  const programmeDetailsSections = traineeChecklistVisitData
    ?.filter((item) => item?.visitSection === 'Programme details')
    ?.filter(
      (item) =>
        item?.question ===
          'Do you own the property where you will run your SmartStart programme?' ||
        item?.question === 'Do you have the Title Deeds for the property?' ||
        item?.question === 'Do you live at the property?' ||
        item?.question === 'Is the property on un-proclaimed land?'
    );

  const propertyOwnAnswer = useMemo(() => {
    const ownTheProperty =
      programmeDetailsSections?.find(
        (item) =>
          item?.question ===
          'Do you own the property where you will run your SmartStart programme?'
      )?.questionAnswer === 'true';
    const hasTheTitleDeeds =
      programmeDetailsSections?.find(
        (item) =>
          item?.question === 'Do you have the Title Deeds for the property?'
      )?.questionAnswer === 'true';
    const isUnproclaimedLand =
      programmeDetailsSections?.find(
        (item) => item?.question === 'Is the property on un-proclaimed land?'
      )?.questionAnswer === 'true';
    const livesAtTheProperty =
      programmeDetailsSections?.find(
        (item) => item?.question === 'Do you live at the property?'
      )?.questionAnswer === 'true';
    if (ownTheProperty && hasTheTitleDeeds) {
      return `${practitioner?.user?.firstName} owns the property and has the title deeds.`;
    }

    if (ownTheProperty && isUnproclaimedLand) {
      return `${practitioner?.user?.firstName} owns the property and the property is on un-proclaimed land.`;
    }

    if (!ownTheProperty && !livesAtTheProperty) {
      return `${practitioner?.user?.firstName} does not own the property and does not live at the property.`;
    }

    return `${practitioner?.user?.firstName} does not own the property and lives at the property.`;
  }, [practitioner?.user?.firstName, programmeDetailsSections]);

  const onOptionSelected = useCallback(
    (value: string, index: number) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            questionAnswer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
    },
    [questions]
  );

  useEffect(() => {
    if (!!visitData && !!visitData.length) {
      setAnswers(visitData);
    }
  }, []);

  useEffect(() => {
    if (
      (questions[0].questionAnswer === 'true' &&
        questions[1].questionAnswer === 'true') ||
      questions[1].questionAnswer === 'true' ||
      (newAddress !== '' && questions[1].questionAnswer === 'true')
    ) {
      return setEnableButton(true);
    }
    setEnableButton(false);
  }, [newAddress, questions]);

  const changeSmartSpaceCheckAddress = async () => {
    if (questions[0].questionAnswer === 'false' && newAddress !== '') {
      const input = {
        homeAddressLine1: newAddress,
        homeAddressLine2: '',
        homeAddressLine3: '',
        homeAddressPostalCode: '',
      };
      const changeAddress: TraineeAddressModelInput = await new TraineeService(
        userAuth?.auth_token!
      ).UpdateTraineeAddress(practitioner?.userId!, input);
      setNewAddress(input?.homeAddressLine1);
      return changeAddress;
    } else {
      return isRejectedWithValue('no access token, profile check required');
    }
  };

  return (
    <div className={`p-4`}>
      <Typography
        type={'h2'}
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />
      <Typography
        type={'h4'}
        text={`Property address:`}
        color={'textDark'}
        className={'mt-3'}
      />
      <Typography
        type={'h4'}
        text={newAddress || (traineeProgrammeType as string)}
        color={'textDark'}
      />
      <Divider dividerType="dashed" className={'my-4'} />
      {!isCoach && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <div className={`${!isCoach && 'pointer-events-none opacity-50'}`}>
        <div>
          {' '}
          <Typography
            type="h4"
            text={questions[0].question}
            color="textDark"
            className="mb-2"
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={options}
            onOptionSelected={(value) =>
              onOptionSelected(!!value ? 'true' : 'false', 0)
            }
            selectedOptions={questions[0].questionAnswer === 'true'}
          />
        </div>
        {isOnline && questions[0].questionAnswer === 'false' && (
          <FormInput
            onClick={() => setShowMap(true)}
            className="mt-4"
            textInputType="input"
            label={questions?.[2]?.question}
            placeholder={'e.g. street a'}
            value={newAddress || questions[2]?.questionAnswer}
          />
        )}
        <Alert
          type={'info'}
          title={'You must be online to update the address.'}
          list={[
            'If you are offline, please select “Yes” above & explain how the trainee can update their address through Funda App.',
          ]}
          className="mt-4"
        />
        <Typography
          type={'h4'}
          text={`Please confirm ${practitioner?.user?.firstName}’s proof of ownership, lease or permission`}
          color={'textDark'}
          className={'my-3'}
        />
        <Typography
          type={'body'}
          text={
            propertyOwnAnswer
              ? (propertyOwnAnswer as string)
              : `${practitioner?.user?.firstName} owns the property and has the title deeds.`
          }
          color={'textMid'}
          className={'my-3'}
        />
        <div
          className="flex items-start gap-2"
          onClick={() =>
            onOptionSelected(
              questions[1].questionAnswer === 'true' ? 'false' : 'true',
              1
            )
          }
        >
          <Checkbox
            onCheckboxChange={(e) =>
              onOptionSelected(e.checked ? 'true' : 'false', 1)
            }
            checked={questions[1].questionAnswer === 'true'}
          />
          <Typography
            text={questions[1].question}
            type="body"
            color="textMid"
          />
        </div>
      </div>
      <div className="mt-2 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                saveSmartSpaceCheckData(questions, visitSection);
                handleNextSection();
                changeSmartSpaceCheckAddress();
              }}
              disabled={!enableButton && isCoach}
            >
              {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
              <Typography type={'help'} text={'Next'} color={'white'} />
            </Button>
          </div>
        </div>
      </div>
      <Dialog stretch={true} visible={showMap} position={DialogPosition.Full}>
        <Step6Map
          onClose={() => setShowMap(false)}
          onSubmit={(address) => {
            onOptionSelected(address, 2);
            setNewAddress(address);
          }}
        />
      </Dialog>
    </div>
  );
};
