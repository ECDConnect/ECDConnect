import { useMemo, useState, useEffect } from 'react';
import {
  ComponentBaseProps,
  BannerWrapper,
  Typography,
  Dropdown,
  renderIcon,
  Button,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation } from 'react-router';
import { ReassignClassPageState } from './reassign-class.types';
import ROUTES from '@routes/routes';
import { format } from 'date-fns';
import { useStoreSetup } from '@hooks/useStoreSetup';
import {
  ReassignClassModel,
  reassignClassSchema,
} from '@/schemas/practitioner/reassign-class';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { InformationCircleIcon } from '@heroicons/react/solid';
import * as styles from './reassign-class.styles';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { ClassroomGroupService } from '@/services/ClassroomGroupService';
import { authSelectors } from '@/store/auth';
import { userSelectors } from '@store/user';
import { classroomsSelectors } from '@/store/classroom';

const absentInfo = [
  {
    id: 1,
    name: 'Sick day',
  },
  {
    id: 2,
    name: 'Clinic appointment',
  },
  {
    id: 3,
    name: 'Funeral at home',
  },
  {
    id: 4,
    name: 'Family commitments',
  },
  {
    id: 4,
    name: 'No reason given',
  },
  {
    id: 4,
    name: 'Other',
  },
];

export const ReassignClass: React.FC<ComponentBaseProps> = () => {
  const { refreshClassroom } = useStoreSetup();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const userData = useSelector(userSelectors.getUser);
  const history = useHistory();
  const { state: routeState } = useLocation<ReassignClassPageState>();
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const reportingDate = routeState?.reportingDate
    ? new Date(routeState?.reportingDate)
    : new Date();
  const practitionerId = routeState?.practitionerId;
  const formattedDate = reportingDate
    ? format(reportingDate, 'EEEE, d LLLL')
    : '';

  const {
    control,
    // register: reassignClassRegister,
    setValue: setReassignClassValue,
  } = useForm<ReassignClassModel>({
    resolver: yupResolver(reassignClassSchema),
    mode: 'onChange',
    defaultValues: {
      date: new Date().toString(),
      practitioner: practitionerId ? practitionerId : '',
    },
  });
  const [practitionersList, setPractitionersList] = useState<
    { label: string; value: any }[]
  >([]);
  const [practitionersTeachList, setPractitionersTeachList] = useState<
    { label: string; value: any }[]
  >([]);
  const [classroomGroupsList, setClassroomGroupsList] = useState<
    { label: string; value: any }[]
  >([]);
  const [absentInfoList, setAbsentInfoList] = useState<
    { label: string; value: any }[]
  >([]);

  const {
    date: selectedDate,
    practitioner,
    reason,
    practitioner2,
    reassignedClass,
  } = useWatch({
    control: control,
  });

  const practitionerAbsentName = useMemo(() => {
    return practitioners?.find((item) => {
      if (item?.userId === practitioner) {
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioner, practitioners]);

  const practitionerPresentName = useMemo(() => {
    return practitioners?.find((item) => {
      if (item?.userId === practitioner2) {
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioner2, practitioners]);

  const reassignedClassName = useMemo(() => {
    return classroomGroups?.find((item) => {
      if (item?.id === reassignedClass) {
        return item?.name;
      } else return null;
    });
  }, [classroomGroups, reassignedClass]);

  useEffect(() => {
    const _list = practitioners
      ?.map((p) => {
        if (p?.user?.firstName && p?.user?.surname) {
          return {
            label: `${p?.user?.firstName} ${p?.user?.surname}`,
            value: p.userId,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setPractitionersList(_list);
    setPractitionersTeachList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const _list = absentInfo?.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
    setAbsentInfoList(_list);
  }, []);

  useEffect(() => {
    const _list = classroomGroups
      ?.map((p) => {
        if (p?.name) {
          return {
            label: `${p?.name}`,
            value: p.id,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setClassroomGroupsList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitReassignClass = async () => {
    if (
      userAuth?.auth_token &&
      selectedDate &&
      userData?.id &&
      reassignedClass
    ) {
      await new ClassroomGroupService(
        userAuth.auth_token
      ).updateReassignClassroomGroup(
        practitioner,
        practitioner2,
        reason,
        new Date(selectedDate),
        userData?.id,
        reassignedClass
      );
      await refreshClassroom();
    }

    history.push(ROUTES.DASHBOARD);
  };

  return (
    <BannerWrapper
      title={`Progress summary`}
      subTitle={`${
        formattedDate ? formattedDate : format(new Date(), 'EEEE, d LLLL')
      }`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => history.push(ROUTES.CLASSROOM.ROOT)}
      // displayOffline={!isOnline}
    >
      <div className="mb-3 flex w-full flex-wrap justify-center">
        <Typography
          type="h2"
          color="textMid"
          text={'Reassign a class'}
          className="mt-6"
        />
        <Typography
          type="body"
          color="textMid"
          text={
            'If a practitioner is absent, you can assign their class to a different practitioner.'
          }
          className="w-11/12"
        />
        <label className="text-md mt-2 mb-1 block w-11/12 font-medium text-gray-700">
          What date would you like to reassign the class?
        </label>
        <DatePicker
          placeholderText={`Please select a date`}
          wrapperClassName="text-center"
          className="border-uiLight text-textMid mx-auto w-11/12 rounded-md"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onChange={(date: Date) => {
            setReassignClassValue('date', date ? date.toString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
        />
        <Dropdown
          placeholder={'Select the class'}
          list={classroomGroupsList || []}
          fillType="clear"
          label={'Which class needs the assignment?'}
          fullWidth
          className={'mt-3 w-11/12'}
          selectedValue={reassignedClass}
          onChange={(item: any) => {
            setReassignClassValue('reassignedClass', item);
          }}
        />
        <Dropdown
          placeholder={'Select practitioner'}
          list={practitionersList || []}
          fillType="clear"
          label={'Which practitioner is absent on this date?'}
          fullWidth
          className={'mt-3 w-11/12'}
          selectedValue={practitioner}
          onChange={(item: any) => {
            setReassignClassValue('practitioner', item);
            setPractitionersTeachList(
              practitionersList.filter((prac) => prac.value !== item)
            );
          }}
        />
        <Dropdown
          placeholder={'Select practitioner'}
          list={practitionersTeachList || []}
          fillType="clear"
          label={'Which practitioner will teach this class instead?'}
          fullWidth
          className={'mt-3 w-11/12'}
          onChange={(item: any) => {
            setReassignClassValue('practitioner2', item);
          }}
        />
        <Dropdown
          placeholder={'Select reason'}
          list={absentInfoList}
          fillType="clear"
          label={'Why is the practitioner absent?'}
          fullWidth
          className={'mt-3 w-11/12'}
          onChange={(item: any) => {
            setReassignClassValue('reason', item);
          }}
        />
        {practitioner && selectedDate && reason && (
          <div className="bg-infoBb mt-3 flex w-11/12 rounded-lg py-2">
            <InformationCircleIcon className="text-infoDark mr-1 h-14 w-14 p-2" />
            <Typography
              type="body"
              color="textMid"
              text={`You are reassigning ${
                practitionerAbsentName?.user?.fullName
              } class ${reassignedClassName?.name} to ${
                practitionerPresentName?.user?.fullName
              } for ${format(new Date(selectedDate), 'EEEE, d LLLL')}.`}
              className="mr-1"
            />
          </div>
        )}
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-4 w-11/12 rounded-xl'}
          onClick={submitReassignClass}
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
    </BannerWrapper>
  );
};

export default ReassignClass;
