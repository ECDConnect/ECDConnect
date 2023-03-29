import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Button } from '@ecdlink/ui';
import { InfantDto, usePrevious } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import {
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
  VisitDataStatusFilterInput,
} from '@ecdlink/graphql';
import { visitActions, visitThunkActions } from '@/store/visit';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { useSelector } from 'react-redux';
import { getInfantVisitsSelector } from '@/store/infant/infant.selectors';
import { referralThunkActions } from '@/store/referral';
import { ReferralActions } from '@/store/referral/referral.actions';
import { RootState } from '@/store/types';
import { getCompletedVisitsByVisitIdSelector } from '@/store/visit/visit.selectors';

export interface Question {
  question: string;
  answer:
    | string
    | string[]
    | boolean
    | boolean[]
    | (string | number | undefined)[]
    | undefined;
}

export interface SectionQuestions {
  visitSection: string;
  questions: Question[];
}

export interface DynamicFormProps {
  name?: string;
  infant?: InfantDto;
  currentStep?: number;
  isTipPage?: boolean;
  steps?: any[]; // TODO: add type
  sectionQuestions?: SectionQuestions[];
  setIsTip?: (value: boolean) => void;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  setReferralsInput?: (value?: VisitDataStatusFilterInput[]) => void;
  setEnableButton?: (value: boolean) => void;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  onClose?: () => void;
}

export const DynamicForm = ({
  name,
  infant,
  currentStep,
  steps,
  isTipPage,
  setSectionQuestions: setSectionQuestionsForm,
  onNextStep,
  setIsTip,
  onClose,
}: DynamicFormProps) => {
  const [isEnableButton, setIsEnableButton] = useState(false);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [referralsInput, setReferralsInput] =
    useState<VisitDataStatusFilterInput[]>();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.ADD_VISIT_FORM_DATA
  );
  const { isLoading: isLoadingReferral } = useThunkFetchCall(
    'referrals',
    ReferralActions.UPDATE_VISIT_DATA_STATUS
  );

  const wasLoading = usePrevious(isLoading);
  const wasLoadingReferral = usePrevious(isLoadingReferral);

  const visits = useSelector(getInfantVisitsSelector);
  const MOCKED_VISIT_ID = visits[0]?.id;
  /* '454686a9-2142-4061-aa47-4e89d46110b9' */

  const completedVisits = useSelector((state: RootState) =>
    getCompletedVisitsByVisitIdSelector(state, MOCKED_VISIT_ID)
  )?.visits;

  const { successDialog } = useRequestResponseDialog();

  const appDispatch = useAppDispatch();

  const handleSetQuestions = useCallback(
    (value: SectionQuestions[]) => {
      setSectionQuestions((prevSections) => {
        const updatedQuestions = value.flatMap((newObj) => {
          const { visitSection: newVisitSection, questions: newQuestions } =
            newObj;
          const oldSection = prevSections?.find(
            (oldObj) => oldObj.visitSection === newVisitSection
          );
          const questionsFromOldSection = oldSection?.questions || [];

          const filteredQuestions = newQuestions.filter(
            (newQuestion) =>
              !questionsFromOldSection.some(
                (oldQuestion) => oldQuestion.question === newQuestion.question
              )
          );

          const otherSections = prevSections?.filter(
            (item) => item.visitSection !== newVisitSection
          );

          const mergedQuestions = filteredQuestions.length
            ? [...questionsFromOldSection, ...newQuestions]
            : [...newQuestions];

          return [
            ...(otherSections?.length ? otherSections : []),
            {
              visitSection: newVisitSection,
              questions: mergedQuestions,
            },
          ];
        }, []);

        setSectionQuestionsForm?.(updatedQuestions);
        return updatedQuestions;
      });
    },
    [setSectionQuestionsForm]
  );

  const handleSetReferrals = useCallback(
    (value: VisitDataStatusFilterInput[]) => {
      setReferralsInput((prevState) => {
        const newState = [...(prevState || [])];
        value.forEach((item) => {
          const index = newState.findIndex((element) => element.id === item.id);
          if (index !== -1) {
            newState[index].isCompleted = item.isCompleted;
          } else {
            newState.push(item);
          }
        });
        return newState;
      });
    },
    []
  );

  const handleOnNext = useCallback(() => {
    setIsEnableButton(false);
    onNextStep?.();
  }, [onNextStep]);

  const onSubmit = useCallback(() => {
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const input: CmsVisitDataInputModelInput = {
      visitId: MOCKED_VISIT_ID, // TODO: add integration
      infantId: infant?.user?.id,
      visitData: {
        visitName: name,
        sections,
      },
    };

    const referrals = referralsInput?.map((item) => ({
      ...item,
      isCompleted: String(item.isCompleted),
    })) as VisitDataStatusFilterInput[];

    appDispatch(
      visitActions.addCompletedVisitsByVisitId({
        visitId: MOCKED_VISIT_ID,
        visits: [name || ''],
      })
    );

    if (!!sections?.length) {
      appDispatch(visitActions.addVisitFormData(input));
      appDispatch(visitThunkActions.addVisitFormData(input));
    }

    if (!!referrals?.length) {
      appDispatch(
        referralThunkActions.updateVisitDataStatus({ input: referrals })
      );
    }
  }, [
    MOCKED_VISIT_ID,
    appDispatch,
    infant?.user?.id,
    name,
    referralsInput,
    sectionQuestions,
  ]);

  // TODO: sync visit form
  useLayoutEffect(() => {
    if (completedVisits) {
      appDispatch(
        visitThunkActions.getCompletedVisitsForVisitId({
          visitId: MOCKED_VISIT_ID,
        })
      );
    }
  }, [MOCKED_VISIT_ID, appDispatch, completedVisits]);

  const renderContent = useMemo(() => {
    if (!steps) return;

    const CurrentStep = steps[Number(currentStep)];

    return (
      <CurrentStep
        infant={infant}
        isTipPage={isTipPage}
        setIsTip={setIsTip}
        sectionQuestions={sectionQuestions}
        setSectionQuestions={handleSetQuestions}
        setReferralsInput={handleSetReferrals}
        setEnableButton={setIsEnableButton}
        onNextStep={onNextStep}
      />
    );
  }, [
    currentStep,
    handleSetQuestions,
    handleSetReferrals,
    infant,
    isTipPage,
    onNextStep,
    sectionQuestions,
    setIsTip,
    steps,
  ]);

  const renderButton = useMemo(() => {
    if (Number(currentStep) === 0) {
      return {
        action: handleOnNext,
        text: 'Start',
        icon: 'ClipboardListIcon',
      };
    }

    if (Number(currentStep) < Number(steps?.length) - 1) {
      return {
        action: handleOnNext,
        text: 'Next',
        icon: 'ArrowCircleRightIcon',
      };
    }

    return {
      action: onSubmit,
      text: 'Save',
      icon: 'SaveIcon',
    };
  }, [currentStep, handleOnNext, onSubmit, steps?.length]);

  useEffect(() => {
    if (
      (wasLoading && !isLoading) ||
      (wasLoadingReferral && !isLoadingReferral)
    ) {
      successDialog();
      onClose?.();
    }
  }, [
    isLoading,
    isLoadingReferral,
    onClose,
    successDialog,
    wasLoading,
    wasLoadingReferral,
  ]);

  return (
    <div className="flex h-full flex-col">
      {renderContent}
      {!isTipPage && (
        <div id="button" className="mx-4 mt-auto flex items-end">
          <Button
            type="filled"
            color="primary"
            textColor="white"
            icon={renderButton.icon}
            className="mb-4 w-full"
            text={renderButton.text}
            onClick={renderButton.action}
            disabled={!isEnableButton || isLoading}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};
