import { AssessmentPageDto } from '@/models/journey/Journey.dto';
import { Score } from './score';
import {
  Alert,
  Divider,
  FormInput,
  Radio,
  CheckboxGroup,
  Typography,
  Button,
  DialogPosition,
  ActionModal,
  Dialog,
  ButtonGroup,
  ButtonGroupTypes,
} from '@ecdlink/ui';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
import { useSelector } from 'react-redux';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/solid';
import {
  computeClassroomMetrics,
  type ClassroomMetrics,
} from '@/utils/classroom/classroomMetrics';
import { SiteAddressDto, useDialog } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import { newGuid } from '@/utils/common/uuid.utils';
import {
  AddressMap,
  formatAddress,
} from '@/components/address-map/address-map';
import { useTenant } from '@/hooks/useTenant';

export type PublishedFormStepProps = {
  stepData: AssessmentPageDto;
  onStepChange: (updatedStep: AssessmentPageDto) => void;
  allQuestions?: any[];
  failedQuestions?: any[];
  allPassed?: boolean;
};

export const PublishedFormStep: React.FC<PublishedFormStepProps> = ({
  stepData,
  onStepChange,
  allQuestions = [],
  failedQuestions = [],
  allPassed = false,
}) => {
  const [localQuestions, setLocalQuestions] = useState(
    () => stepData.formQuestions || []
  );

  const options = [
    { text: 'Yes', value: true, disabled: false },
    { text: 'No', value: false, disabled: false },
  ];
  const [showMap, setShowMap] = useState(false);
  const [addressChanged, setAddressChanged] = useState<boolean>(false);
  const [address, setAddress] = useState<SiteAddressDto>({
    id: '',
    area: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    latitude: null,
    longitude: null,
    municipality: '',
    name: '',
    postalCode: '',
    province: null,
    provinceId: null,
    ward: '',
  });

  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;

  const classroom = useSelector(classroomsSelectors.getClassroom);

  const mapQuestion = localQuestions.find((q) => q.answerType === 'map');
  const hasSavedAnswer = !!mapQuestion?.answer?.trim();

  const answeredCount = localQuestions.filter((q) =>
    q.answerType === 'text' ? !!q.answer?.trim() : !!q.answerId?.trim()
  ).length;

  const metrics: ClassroomMetrics | null = useMemo(
    () => computeClassroomMetrics(localQuestions),
    [localQuestions]
  );

  useEffect(() => {
    setLocalQuestions(stepData.formQuestions || []);
  }, [stepData.id]);

  const updateQuestion = (questionId: string, updates: Partial<any>) => {
    setLocalQuestions((prev) => {
      const updated = prev.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      );

      // Tell parent about the change
      onStepChange({ ...stepData, formQuestions: updated });

      return updated;
    });
  };

  // 🎯 Radio button change
  const handleRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionId: string
  ) => {
    const optionId = event.target.value;
    const question = localQuestions.find((q) => q.id === questionId);
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

  useEffect(() => {
    if (mapQuestion?.answer) {
      setAddress((prev) => ({
        ...prev,
        addressLine1: mapQuestion?.answer?.split(',')[0] || '',
      }));
    } else if (classroom?.siteAddress) {
      setAddress({
        id: classroom.siteAddress.id || newGuid(),
        addressLine1: classroom.siteAddress.addressLine1 || '',
        addressLine2: classroom.siteAddress.addressLine2 || '',
        addressLine3: classroom.siteAddress.addressLine3 || '',
        province: classroom.siteAddress.province as any,
        provinceId: classroom.siteAddress.provinceId,
        postalCode: classroom.siteAddress.postalCode || '',
        latitude: classroom.siteAddress.latitude,
        longitude: classroom.siteAddress.longitude,
        // ...
      });
    }
  }, [classroom?.siteAddress, mapQuestion?.answer]);

  const handleConfirmAddress = (confirmed: boolean) => {
    if (!mapQuestion) return;

    if (confirmed) {
      const displayAddress = formatAddress(address);

      updateQuestion(mapQuestion.id, {
        answer: displayAddress,
        answerId: 'map-confirmed',
      });

      saveAddressChanges();
    } else {
      setShowMap(true);
    }
  };

  const handleMapSubmit = (updatedAddress: SiteAddressDto) => {
    setAddress(updatedAddress);
    setAddressChanged(true);
    setShowMap(false);
  };

  const saveAddressChanges = async () => {
    if (!addressChanged) return;

    const siteAddress: SiteAddressDto = {
      id: address.id || newGuid(),
      area: address.area || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      addressLine3: address.addressLine3 || '',
      latitude: address.latitude,
      longitude: address.longitude,
      municipality: address.municipality,
      name: address.name || '',
      postalCode: address.postalCode || '',
      province: null,
      provinceId: !!address.provinceId ? address.provinceId : null,
      ward: address.ward || '',
    };

    appDispatch(
      classroomsActions.updateClassroomSiteAddress(siteAddress as any)
    );
  };

  const handleShowMap = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  const renderDialog = ({ index }: { index?: number }) => {
    return dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            customIcon={
              <QuestionMarkCircleIcon className="text-infoMain mb-4 w-9" />
            }
            customDetailText={
              <div className="mb-4">
                {' '}
                <Typography type="markdown" text={stepData?.info} />
              </div>
            }
            actionButtons={[
              {
                colour: 'quatenary',
                text: 'Close',
                textColour: 'quatenary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  };

  return (
    <div>
      <Typography className="mt-3 mb-4" type="h3" text={stepData?.name} />
      {stepData?.description && (
        <Alert type="info" title={stepData.description} className="mb-4" />
      )}
      {stepData?.info && (
        <Button
          text="Learn more"
          icon="QuestionMarkCircleIcon"
          type="filled"
          color="quatenary"
          textColor="white"
          onClick={() => renderDialog({})}
        />
      )}

      {stepData?.isScoreResult === 'true' && (
        <div className="mb-4">
          {allPassed ? (
            <Alert
              className="mb-4"
              type="success"
              title={`${classroom?.name} meets all the health and safety standards!`}
              variant="outlined"
              customIcon={<Emoji3 className="h-auto w-16" />}
            />
          ) : (
            <Alert
              className="mb-4"
              type="warning"
              customIcon={
                <ExclamationCircleIcon className="white mb-4 h-6 w-6" />
              }
              title={`${classroom?.name} does not meet these health and safety standards.`}
              list={
                failedQuestions.length > 0
                  ? failedQuestions.map((q) => q.name || `Question ${q.id}`)
                  : ['No questions could be evaluated.']
              }
            />
          )}
        </div>
      )}
      <Divider dividerType="dashed" className="my-2" />

      {localQuestions.map((question) => {
        const hasOptions = (question.formQuestionOptions?.length ?? 0) > 0;
        const isSingleCheckbox =
          question.answerType === 'checkBox' && !hasOptions;

        return (
          <Fragment key={question.id}>
            {!isSingleCheckbox && (
              <Typography
                type="h4"
                text={question.name}
                className="font-bold"
                color="textDark"
              />
            )}
            {!isSingleCheckbox &&
              question.description &&
              question.description !== 'cms' && (
                <Typography type="h6" text={question.description} />
              )}
            <fieldset className="mb-3 flex flex-col gap-2">
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
                <div className="flex flex-col">
                  {question.formQuestionOptions?.length! > 0 ? (
                    question.formQuestionOptions?.map((item) => {
                      const isNone = item.name.toLowerCase().includes('none');

                      const currentIds = question.answerId
                        ? question.answerId
                            .split('|')
                            .map((id) => id.trim())
                            .filter(Boolean)
                        : [];

                      const noneOption = question.formQuestionOptions?.find(
                        (o) => o.name.toLowerCase().includes('none')
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
                          checkboxColor="textLight"
                          titleWeight="normal"
                          checked={currentIds.includes(item.id)}
                          disabled={!isNone && noneSelected}
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
                              newIds = currentIds.filter(
                                (id) => id !== item.id
                              );
                              newAnswers = currentAnswers.filter(
                                (a) => a !== item.name
                              );
                            } else if (isNone) {
                              newIds = [item.id];
                              newAnswers = [item.name];
                            } else {
                              newIds = [...currentIds, item.id];
                              newAnswers = [...currentAnswers, item.name];

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
                    })
                  ) : (
                    <CheckboxGroup
                      id={question.id}
                      title={question.name}
                      value={question.id}
                      checkboxColor="textLight"
                      titleWeight="normal"
                      checked={!!question.answerId}
                      onChange={() => {
                        const currentlyChecked = !!question.answerId;

                        updateQuestion(question.id, {
                          answer: currentlyChecked ? '' : 'true',
                          answerId: currentlyChecked ? '' : question.id,
                        });
                      }}
                    />
                  )}
                </div>
              )}

              {/* ✏️ Text Area Input */}
              {question.answerType === 'text' && (
                <FormInput
                  textInputType="textarea"
                  placeholder={question.description || ''}
                  value={question.answer || ''}
                  className="mt-2"
                  onChange={(e) =>
                    handleTextChange(e.target.value, question.id)
                  }
                />
              )}

              {/* ✏️ Number Input */}
              {question.answerType === 'number' && (
                <div className="flex items-center gap-2">
                  <FormInput
                    type="number"
                    value={question.answer}
                    className="w-1/2"
                    onChange={(e) => {
                      const val = e.target.value;
                      updateQuestion(question.id, {
                        answer: val,
                        answerId: '',
                      });
                    }}
                    {...((!!question.answer &&
                      !!question.minValue &&
                      Number(question.answer) < Number(question.minValue)) ||
                    (!!question.answer && Number(question.answer) < 0)
                      ? {
                          error: {
                            type: 'max',
                            message: `Please enter a number that is more than ${question.minValue}.`,
                          },
                        }
                      : {})}
                  />
                  {question.description === 'cms' && (
                    <Typography type="body" color="textMid" text="cms" />
                  )}
                </div>
              )}
              {/* ✏️ Map Input */}
              {question.answerType === 'map' && (
                <>
                  {isOnline ? (
                    <div className="mt-2">
                      {address.addressLine1 ? (
                        <>
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-base">
                            <Typography
                              type="h4"
                              color="textDark"
                              className="semi-bold mt-3 mb-1"
                              text="Property address:"
                            />
                            <Typography
                              type="body"
                              color="textMid"
                              className="mt-3 mb-1"
                              text={`${address.addressLine1} ${
                                address.addressLine2
                              } ${address.province?.description || ''}`}
                            />
                          </div>

                          <Typography
                            type="h4"
                            color="textDark"
                            className="semi-bold mt-3 mb-1"
                            text="Is this address correct?"
                          />

                          <div className="mt-2 flex gap-3">
                            <ButtonGroup<boolean>
                              notSelectedColor="quatenaryBg"
                              textColor="quatenary"
                              color="quatenary"
                              type={ButtonGroupTypes.Button}
                              options={options}
                              onOptionSelected={(value) =>
                                handleConfirmAddress(
                                  Array.isArray(value) ? value[0] : value
                                )
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <div onClick={handleShowMap}>
                          <FormInput
                            placeholder="Tap to add"
                            type="text"
                            onChange={() => {}}
                            value={formatAddress(address)}
                            disabled={showMap}
                            suffixIcon="LocationMarkerIcon"
                            sufficIconColor="primary"
                            suffixIconAction={() => setShowMap(true)}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col items-center justify-center px-10 text-center">
                      <Alert
                        className="w-full"
                        type="info"
                        title="You must be online to update the address."
                        list={[
                          `If you are offline, please select “Yes” above & explain how the principal can update their address through ${appName}: log in, 
                          tap the profile image in the top right of the screen, tap "Preschool" and then add a location.`,
                        ]}
                      />
                    </div>
                  )}
                </>
              )}
            </fieldset>
          </Fragment>
        );
      })}
      {metrics && (
        <div>
          <Divider dividerType="dashed" className="my-2" />
          <div className="space-y-4 text-base">
            <Typography
              type="body"
              color="textMid"
              text={`Total metres squared available: ${metrics.area}`}
            />
            <Typography
              type="body"
              color="textMid"
              text={`Assistants: ${metrics.assistants}`}
            />
            <Typography
              type="body"
              color="textMid"
              text={`Capacity: ${metrics.capacity} children`}
            />
          </div>
          <Divider dividerType="dashed" className="my-2" />
        </div>
      )}
      {stepData?.isScored === 'true' && (
        <div className="mb-4">
          <Score sum={answeredCount} total={localQuestions.length} />
        </div>
      )}
      <Dialog visible={showMap} position={DialogPosition.Bottom} stretch>
        <AddressMap
          address={address}
          componentHeight={62}
          onClose={handleCloseMap}
          onSubmit={handleMapSubmit}
        />
      </Dialog>
    </div>
  );
};
