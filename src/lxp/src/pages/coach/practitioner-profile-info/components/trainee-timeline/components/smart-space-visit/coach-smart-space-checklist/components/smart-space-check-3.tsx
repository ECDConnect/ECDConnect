import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  Card,
  CheckboxGroup,
  Colours,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import PositiveBonusEmoticon from '../../../../../../../../../assets/positive-bonus-emoticon.png';

interface SmartSpaceCheck1Props {
  practitioner: PractitionerDto;
  programmeName: string | undefined | null;
  setSectionQuestions: (value?: SectionQuestions[]) => void;
  handleNextSection: any;
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
}) => {
  const [answer, setAnswer] = useState('');
  const [enableButton, setEnableButton] = useState(false);
  const question =
    'Together with the SmartStarter, agree on what next steps can be taken and note them here:';
  const [questions, setAnswers] = useState([
    {
      question:
        'Together with the SmartStarter, agree on what next steps can be taken and note them here:',
      answer: false,
    },
  ]);

  const visitSection = `Discuss next steps`;

  const trueAnswers = useMemo(() => {
    const answers = questions?.filter((item) => item?.answer === true);
    return answers;
  }, [questions]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setAnswer(value);
      setSectionQuestions?.([
        { visitSection, questions: [{ answer, question }] },
      ]);

      if (value !== '') {
        setEnableButton?.(true);
      } else {
        setEnableButton?.(false);
      }
    },
    [answer, setEnableButton, setSectionQuestions]
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
        value={answer}
        onChange={onChange}
      />

      <div className="mt-2 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                handleNextSection();
              }}
              disabled={!enableButton}
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
