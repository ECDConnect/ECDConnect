import { useState, useCallback } from 'react';
import { BannerWrapper, Typography, Button, Alert, Divider } from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { statementsActions, statementsSelectors } from '@/store/statements';
import { IncomeItemDto } from '@ecdlink/core';
import { lastDayOfMonth } from 'date-fns';
import StatementsWrapper from '@/pages/business/money/submit-income-statements/components/statements-wrapper/StatementsWrapper';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { AddPreschoolFeesProps } from '../../../add-amount.types';
import { classroomsSelectors } from '@/store/classroom';
import CheckboxCard from '@/components/checkbox-card/checkbox-card';
import PreschoolFees from './preschool-fees';
import { useAppDispatch } from '@/store';
import { BusinessTabItems } from '@/pages/business/business.types';

export const AddPreschoolFees: React.FC<AddPreschoolFeesProps> = ({
  onBack,
}) => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const [step, setStep] = useState<number>(1);
  const [classroomGroupIds, setClassroomGroupIds] = useState<string[]>([]);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

  const onSubmit = useCallback(
    (incomeItems: IncomeItemDto[], statementId?: string) => {
      appDispatch(
        statementsActions.addOrUpdateIncomeItems({ statementId, incomeItems })
      );
      history.push(ROUTES.BUSINESS, {
        activeTabIndex: BusinessTabItems.MONEY,
      });
    },
    []
  );

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const minEditDate = new Date();
  minEditDate.setDate(minEditDate.getDate() - 60);

  const maxEditDate = lastDayOfMonth(new Date());

  const statement = useSelector(
    statementsSelectors.getStatementForMonth(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1
    )
  );

  // const viewTitle = 'Preschool Fee';
  // const incomeTypeValue = incomeTypes.find(
  //   (item) => item.description === viewTitle
  // );
  // const moneyContributionTypeId = '8ff95f6e-5116-4412-adf6-81025172970e';

  // const today = new Date();
  // const todayDateNumber = getDate(today);
  // const firstDateOfMonth = startOfMonth(today);
  // const firstDateOfPreviousMonth = new Date(
  //   today.getFullYear(),
  //   today.getMonth() - 1,
  //   1
  // );
  // const lastDateOfMonth = lastDayOfMonth(today);

  // const { setNotification } = useNotifications();

  // const {
  //   control,
  //   setValue: setPreschoolFeesValue,
  //   register,
  //   reset,
  // } = useForm<PreschoolFeesModel>({
  //   resolver: yupResolver(preschoolFeesSchema),
  //   mode: 'onChange',
  // });
  // const [incomeTypesList, setIncomeTypesList] = useState<
  //   { label: string; value: any }[]
  // >([]);
  // const [childrenList, setChildrenList] = useState<
  //   { label: string; value: any }[]
  // >([]);
  // const [feeTypesList, setFeeTypesList] = useState<
  //   { label: string; value: any }[]
  // >([]);

  // const {
  //   date: selectedDate,
  //   date,
  //   child,
  //   contributionType,
  //   feeType,
  //   note,
  //   amount,
  // } = useWatch({
  //   control: control,
  // });

  // useEffect(() => {
  //   setIncomeTypesList([]);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   const _list = children
  //     ?.map((p) => {
  //       if (p?.user?.firstName) {
  //         return {
  //           label: p?.user?.fullName
  //             ? `${p?.user?.fullName}`
  //             : `${p?.user?.firstName} ${p?.user?.surname ?? ''}`,
  //           value: p.userId,
  //         };
  //       }
  //       return undefined;
  //     })
  //     .filter(Boolean) as { label: string; value: any }[];

  //   setChildrenList(_list);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   setFeeTypesList([]);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const handleFeeTypeValue = (feeTypeValue: string[]) => {
  //   setSelectedFeeTypeValue(feeTypeValue);
  //   setPreschoolFeesValue('feeType', feeTypeValue);
  // };

  // const sendIncomeUpdate = async () => {
  //   const incomeInput: IncomeItemDto = {
  //     id: newGuid(),
  //     //isActive: true,
  //     dateReceived: date!,
  //     amount: amount ? moneyInputFormat(amount) : 0,
  //     incomeTypeId: incomeTypeValue!.id,
  //     childUserId: child,
  //     notes: note,
  //   };

  //   onSubmit(incomeInput);

  //   // TODO -> after saving
  //   setNotification({
  //     title: `Successfully Added Fees`,
  //     variant: NOTIFICATION.SUCCESS,
  //   });
  //   setSelectedFeeTypeValue([]);
  //   reset();
  //   setPreschoolFeesValue('note', '');
  // };

  // const sendOneIncomeUpdate = async () => {
  //   if (stepIndex === 6) {
  //     setState({ stepIndex: 7 });
  //     history?.push(ROUTES?.BUSINESS);
  //     return;
  //   }

  //   const incomeInput: IncomeItemDto = {
  //     id: newGuid(),
  //     //isActive: true,
  //     dateReceived: date!,
  //     amount: amount ? moneyInputFormat(amount) : 0,
  //     incomeTypeId: incomeTypeValue!.id,
  //     childUserId: child,
  //     notes: note,
  //   };

  //   onSubmit(incomeInput);
  //   onBack();
  // };

  // const {
  //   setState,
  //   state: { stepIndex, run },
  // } = useAppContext();
  // const walkThroughSteps = stepIndex === 5 || stepIndex === 6;

  // useEffect(() => {
  //   if (stepIndex === 6) {
  //     const el = document.getElementById('savePreschoolFee');

  //     el?.scrollIntoView();
  //   }
  // }, [stepIndex]);

  // const disabled = useMemo(() => {
  //   return (
  //     (!date || !child || !contributionType || !feeType) && stepIndex !== 6
  //   );
  // }, [child, contributionType, date, feeType, stepIndex]);

  // const walkthroughSetDateOrNot = useMemo(() => {
  //   if (walkThroughSteps && run) {
  //     return new Date();
  //   }
  //   return selectedDate ? new Date(selectedDate) : undefined;
  // }, [run, selectedDate, walkThroughSteps]);

  // useEffect(() => {
  //   if (walkThroughSteps && run) {
  //     handleFeeTypeValue(['bafa31fb-5b63-9e1b-ec43-855c059f65ce']);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [walkThroughSteps]);

  return (
    <BannerWrapper
      title={`Add preschool fee`}
      subTitle={`Step ${step} of 2`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={onBack}
      className="p-4"
    >
      <StatementsWrapper />
      <div className="flex flex-col justify-center p-4">
        <Typography type="h2" color="textMid" text={'Preschool fees'} />
        {step === 1 && (
          <>
            <Typography
              className={'mr-1'}
              type={'h2'}
              color={'primary'}
              text={'Which classes would you like to record fees for?'}
            />
            {!classroomGroups.length && (
              <Alert
                type={'info'}
                title={
                  "You don't have any classes yet. Add calsses to get started"
                }
                className="mt-6"
              />
            )}
            {classroomGroups.map((classroomGroup) => (
              <CheckboxCard
                className="mt-2"
                checked={classroomGroupIds.some((x) => x === classroomGroup.id)}
                onCheckboxChange={() => {
                  if (classroomGroupIds.some((x) => x === classroomGroup.id)) {
                    setClassroomGroupIds(
                      classroomGroupIds.filter((x) => x !== classroomGroup.id)
                    );
                  } else {
                    setClassroomGroupIds([
                      ...classroomGroupIds,
                      classroomGroup.id,
                    ]);
                  }
                }}
                key={classroomGroup.id}
                description={classroomGroup.name}
                checkboxColor="quatenary"
                checkedFocusColour="uiMid"
              />
            ))}
            <Button
              shape="normal"
              color="quatenary"
              type="filled"
              icon="ArrowCircleRightIcon"
              className="mt-6 rounded-2xl"
              disabled={!classroomGroupIds.length}
              onClick={() => setStep(2)}
            >
              <Typography type="body" color="white" text="Next" />
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            {!!statement?.downloaded && (
              <Alert
                type={'warning'}
                title={
                  'You can only view this item. You cannot edit it because you have downloaded the statement, or the statement is more than 60 days old.'
                }
                className="mt-6"
              />
            )}
            <Typography
              className={'mr-1'}
              type={'h2'}
              color={'primary'}
              text={'How much did each caregiver pay?'}
            />
            <Divider dividerType="dashed" className="mt-4" />
            <Typography
              className={'mr-1'}
              type={'h4'}
              color={'primary'}
              text={'Which month would you like to add fees for?'}
            />
            <DatePicker
              wrapperClassName="text-center"
              className="bg-uiBg text-primary mx-auto w-full rounded-md border-none"
              dateFormat={'MMMM yyyy'}
              showMonthYearPicker
              showFullMonthYearPicker
              selected={selectedDate}
              minDate={minEditDate}
              maxDate={maxEditDate}
              onChange={(date: Date) => setSelectedDate(date)}
            />
            <PreschoolFees
              month={selectedDate.getMonth()}
              year={selectedDate.getFullYear()}
              classroomGroupIds={classroomGroupIds}
              onSubmit={onSubmit}
            />
          </>
        )}
      </div>
      {/* <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="textMid" text={'Preschool fee'} />
        <Alert
          type={'info'}
          title={
            'Money received from caregivers. Caregivers are your customers who pay a fee for their children to attend your programme.'
          }
          list={[
            'If they cannot afford to pay you may choose to reduce your fee or to allow them to contribute in other ways, such as giving items like food, or volunteering their time.',
          ]}
          className="mt-4 mb-2"
        />
        <div id="preeschoolFee1">
          <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
            When did the caregiver pay this fee?
          </label>
          <DatePicker
            placeholderText={`Please select a date`}
            wrapperClassName="text-center"
            className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
            selected={walkthroughSetDateOrNot}
            onChange={(date: Date) => {
              date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
              setPreschoolFeesValue('date', date ? date.toISOString() : '');
            }}
            dateFormat="EEE, dd MMM yyyy"
            minDate={
              todayDateNumber <= 8
                ? firstDateOfPreviousMonth!
                : firstDateOfMonth!
            }
            maxDate={lastDateOfMonth}
            disabled={(stepIndex === 5 || stepIndex === 6) && run === true}
          />
          <Dropdown
            placeholder={'Select child'}
            list={childrenList || []}
            fillType="clear"
            label={'Child paid for'}
            fullWidth
            className={'mt-3 w-full'}
            selectedValue={child}
            onChange={(item: any) => {
              setPreschoolFeesValue('child', item);
            }}
            disabled={(stepIndex === 5 || stepIndex === 6) && run === true}
          />
        </div>
        <Dropdown
          placeholder={'Select type of contribution'}
          list={incomeTypesList || []}
          fillType="clear"
          label={'How did the caregiver contribute?'}
          subLabel={
            "Caregivers who can't afford to contribute money can contribute by giving food or other items to the programme, or volunteering their time."
          }
          fullWidth
          className={'mt-3 w-full'}
          selectedValue={contributionType}
          onChange={(item: any) => {
            setPreschoolFeesValue('contributionType', item);
          }}
          disabled={(stepIndex === 5 || stepIndex === 6) && run === true}
        />
        {contributionType === moneyContributionTypeId && (
          <FormInput<PreschoolFeesModel>
            label={'How much did the caregiver pay?'}
            visible={true}
            nameProp={'amount'}
            register={register}
            placeholder={'e.g. R 200'}
            className="mt-4"
            type={'text'}
            textInputType={'moneyInput'}
            prefixIcon={!!amount}
            disabled={(stepIndex === 5 || stepIndex === 6) && run === true}
          />
        )}
        <label className={classNames(styles.label, 'mt-4')}>
          {'Type of fee'}
        </label>
        <label className={classNames(styles.subLabel)}>
          {
            'Which service did the caregiver pay for? You can choose more than one.'
          }
        </label>
        <div className={'mt-2'}>
          <ButtonGroup<string>
            multiple
            type={ButtonGroupTypes.Chip}
            options={
              feeTypesList?.map((type) => ({
                text: type.label,
                value: type.value ?? '',
              })) || []
            }
            onOptionSelected={(value: string | string[]) =>
              handleFeeTypeValue(value as string[])
            }
            selectedOptions={selectedFeeTypeValue}
            color="secondary"
          />
        </div>
        <FormInput<PreschoolFeesModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'note'}
          register={register}
          placeholder={'e.g. Paid for two months'}
          disabled={(stepIndex === 5 || stepIndex === 6) && run === true}
        />
        <div>
          <Button
            type="filled"
            color="primary"
            className={'mx-auto mt-8 w-full rounded-2xl'}
            onClick={sendOneIncomeUpdate}
            disabled={
              disabled ||
              (!amount &&
                contributionType === moneyContributionTypeId &&
                stepIndex !== 6)
            }
            id="savePreschoolFee"
          >
            {renderIcon('SaveIcon', styles.buttonIcon)}
            <Typography
              type="help"
              className="mr-2"
              color="white"
              text={'Save'}
            ></Typography>
          </Button>
        </div>
        <Button
          type="outlined"
          color="primary"
          className={'mx-auto mt-2 w-full rounded-2xl'}
          onClick={sendIncomeUpdate}
          disabled={
            disabled ||
            (!amount && contributionType === moneyContributionTypeId)
          }
        >
          {renderIcon('PlusIcon', styles.buttonIconSaveFees)}
          <Typography
            type="help"
            className="mr-2"
            color="primary"
            text={'Save & add fees for another child'}
          ></Typography>
        </Button>
      </div> */}
    </BannerWrapper>
  );
};

export default AddPreschoolFees;
