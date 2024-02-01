import { useState, useEffect, useMemo } from 'react';
import {
  BannerWrapper,
  Typography,
  Dropdown,
  renderIcon,
  Button,
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  classNames,
  FormInput,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './preschool-fees.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@/store/children';
import {
  PreschoolFeesModel,
  preschoolFeesSchema,
} from '@/schemas/income-statements/preschool-fees';
import { statementsSelectors } from '@/store/statements';
import { authSelectors } from '@/store/auth';
import { newGuid } from '@/utils/common/uuid.utils';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import { getDate, lastDayOfMonth, startOfMonth } from 'date-fns';
import StatementsWrapper from '@/pages/business/money/submit-income-statements/components/statements-wrapper/StatementsWrapper';
import { useAppContext } from '@/walkthrougContext';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { AddIncomeState } from '../../../add-amount.types';
import { StatementsIncomeInput } from '@ecdlink/graphql';
import { moneyInputFormat } from '@/utils/statements/statements-utils';

export const PreschoolFees: React.FC<AddIncomeState> = ({
  setType,
  onSubmit,
}) => {
  const history = useHistory();
  const children = useSelector(childrenSelectors.getChildren);
  const [selectedFeeTypeValue, setSelectedFeeTypeValue] = useState<string[]>(
    []
  );
  const userAuth = useSelector(authSelectors.getAuthUser);
  const feeTypes = useSelector(statementsSelectors.getFeeTypes);
  const contributionTypes = useSelector(
    statementsSelectors.getContributionTypes
  );
  const incomeTypes = useSelector(statementsSelectors.getIncomeTypes);
  const viewTitle = 'Preschool Fee';
  const incomeTypeValue = incomeTypes.find(
    (item) => item.description === viewTitle
  );
  const moneyContributionTypeId = '8ff95f6e-5116-4412-adf6-81025172970e';

  const today = new Date();
  const todayDateNumber = getDate(today);
  const firstDateOfMonth = startOfMonth(today);
  const firstDateOfPreviousMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const lastDateOfMonth = lastDayOfMonth(today);

  const { setNotification } = useNotifications();

  const {
    control,
    setValue: setPreschoolFeesValue,
    register,
    reset,
  } = useForm<PreschoolFeesModel>({
    resolver: yupResolver(preschoolFeesSchema),
    mode: 'onChange',
  });
  const [incomeTypesList, setIncomeTypesList] = useState<
    { label: string; value: any }[]
  >([]);
  const [childrenList, setChildrenList] = useState<
    { label: string; value: any }[]
  >([]);
  const [feeTypesList, setFeeTypesList] = useState<
    { label: string; value: any }[]
  >([]);

  const {
    date: selectedDate,
    date,
    child,
    contributionType,
    feeType,
    note,
    amount,
  } = useWatch({
    control: control,
  });

  useEffect(() => {
    const _list = contributionTypes
      ?.map((p) => {
        if (p?.description) {
          return {
            label: `${p?.description}`,
            value: p.id,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setIncomeTypesList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const _list = children
      ?.map((p) => {
        if (p?.user?.firstName) {
          return {
            label: p?.user?.fullName
              ? `${p?.user?.fullName}`
              : `${p?.user?.firstName} ${p?.user?.surname ?? ''}`,
            value: p.userId,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setChildrenList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const _list = feeTypes
      ?.map((p) => {
        if (p?.description) {
          return {
            label: `${p?.description}`,
            value: p.id,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setFeeTypesList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFeeTypeValue = (feeTypeValue: string[]) => {
    setSelectedFeeTypeValue(feeTypeValue);
    setPreschoolFeesValue('feeType', feeTypeValue);
  };

  const sendIncomeUpdate = async () => {
    const incomeInput: StatementsIncomeInput = {
      IsActive: true,
      UserId: userAuth?.id,
      ChildUserId: child,
      Submitted: false,
      DateReceived: date,
      Notes: note,
      Amount: amount ? moneyInputFormat(amount) : 0,
      AmountExpected: amount ? moneyInputFormat(amount) : 0,
      ChildCoverAmount: 0,
      ContributionTypeId: contributionType,
      IncomeTypeId: incomeTypeValue?.id,
      FeeTypeId: String(feeType) || '',
    };

    onSubmit(incomeInput);

    // TODO -> after saving
    setNotification({
      title: `Successfully Added Fees`,
      variant: NOTIFICATION.SUCCESS,
    });
    setSelectedFeeTypeValue([]);
    reset();
    setPreschoolFeesValue('note', '');
  };

  const sendOneIncomeUpdate = async () => {
    if (stepIndex === 6) {
      setState({ stepIndex: 7 });
      history?.push(ROUTES?.BUSINESS);
      return;
    }

    const incomeInput: StatementsIncomeInput = {
      Id: newGuid(),
      IsActive: true,
      UserId: userAuth?.id,
      ChildUserId: child,
      Submitted: false,
      DateReceived: date,
      Notes: note,
      Amount: amount ? moneyInputFormat(amount) : 0,
      AmountExpected: amount ? moneyInputFormat(amount) : 0,
      ChildCoverAmount: 0,
      ContributionTypeId: contributionType,
      IncomeTypeId: incomeTypeValue?.id,
      FeeTypeId: String(feeType) || '',
    };

    onSubmit(incomeInput);

    setType('');
  };

  const {
    setState,
    state: { stepIndex, run },
  } = useAppContext();
  const walkThroughSteps = stepIndex === 5 || stepIndex === 6;

  useEffect(() => {
    if (stepIndex === 6) {
      const el = document.getElementById('savePreschoolFee');

      el?.scrollIntoView();
    }
  }, [stepIndex]);

  const disabled = useMemo(() => {
    return (
      (!date || !child || !contributionType || !feeType) && stepIndex !== 6
    );
  }, [child, contributionType, date, feeType, stepIndex]);

  const walkthroughSetDateOrNot = useMemo(() => {
    if (walkThroughSteps && run) {
      return new Date();
    }
    return selectedDate ? new Date(selectedDate) : undefined;
  }, [run, selectedDate, walkThroughSteps]);

  useEffect(() => {
    if (walkThroughSteps && run) {
      handleFeeTypeValue(['bafa31fb-5b63-9e1b-ec43-855c059f65ce']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkThroughSteps]);

  return (
    <BannerWrapper
      title={`Add preschool fee`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => setType('')}
      className="p-4"
    >
      <StatementsWrapper />
      <div className="mb-3 w-full justify-center">
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
      </div>
    </BannerWrapper>
  );
};

export default PreschoolFees;
