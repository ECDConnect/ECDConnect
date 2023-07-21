import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { ActionModal, Button, DialogPosition } from '@ecdlink/ui';
import { InfantDto, MotherDto, useDialog, usePrevious } from '@ecdlink/core';
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
import { referralThunkActions } from '@/store/referral';
import { ReferralActions } from '@/store/referral/referral.actions';
import { useLocation, useParams } from 'react-router';
import { activitiesTypes } from '../activities-list';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';

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
  mother?: MotherDto;
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

export interface MotherProfileParams {
  id: string;
  visitId: string;
}
export interface ViewEditState {
  editView?: true;
}

export const DynamicForm = ({
  name,
  infant,
  mother,
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
  const history = useHistory();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.ADD_VISIT_FOR_MOM_FORM_DATA
  );
  const { isLoading: isLoadingReferral } = useThunkFetchCall(
    'referrals',
    ReferralActions.UPDATE_VISIT_DATA_STATUS
  );
  const { isLoading: isLoadingCompletedVisits } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MOM_COMPLETED_VISITS_FOR_VISIT_ID
  );

  const wasLoading = usePrevious(isLoading);
  const wasLoadingReferral = usePrevious(isLoadingReferral);
  const wasLoadingCompletedVisits = isLoadingCompletedVisits;

  const location = useLocation<ViewEditState>();
  const canEdit = location.state?.editView;
  const dialog = useDialog();

  const { visitId } = useParams<MotherProfileParams>();

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

  const onSubmit = useCallback(async () => {
    if (!canEdit) {
      return dialog({
        position: DialogPosition.Middle,
        color: 'bg-white',
        render(onClose) {
          return (
            <ActionModal
              className="z-50"
              icon="ExclamationCircleIcon"
              iconColor="alertMain"
              iconClassName="h-10 w-10"
              title="You cannot edit this form"
              detailText="You have completed this visit and can only view this information"
              actionButtons={[
                {
                  text: 'Close',
                  colour: 'primary',
                  type: 'filled',
                  textColour: 'white',
                  leadingIcon: 'XIcon',
                  onClick: onClose,
                },
              ]}
            />
          );
        },
      });
    } else {
      const sections = sectionQuestions?.map((item) => ({
        ...item,
        questions: item.questions.map((question) => ({
          ...question,
          answer: String(question.answer),
        })),
      })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

      const input: CmsVisitDataInputModelInput = {
        visitId: visitId, // TODO: add integration
        motherId: mother?.user?.id,
        visitData: {
          visitName: name,
          sections,
        },
      };

      const referrals = referralsInput?.map((item) => ({
        ...item,
        isCompleted: item.isCompleted,
      })) as VisitDataStatusFilterInput[];

      appDispatch(visitActions.addVisitFormDataForMother(input));
      await appDispatch(visitThunkActions.addVisitForMomFormData(input));
      await appDispatch(
        visitThunkActions.getMomCompletedVisitsForVisitId({
          visitId: visitId,
        })
      );

      if (!!referrals?.length) {
        appDispatch(
          referralThunkActions.updateVisitDataStatus({ input: referrals })
        );
      }

      if (name === activitiesTypes.followUp) {
        history.push(`${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${mother?.user?.id}`);
      }
    }
  }, [
    sectionQuestions,
    visitId,
    mother?.user?.id,
    name,
    referralsInput,
    appDispatch,
    history,
    dialog,
    canEdit,
  ]);

  // TODO: sync visit form
  useLayoutEffect(() => {}, []);

  const renderContent = useMemo(() => {
    if (!steps) return;

    const CurrentStep = steps[Number(currentStep)];

    if (!CurrentStep) return;

    return (
      <CurrentStep
        infant={infant}
        mother={mother}
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
    mother,
    onNextStep,
    sectionQuestions,
    setIsTip,
    steps,
  ]);

  const renderButton = useMemo(() => {
    if (
      Number(currentStep) === 0 &&
      !(Number(currentStep) <= Number(steps?.length) - 1)
    ) {
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
      (wasLoadingReferral && !isLoadingReferral) ||
      (wasLoadingCompletedVisits && !isLoadingCompletedVisits)
    ) {
      onClose?.();
    }
  }, [
    isLoading,
    isLoadingCompletedVisits,
    isLoadingReferral,
    onClose,
    wasLoading,
    wasLoadingCompletedVisits,
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
