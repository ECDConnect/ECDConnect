import { useState, useEffect } from 'react';
import {
  ComponentBaseProps,
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
import { useHistory, useLocation } from 'react-router';
import {
  ReassignClassPageState,
  ContributionTypes,
  FeeTypes,
} from './preschool-fees.types';
import * as styles from './preschool-fees.styles';
import ROUTES from '@routes/routes';
import { format } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { userSelectors } from '@store/user';
import { childrenSelectors } from '@/store/children';
import {
  PreschoolFeesModel,
  preschoolFeesSchema,
} from '@/schemas/income-statements/preschool-fees';

export const PreschoolFees: React.FC<ComponentBaseProps> = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const userData = useSelector(userSelectors.getUser);
  const history = useHistory();
  const { state: routeState } = useLocation<ReassignClassPageState>();
  const children = useSelector(childrenSelectors.getChildren);
  const reportingDate = routeState?.reportingDate
    ? new Date(routeState?.reportingDate)
    : new Date();
  const formattedDate = reportingDate
    ? format(reportingDate, 'EEEE, d LLLL')
    : '';
  const [selectedFamilyGrants, setSelectedFamilyGrants] = useState<string[]>(
    []
  );

  const {
    control,
    setValue: setPreschoolFeesValue,
    register,
  } = useForm<PreschoolFeesModel>({
    resolver: yupResolver(preschoolFeesSchema),
    mode: 'onChange',
    // defaultValues: {
    //   date: new Date().toString(),
    //   practitioner: practitionerId ? practitionerId : '',
    // },
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
    grants,
    note,
  } = useWatch({
    control: control,
  });

  console.log({ date, child, contributionType, grants, note });

  useEffect(() => {
    const _list = ContributionTypes?.map((p) => {
      if (p?.type) {
        return {
          label: `${p?.type}`,
          value: p.id,
        };
      }
      return undefined;
    }).filter(Boolean) as { label: string; value: any }[];

    setIncomeTypesList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const _list = children
      ?.map((p) => {
        if (p?.user?.firstName) {
          return {
            label: `${p?.user?.firstName}`,
            value: p.id,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setChildrenList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const _list = FeeTypes?.map((p) => {
      if (p?.type) {
        return {
          label: `${p?.type}`,
          value: p.id,
        };
      }
      return undefined;
    }).filter(Boolean) as { label: string; value: any }[];

    setFeeTypesList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFamilyGrantSelection = (familyGrants: string[]) => {
    setSelectedFamilyGrants(familyGrants);
    setPreschoolFeesValue('grants', familyGrants);
    // updateFormValidity();
  };

  // const submitReassignClass = async () => {
  //   if (
  //     userAuth?.auth_token &&
  //     selectedDate &&
  //     userData?.id &&
  //     reassignedClass
  //   ) {
  //     await new ClassroomGroupService(
  //       userAuth.auth_token
  //     ).updateReassignClassroomGroup(
  //       practitioner,
  //       practitioner2,
  //       reason,
  //       new Date(selectedDate),
  //       userData?.id,
  //       reassignedClass
  //     );
  //   }
  //   history.push(ROUTES.DASHBOARD);
  // };

  return (
    <BannerWrapper
      title={`Progress summary`}
      subTitle={`${
        formattedDate ? formattedDate : format(new Date(), 'EEEE, d LLLL')
      }`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => history.push(ROUTES.CLASSROOM)}
      className="p-4"
      // displayOffline={!isOnline}
    >
      <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="textMid" text={'Reassign a class'} />
        <Alert
          type={'info'}
          title={
            'Money received from caregivers. Caregivers are your customers who pay a fee for their children to attend your programme.'
          }
          list={[
            'If they cannot afford to pay you may choose to reduce your fee or to allow them to contribute in other ways, such as giving items like food, or volunteering their time.',
          ]}
          className="mt-6"
        />
        <label className="text-md mt-2 mb-1 block font-semibold text-gray-700">
          When did the caregiver pay this fee?
        </label>
        <DatePicker
          placeholderText={`Please select a date`}
          wrapperClassName="text-center"
          className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onChange={(date: Date) => {
            setPreschoolFeesValue('date', date ? date.toString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
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
        />
        <Dropdown
          placeholder={'Select type of contribution'}
          list={incomeTypesList || []}
          fillType="clear"
          label={'How did the caregiver contribute?'}
          fullWidth
          className={'mt-3 w-full'}
          selectedValue={contributionType}
          onChange={(item: any) => {
            setPreschoolFeesValue('contributionType', item);
          }}
        />
        <label className={classNames(styles.label, 'mt-4')}>
          {'Which of these grants does the family receive?'}
        </label>
        <label className={styles.hintStyle}>{'Select all that apply'}</label>
        <div className={'mt-2'}>
          <ButtonGroup<string>
            type={ButtonGroupTypes.Chip}
            options={
              feeTypesList?.map((type) => ({
                text: type.label,
                value: type.value ?? '',
              })) || []
            }
            onOptionSelected={(value: string | string[]) =>
              handleFamilyGrantSelection(value as string[])
            }
            multiple
            selectedOptions={selectedFamilyGrants}
            color="secondary"
          />
        </div>
        <FormInput<PreschoolFeesModel>
          label={'Add a note'}
          visible={true}
          nameProp={'note'}
          register={register}
          placeholder={'e.g. Paid for two months'}
        />
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={() => {}}
        >
          {renderIcon('SaveIcon', styles.buttonIcon)}
          <Typography
            type="help"
            className="mr-2"
            color="white"
            text={'Save'}
          ></Typography>
        </Button>
        <Button
          type="outlined"
          color="primary"
          className={'mx-auto mt-2 w-full rounded-2xl'}
          onClick={() => {}}
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
