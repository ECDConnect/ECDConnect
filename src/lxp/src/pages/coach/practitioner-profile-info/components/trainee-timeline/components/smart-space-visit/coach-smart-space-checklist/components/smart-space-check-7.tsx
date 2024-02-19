import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import covid_guidelines from '@/assets/CC14_COVID19_Reopening_Support_&_Verification_Visit.pdf';
import { coachSelectors } from '@/store/coach';
import { authSelectors } from '@/store/auth';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';

interface SmartSpaceCheck1Props {
  coachSmartSpaceVisitId: string;
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

export const SmartSpaceCheck7: React.FC<SmartSpaceCheck1Props> = ({
  coachSmartSpaceVisitId,
  practitioner,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const visitSection = 'COVID safety checklist (CC14)';

  const visitData = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionAnswers(
      coachSmartSpaceVisitId,
      visitSection
    )
  );
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(authSelectors.getAuthUser);
  const isCoach = coach?.user?.id === user?.id;
  const [questions, setAnswers] = useState<SmartSpaceVisitData[]>([
    {
      visitSection,
      question:
        'A DSD self-assessment form was done for opening. If no, please provide a copy for completion.',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'The programme has 1 metre squared space per child to allow physical distancing.',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'The physical space where the early childhood development programme operates has been thoroughly cleaned and disinfected in line with the requirements of COVID-19.',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'Daily cleaning and sanitising of the programme is set up including daily cleaning of teaching and learning support materials, equipment and apparatus when open. (see paragraph 8.7.1 and 8.7.2 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'Information posters are displayed – How to stop the spread, how to watch for symptoms, children’s key behaviours and screening and queuing poster.',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'If the programme is run as part of a private home or any other space that is shared it is confirmed that it will be implemented in a dedicated space where other persons (including adults and children) cannot access, walk through or sit in for the full duration of the programme).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'The drop-off and pick-up poster us up and process for this communicated (see paragraph 8.3 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'All staff members have received an orientation and have been made aware of the provisions contained in the documents indicated above in section 4.1. (see paragraph 8.2.1 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'All staff members received a proper orientation all measures and COVID safety procedures as well as to the adaptations or changes to the daily routines to accommodate the minimum health, safety and social distancing measures on COVID19. (see paragraphs 8.4, 8.5, 8.6 and 8.2.1 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'At the entrance, there is a safe space to wash hands with soap and clean water or sanitize hands (see paragraph 8.3 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'Daily screening questions are written or printed out and ready to be used and space for screening station identified/ set up (see paragraph 8.3 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'A standard letter/communication to parents explaining COVID safety has been sent (see paragraph 8.2.3 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'If the programme has more than one group/class, there is a schedule in place for outdoor play time to ensure that different groups/classes do not mix (see paragraph 8.4 and 8.9 of DSD SOP.).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'The programme area is laid out or adapted to enable children and adults to keep a distance of at least 1 meter, where appropriate (paragraph 8.4 and 8.9 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: `There is natural ventilation (windows or doors that can open) where this early
        childhood development programme or partial care facility (see paragraph 8.1 and 8.2.2 of DSD SOP).`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'There is a sufficient supply of clean water for drinking and handwashing or measures are in place and confirmed to ensure that there is sufficient supply (see paragraph 8.1 of DSD SOP.).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'There is a tap, a tippy-tap, a water dispenser or similar for handwashing under clean running water with measures that allow for physical distancing as appropriate (see paragraph 8.1 and 8.2 of DSD SOP.).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'Every staff member has at least 2 washable cloth face masks. (paragraph 8.5).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        ' There are additional clean face masks (about 1 for every 10 children) that can be used in the case where a child becomes sick with COVID-19 symptoms (see paragraph 8.5 and 8.11 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'The programme area is laid out or adapted to enable children and adults to keep a distance of at least 1 meter, where appropriate (paragraph 8.4 and 8.9 of DSD SOP..).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: `There is natural ventilation (windows or doors that can open) where this early
        childhood development programme or partial care facility (see paragraph 8.1 and 8.2.2 of DSD SOP..).`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'There is a sufficient supply of clean water for drinking and handwashing or measures are in place and confirmed to ensure that there is sufficient supply (see paragraph 8.1 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question: `There is a tap, a tippy-tap, a water dispenser or similar for handwashing under clean running water with measures that allow for physical distancing as appropriate (see
          paragraph 8.1 and 8.2 of DSD SOP).`,
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'Every staff member has at least 2 washable cloth face masks (paragraph 8.5 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'There are additional clean face masks (about 1 for every 10 children) that can be used in the case where a child becomes sick with COVID-19 symptoms (see paragraph 8.5 and 8.11 of DSD SOP).',
      questionAnswer: 'false',
    },

    {
      visitSection,
      question:
        'There is a sufficient supply of clean tissues or toilet paper (in separate pieces) for wiping children’s noses (see paragraph 8.2 and 8.6 of DSD SOP for more).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'Hand sanitizer and cleaning materials are stored out of reach of children at all times and labelled (see paragraph 8.8.5 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'There is a sufficient supply of soap, hand sanitizers, cleaning agents that kills germs, such as bleach or disinfectant, cloths/cleaning brushes. (paragraph 8.8.5 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'There is a basic first aid kit, which includes rubber gloves (see paragraph 8.11.4 of DSD SOP).',
      questionAnswer: 'false',
    },
    {
      visitSection,
      question:
        'Plans for basic hygiene practises, including the changing of nappies, use of potties, disposal of the aforementioned, amongst others are in place (see paragraph 8.6.3 of DSD SOP).',
      questionAnswer: 'false',
    },
  ]);

  const allTrueAnswers = useMemo(() => {
    const allAnswersFilled = questions?.every(
      (item) => item.questionAnswer === 'true'
    );
    return allAnswersFilled;
  }, [questions]);

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

  const onDownloadCovidGuidelines = () => {
    const pdfUrl = covid_guidelines;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'covid_guidelines.pdf');
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    if (!!visitData && !!visitData.length) {
      setAnswers(visitData);
    }
  }, []);

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={`${practitioner?.user?.firstName}'s - SmartSpace check`}
        color={'textDark'}
        className={'my-3'}
      />
      <Typography
        type={'h4'}
        text={
          'Read the guidelines (CC13) before filling in this form. If you have not read the guidelines, please download them now.'
        }
        color={'textMid'}
        className={'my-3'}
      />
      <div className="mt-2 space-y-4">
        <div>
          <div>
            <Button
              type="outlined"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => onDownloadCovidGuidelines()}
            >
              {renderIcon('DownloadIcon', 'mr-2 text-primary w-5')}
              <Typography
                type={'help'}
                text={'Download the COVID guidelines'}
                color={'primary'}
              />
            </Button>
          </div>
        </div>
      </div>
      <Divider dividerType="dashed" className={'my-4'} />
      {!isCoach && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}

      <Typography
        type={'h4'}
        text={`Please go through the checklist below.`}
        color={'textDark'}
        className={'my-3'}
      />

      {questions.map((item, index) => (
        <CheckboxGroup
          id={item.question}
          key={item.question}
          title={''}
          description={item.question}
          checked={questions?.some(
            (option) =>
              option.question === item.question &&
              option?.questionAnswer === 'true'
          )}
          value={item.question}
          onChange={() =>
            onOptionSelected(
              item.questionAnswer === 'true' ? 'false' : 'true',
              index
            )
          }
          className="mb-1"
          disabled={!isCoach}
        />
      ))}

      {!allTrueAnswers && (
        <Alert
          className="my-4"
          type="info"
          title="Not all COVID safety requirements have been met. Please discuss the franchisee’s plans to address these."
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
                saveSmartSpaceCheckData(questions, visitSection);
                handleNextSection();
              }}
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
