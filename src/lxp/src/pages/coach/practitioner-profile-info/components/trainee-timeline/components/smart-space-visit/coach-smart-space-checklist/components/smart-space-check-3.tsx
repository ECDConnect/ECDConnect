import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  Card,
  Colours,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';

interface SmartSpaceCheck1Props {
  practitioner: PractitionerDto;
  programmeName: string | undefined | null;
  setSectionQuestions: (value?: SectionQuestions[]) => void;
  handleNextSection: any;
  saveSmartSpaceCheckData: () => void;
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

export const SmartSpaceCheck3: React.FC<SmartSpaceCheck1Props> = ({
  practitioner,
  programmeName,
  setSectionQuestions,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const [enableButton, setEnableButton] = useState(false);
  const visitData = useSelector(traineeSelectors.getCoachSmartSpaceVisitData);
  const visitData1and2Completed = useSelector(
    traineeSelectors.getCoachSmartSpaceVisitDataCount
  );
  const coachSmartSpaceVisitDataNotAttendedStandards = useSelector(
    traineeSelectors.getCoachSmartSpaceVisitDataNotAttendedStandards
  );
  const coachSmartSpaceVisitDataNotAttendedStandardsFormatted =
    coachSmartSpaceVisitDataNotAttendedStandards?.length! > 0
      ? coachSmartSpaceVisitDataNotAttendedStandards?.map((item: any) => {
          return item?.question;
        })
      : [];
  const question =
    'Together with the SmartStarter, agree on what next steps can be taken and note them here:';
  const [questions, setAnswers] = useState([
    {
      question:
        'Together with the SmartStarter, agree on what next steps can be taken and note them here:',
      answer: '',
    },
  ]);

  const visitSection = `Discuss next steps`;

  useEffect(() => {
    const previousData = questions.map((item) => {
      const visitDataWithoutTypo = visitData as any;
      const previousAnswer = visitDataWithoutTypo
        ?.find((item: any) => {
          const sectionData = item?.visitSection === visitSection;
          return sectionData;
        })
        ?.questions.filter((obj: any) => {
          return obj.question === item.question;
        });

      const previousHasTrueAnswer = previousAnswer?.find(
        (item: any) =>
          item?.answer !== '' || Boolean(item?.answer) !== undefined
      );

      if (previousAnswer) {
        setEnableButton(true);
        return {
          ...item,
          answer: previousHasTrueAnswer?.answer,
        };
      }
      return item;
    });

    setSectionQuestions?.([
      {
        visitSection,
        questions: previousData,
      },
    ]);

    setAnswers(previousData);
  }, []);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setSectionQuestions?.([
        { visitSection, questions: [{ answer: value, question }] },
      ]);

      if (value !== '') {
        setEnableButton?.(true);
      } else {
        setEnableButton?.(false);
      }
    },
    [setSectionQuestions, visitSection]
  );

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />
      <Divider dividerType="dashed" className={'my-4'} />

      {Number(visitData1and2Completed) < 22 && (
        <Alert
          className={'mt-5 mb-3'}
          title={`You cannot issue ${practitioner?.user?.firstName}'s SmartSpace Licence.`}
          list={coachSmartSpaceVisitDataNotAttendedStandardsFormatted}
          type={'warning'}
        />
      )}

      <Card className="bg-uiBg rounded-2xl p-4">
        <Typography
          type={'body'}
          weight="bold"
          text={`${practitioner?.user?.firstName}'s venue meets all the basic SmartSpace standards. They are working towards these additional standards:`}
          color={'textDark'}
          className={'my-3'}
        />
        <Typography
          type={'body'}
          text={`• The outside area is clean, with no litter or animal faeces.
            • There is a list of emergency numbers visible on the wall.`}
          color={'textMid'}
          className={'my-3'}
        />
      </Card>

      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={question}
        placeholder={'e.g. create a list of emergency numbers'}
        value={questions[0].answer}
        onChange={onChange}
      />

      {Number(visitData1and2Completed) < 22 && (
        <Alert
          className={'mt-5 mb-3'}
          title={`You cannot issue ${practitioner?.user?.firstName}'s SmartSpace Licence.`}
          list={[
            `Discuss ways that ${practitioner?.user?.firstName} can prepare for the next SmartSpace visit.`,
            `Schedule a follow-up visit with Nothando.`,
          ]}
          type={'error'}
        />
      )}

      <div className="mt-2 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                handleNextSection();
                saveSmartSpaceCheckData();
              }}
              disabled={!enableButton || Number(visitData1and2Completed) < 22}
            >
              {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
              <Typography type={'help'} text={'Next'} color={'white'} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
