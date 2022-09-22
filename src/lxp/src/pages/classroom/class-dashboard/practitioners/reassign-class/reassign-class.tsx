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
import {
  ReassignClassModel,
  reassignClassSchema,
} from '@/schemas/practitioner/reassign-class';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { InformationCircleIcon } from '@heroicons/react/solid';
import * as styles from './reassign-class.styles';
import {
  practitionerActions,
  practitionerSelectors,
} from '@/store/practitioner';
import { useSelector } from 'react-redux';

const mockedData = [
  {
    id: 1,
    title: 'John Buffalo',
    subTitle: 'Progress report overdue',
    avatarColor: '#6974af',
    profileText: 'Jb',
    alertSeverity: 'error',
    phoneNumber: '2138471324',
    email: 'johnbf@gmail.com',
  },
  {
    id: 2,
    title: 'Pedro Machado',
    subTitle: 'Progress report overdue',
    avatarColor: '#6974af',
    profileText: 'Pm',
    alertSeverity: 'error',
    phoneNumber: '23984123490',
    email: 'pedroM@gmail.com',
  },
  {
    id: 3,
    title: 'Carlos Vieira',
    subTitle: 'Progress report overdue',
    avatarColor: '#6974af',
    profileText: 'Cv',
    alertSeverity: 'error',
    phoneNumber: '314874393',
    email: 'carlosvieira1234@gmail.com',
  },
];

const absentInfo = [
  {
    id: 1,
    name: 'Sick',
  },
  {
    id: 1,
    name: 'Traveling',
  },
  {
    id: 1,
    name: 'Another class',
  },
  {
    id: 1,
    name: 'Other',
  },
];

export const ReassignClass: React.FC<ComponentBaseProps> = () => {
  const history = useHistory();
  const { state: routeState } = useLocation<ReassignClassPageState>();
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const reportingDate = routeState?.reportingDate
    ? new Date(routeState?.reportingDate)
    : new Date();
  const practitionerId = routeState?.practitionerId;
  const formattedDate = reportingDate
    ? format(reportingDate, 'EEEE, d LLLL')
    : '';
  console.log({ practitionerId });
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

  const {
    date: selectedDate,
    practitioner,
    reason,
    practitioner2,
  } = useWatch({
    control: control,
  });

  const practitionerAbsentName = useMemo(() => {
    return practitioners?.find((item) => {
      if (item?.userId === practitioner) {
        const userName = item?.user?.fullName;
        console.log({ userName });
        return userName;
      } else return null;
    });
  }, [practitioner, practitioners]);

  const practitionerPresentName = useMemo(() => {
    return practitioners?.find((item) => {
      if (item?.userId === practitioner2) {
        console.log({ item });
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioner2, practitioners]);

  console.log({
    practitionerAbsentName,
    practitionerPresentName,
    practitionerId,
  });

  console.log({ practitioners });
  console.log({ selectedDate, practitioner, reason, practitioner2 });

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

    // _list.push({
    //   label: currentPractitioner?.user?.fullName || '',
    //   value: currentPractitioner?.userId,
    // });

    console.log({ _list });

    setPractitionersList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BannerWrapper
        title={`Progress summary`}
        subTitle={`${
          formattedDate ? formattedDate : format(new Date(), 'EEEE, d LLLL')
        }`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.push(ROUTES.CLASSROOM)}
        // displayOffline={!isOnline}
      />
      <div className="flex flex-wrap w-full justify-center">
        <div className="ml-3 flex flex-wrap justify-center">
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
          <label className="block w-11/12 text-md font-medium text-gray-700 mt-2 mb-1">
            What date would you like to reassign the class?
          </label>
          {practitionerId ? (
            <DatePicker
              placeholderText={`Please select a date`}
              className="w-11/12 border-uiLight rounded-md mx-auto text-textMid"
              selected={new Date()}
              onChange={(date: Date) =>
                setReassignClassValue('date', date ? date.toString() : '')
              }
              dateFormat="EEE, dd MMM yyyy"
              minDate={new Date()}
            />
          ) : (
            <DatePicker
              placeholderText={`Please select a date`}
              className="w-11/12 border-uiLight rounded-md mx-auto text-textMid"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onChange={(date: Date) =>
                setReassignClassValue('date', date ? date.toString() : '')
              }
              dateFormat="EEE, dd MMM yyyy"
              minDate={new Date()}
            />
          )}
          <Dropdown
            placeholder={'Select practitioner'}
            list={(practitionersList && practitionersList) || []}
            fillType="clear"
            label={'Which practitioner is absent on this date?'}
            fullWidth
            className={'mt-3 w-11/12'}
            selectedValue={practitioner}
            onChange={(item: any) => {
              setReassignClassValue('practitioner', item);
            }}
          />
          <Dropdown
            placeholder={'Select practitioner'}
            list={(practitionersList && practitionersList) || []}
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
            list={
              (absentInfo &&
                absentInfo.map((item) => {
                  return {
                    label: item.name,
                    value: item.name,
                  };
                })) ||
              []
            }
            fillType="clear"
            label={'Why is the practitioner absent?'}
            fullWidth
            className={'mt-3 w-11/12'}
            onChange={(item: string) => {
              setReassignClassValue('reason', item);
            }}
          />
          {practitioner && selectedDate && reason && (
            <div className="flex mt-3 w-11/12 bg-infoBb rounded-lg py-2">
              <InformationCircleIcon className="h-14 w-14 mr-1 p-2 text-infoDark" />
              <Typography
                type="body"
                color="textMid"
                text={`You are reassigning ${
                  practitionerPresentName?.user?.fullName
                } class (Elephants) to ${
                  practitionerPresentName?.user?.fullName
                } for ${format(new Date(selectedDate), 'EEEE, d LLLL')}.`}
                className="mr-1"
              />
            </div>
          )}
          <Button
            type="filled"
            color="primary"
            className={'w-11/12 mx-auto mt-4 rounded-xl'}
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
        </div>
      </div>
    </>
  );
};

export default ReassignClass;
