import { AssessmentPageDto } from '@/models/journey/Journey.dto';
import {
  Alert,
  Divider,
  FormInput,
  Radio,
  CheckboxGroup,
  Typography,
} from '@ecdlink/ui';
import { Fragment } from 'react';

export type PublishedFormStepProps = {
  stepData: AssessmentPageDto;
  onStepChange: (updatedStep: AssessmentPageDto) => void;
};

export const PublishedFormStep: React.FC<PublishedFormStepProps> = ({
  stepData,
  onStepChange,
}) => {
  const questions = stepData.formQuestions || [];

  // 🔧 Utility to update a single question in the parent form
  const updateQuestion = (questionId: string, updates: Partial<any>) => {
    const updated = questions.map((q) =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    onStepChange({ ...stepData, formQuestions: updated });
  };

  // 🎯 Radio button change
  const handleRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionId: string
  ) => {
    const optionId = event.target.value;
    const question = questions.find((q) => q.id === questionId);
    const option = question?.formQuestionOptions?.find(
      (o) => o.id === optionId
    );

    updateQuestion(questionId, {
      answer: option?.name || '',
      answerId: option?.id || '',
    });
  };

  // ✏️ Text input change
  const handleTextChange = (value: string, questionId: string) => {
    updateQuestion(questionId, {
      answer: value,
      answerId: 'text',
    });
  };

  // 🔍 Helper for checking selected state
  const isChecked = (question: any, optionId: string): boolean => {
    const ids = question?.answerId
      ? question.answerId.split('|').map((id: string) => id.trim())
      : [];
    return ids.includes(optionId);
  };

  return (
    <div>
      <Typography className="mt-3 mb-4" type="h5" text={stepData?.name} />
      {stepData?.description && (
        <Alert type="info" title={stepData.description} className="mb-4" />
      )}
      <Divider dividerType="dashed" className="my-2" />

      {questions.map((question) => (
        <Fragment key={question.id}>
          <Typography type="h4" text={question.name} />
          <fieldset className="mt-3 mb-3 flex flex-col gap-2">
            {/* 🟦 Radio Buttons */}
            {question.answerType === 'radioButton' && (
              <div className="flex flex-col gap-1">
                {question.formQuestionOptions?.map((item) => (
                  <Radio
                    key={item.id}
                    name={`question-${question.id}`}
                    value={item.id}
                    description={item.name || ''}
                    checked={isChecked(question, item.id)}
                    onChange={(e) => handleRadioChange(e, question.id)}
                    variant="slim"
                  />
                ))}
              </div>
            )}

            {/* 🟩 Checkboxes */}
            {question.answerType === 'checkBox' && (
              <div className="flex flex-col gap-1">
                {question.formQuestionOptions?.map((item) => {
                  const isNone = item.name.toLowerCase().includes('none');

                  const currentIds = question.answerId
                    ? question.answerId
                        .split('|')
                        .map((id) => id.trim())
                        .filter(Boolean)
                    : [];

                  const noneOption = question.formQuestionOptions?.find((o) =>
                    o.name.toLowerCase().includes('none')
                  );
                  const noneSelected = currentIds.includes(
                    noneOption?.id || ''
                  );

                  return (
                    <CheckboxGroup
                      key={item.id}
                      id={item.id}
                      title={item.name}
                      value={item.id}
                      checkboxColor="primary"
                      checked={currentIds.includes(item.id)}
                      disabled={
                        // ✅ Disable only non-"None" options when "None" is selected
                        !isNone && noneSelected
                      }
                      onChange={() => {
                        const currentAnswers = question.answer
                          ? question.answer
                              .split('|')
                              .map((a) => a.trim())
                              .filter(Boolean)
                          : [];

                        const isSelected = currentIds.includes(item.id);

                        let newIds: string[] = [];
                        let newAnswers: string[] = [];

                        if (isSelected) {
                          // ✅ Unselect
                          newIds = currentIds.filter((id) => id !== item.id);
                          newAnswers = currentAnswers.filter(
                            (a) => a !== item.name
                          );
                        } else if (isNone) {
                          // ✅ Selecting "None" clears all others
                          newIds = [item.id];
                          newAnswers = [item.name];
                        } else {
                          // ✅ Selecting a normal option
                          newIds = [...currentIds, item.id];
                          newAnswers = [...currentAnswers, item.name];

                          // If "None" was selected, remove it
                          if (noneOption) {
                            newIds = newIds.filter(
                              (id) => id !== noneOption.id
                            );
                            newAnswers = newAnswers.filter(
                              (a) => a !== noneOption.name
                            );
                          }
                        }

                        updateQuestion(question.id, {
                          answerId: newIds.join('|'),
                          answer: newAnswers.join('|'),
                        });
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* ✏️ Text Input */}
            {question.answerType === 'text' && (
              <FormInput
                textInputType="textarea"
                placeholder={question.description || ''}
                value={question.answer || ''}
                className="mt-2"
                onChange={(e) => handleTextChange(e.target.value, question.id)}
              />
            )}
          </fieldset>
        </Fragment>
      ))}
    </div>
  );
};
