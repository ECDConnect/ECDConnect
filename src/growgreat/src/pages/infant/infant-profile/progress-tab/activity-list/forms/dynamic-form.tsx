import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { ActionModal, DialogPosition, Button } from '@ecdlink/ui';
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
import { referralThunkActions } from '@/store/referral';
import { ReferralActions } from '@/store/referral/referral.actions';
import { GrowthMonitoring } from './pillar-1-steps';
import { useLocation, useParams } from 'react-router';
import { InfantProfileParams } from '../../../infant-profile.types';
import { useDialog } from '@ecdlink/core';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { DocumentActions } from '@/store/document/document.actions';
import { currentActivityKey } from '..';
import { InfantModelInput } from '@/../../../packages/graphql/lib';
import { infantThunkActions } from '@/store/infant';
import { ButtonProps } from '@ecdlink/ui/lib/components/button/button.types';

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

export interface ViewEditState {
  editView?: true;
}

type Risk = 0 | 1 | 2;
export interface DynamicFormProps {
  name?: string;
  infant?: InfantDto;
  currentStep?: number;
  isTipPage?: boolean;
  steps?: any[]; // TODO: add type
  sectionQuestions?: SectionQuestions[];
  growthMonitoring?: GrowthMonitoring;
  setIsTip?: (value: boolean) => void;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  setReferralsInput?: (value?: VisitDataStatusFilterInput[]) => void;
  setEnableButton?: (value: boolean) => void;
  setButtonProperties?: (value?: ButtonProps) => void;
  setExtraButtons?: (buttons?: JSX.Element[]) => void;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  onClose?: () => void;
  onSubmit?: () => void;
  setGrowthMonitoring?: (value: GrowthMonitoring) => void;
  setRisk?: (value: number) => void;
  setInfantInput?: (value?: InfantModelInput) => void;
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
  const [buttonProperties, setButtonProperties] = useState<
    ButtonProps | undefined
  >(undefined);
  const [extraButtons, setExtraButtons] = useState<JSX.Element[] | undefined>(
    undefined
  );
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [referralsInput, setReferralsInput] =
    useState<VisitDataStatusFilterInput[]>();
  const [growthMonitoring, setGrowthMonitoring] = useState<GrowthMonitoring>();
  const [risk, setRisk] = useState<Risk>(0);
  const [infantInput, setInfantInput] = useState<InfantModelInput>();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.ADD_VISIT_FORM_DATA
  );
  const { isLoading: isLoadingReferral } = useThunkFetchCall(
    'referrals',
    ReferralActions.UPDATE_VISIT_DATA_STATUS
  );
  const { isLoading: isLoadingCreateDocument } = useThunkFetchCall(
    'documents',
    DocumentActions.CREATE_DOCUMENT
  );

  const wasLoading = usePrevious(isLoading);
  const wasLoadingReferral = usePrevious(isLoadingReferral);

  const infantName = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const { visitId } = useParams<InfantProfileParams>();
  const { successDialog } = useRequestResponseDialog();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const history = useHistory();

  const location = useLocation<ViewEditState>();
  const canEdit = location.state?.editView;

  const goHome = useCallback(() => {
    window.sessionStorage.removeItem(currentActivityKey);
    history.push(`${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infant?.user?.id}`);
  }, [history, infant?.user?.id]);

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

  const handleSetInfant = useCallback((value: InfantModelInput) => {
    setInfantInput?.((prevState) => ({ ...prevState, ...value }));
  }, []);

  const handleGrowthMonitoring = useCallback((value: GrowthMonitoring) => {
    setGrowthMonitoring?.((prevState) => ({ ...prevState, ...value }));
  }, []);

  const handleRisk = useCallback((value: Risk) => {
    setRisk(value);
  }, []);

  const handleOnNext = useCallback(() => {
    setIsEnableButton(false);
    setButtonProperties(undefined);
    setExtraButtons(undefined);
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
        visitId,
        infantId: infant?.user?.id,
        visitData: {
          visitName: name,
          sections,
        },
      };

      const referrals = referralsInput?.map((item) => ({
        ...item,
        isCompleted: item.isCompleted,
      })) as VisitDataStatusFilterInput[];

      appDispatch(
        visitActions.addCompletedVisitsByVisitId({
          visitId,
          visits: [name || ''],
        })
      );

      appDispatch(visitActions.addVisitFormData(input));
      await appDispatch(visitThunkActions.addVisitFormData(input));

      await appDispatch(
        visitThunkActions.getCompletedVisitsForVisitId({
          visitId,
        })
      );

      if (!!referrals?.length) {
        appDispatch(
          referralThunkActions.updateVisitDataStatus({ input: referrals })
        );
      }

      if (!!infantInput && infant?.user?.id) {
        appDispatch(
          infantThunkActions.updateInfant({
            input: infantInput,
            id: infant?.user?.id,
          })
        ).unwrap();
      }
    }
  }, [
    canEdit,
    dialog,
    sectionQuestions,
    visitId,
    infant?.user?.id,
    name,
    referralsInput,
    appDispatch,
    infantInput,
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
        isTipPage={isTipPage}
        setIsTip={setIsTip}
        growthMonitoring={growthMonitoring}
        sectionQuestions={sectionQuestions}
        setSectionQuestions={handleSetQuestions}
        setGrowthMonitoring={handleGrowthMonitoring}
        setReferralsInput={handleSetReferrals}
        setEnableButton={setIsEnableButton}
        setButtonProperties={setButtonProperties}
        setExtraButtons={setExtraButtons}
        onNextStep={onNextStep}
        onSubmit={onSubmit}
        setRisk={handleRisk}
        setInfantInput={handleSetInfant}
      />
    );
  }, [
    currentStep,
    growthMonitoring,
    handleGrowthMonitoring,
    handleSetQuestions,
    handleSetReferrals,
    handleSetInfant,
    infant,
    isTipPage,
    onNextStep,
    onSubmit,
    sectionQuestions,
    setIsTip,
    steps,
    handleRisk,
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

    if (Number(steps?.length) === 1) {
      return {
        action: onSubmit,
        text: 'Save',
        icon: 'SaveIcon',
      };
    }
    if (Number(currentStep) === 0) {
      return {
        action: handleOnNext,
        text: name?.startsWith('Care for') ? 'Start' : 'Next',
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
      text: risk === 2 ? 'Close' : buttonProperties?.text || 'Save',
      icon: risk === 2 ? 'XIcon' : 'SaveIcon',
    };
  }, [
    risk,
    currentStep,
    handleOnNext,
    onSubmit,
    steps?.length,
    name,
    buttonProperties,
  ]);

  useEffect(() => {
    if (
      (wasLoading && !isLoading) ||
      (wasLoadingReferral && !isLoadingReferral)
    ) {
      if (risk === 1) {
        dialog({
          blocking: false,
          position: DialogPosition.Middle,
          color: 'bg-white',
          render: (onClose) => {
            return (
              <ActionModal
                icon={'ExclamationCircleIcon'}
                iconColor="errorMain"
                iconBorderColor="errorBg"
                className="z-50"
                importantText={`Take ${infantName} to the hospital immediately or call an ambulance!`}
                detailText={`${infantName} is not well and needs urgent care!`}
                actionButtons={[
                  {
                    colour: 'primary',
                    text: 'Close',
                    textColour: 'primary',
                    type: 'outlined',
                    leadingIcon: 'XIcon',
                    onClick: onClose,
                  },
                ]}
              />
            );
          },
        });
        goHome?.();
      } else if (risk === 2) {
        goHome();
      } else {
        onClose?.();
      }
    }
  }, [
    isLoading,
    isLoadingReferral,
    onClose,
    successDialog,
    wasLoading,
    wasLoadingReferral,
    dialog,
    risk,
    infantName,
    goHome,
    caregiverName,
    name,
    history,
    infant?.user?.id,
  ]);

  const renderExtraButtons = useCallback(() => {
    if (!extraButtons || extraButtons.length === 0) return null;
    return extraButtons.map((el, index) => el);
  }, [extraButtons]);

  return (
    <div className="flex h-full flex-col">
      {renderContent}
      {!isTipPage && (
        <div id="button" className="mx-4 mt-auto flex flex-col items-end">
          {renderExtraButtons()}
          <Button
            type={buttonProperties?.type || 'filled'}
            color={buttonProperties?.color || 'primary'}
            textColor={buttonProperties?.textColor || 'white'}
            icon={renderButton.icon}
            className="mb-4 w-full"
            text={renderButton.text}
            onClick={renderButton.action}
            disabled={!isEnableButton || isLoading || isLoadingCreateDocument}
            isLoading={isLoading || isLoadingCreateDocument}
          />
        </div>
      )}
    </div>
  );
};
