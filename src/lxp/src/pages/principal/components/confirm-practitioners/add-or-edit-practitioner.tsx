import {
  Typography,
  FormInput,
  Button,
  Alert,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  LoadingSpinner,
  CheckboxGroup,
} from '@ecdlink/ui';
import { UserDto } from '@ecdlink/core';
import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  AddPractitionerModel,
  addPractitionerSchema,
  initialAddPractitionerValues,
} from '@/schemas/practitioner/add-practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { RegisterPractitioner } from '../../setup-principal/setup-principal.types';
import { UserIcon } from '@heroicons/react/solid';
import {
  AddPractitinerInitialState,
  AddNewPractitionerModel,
} from '../add-practitioner/add-practitioner.types';
import {
  practitionerActions,
  practitionerSelectors,
} from '@/store/practitioner';
import { useTenant } from '@/hooks/useTenant';
import { staticDataSelectors } from '@/store/static-data';
import { useAppDispatch } from '@/store';
import PermissionsService from '@/services/PermissionsService/PermissionsService';
import { UpdateUserPermissionInputModelInput } from '@ecdlink/graphql';

export const AddOrEditPractitioner = ({
  onSubmit,
  formData,
  listItems,
}: {
  onSubmit: (data: RegisterPractitioner) => void;
  formData?: AddPractitionerModel;
  listItems?: any[];
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const dispatch = useAppDispatch();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const {
    register,
    control,
    formState: { errors, isValid },
    getValues,
    setValue,
    reset,
  } = useForm<AddPractitionerModel>({
    resolver: yupResolver(addPractitionerSchema),
    defaultValues: Boolean(formData) ? formData : initialAddPractitionerValues,
    mode: 'onChange',
  });

  const [isValidPractitioner, setIsValidPractitioner] = useState<boolean>();
  const [isPractitionerRegistered, setIsPractitionerRegistered] =
    useState<boolean>();
  const [isPrincipal, setIsPrincipal] = useState<boolean>(false);
  const [newPractitioner, setNewPractitioner] =
    useState<AddNewPractitionerModel>(AddPractitinerInitialState);
  const [addNote, setAddNote] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const permissions = useSelector(staticDataSelectors.getPermissions);

  console.log({ permissions });

  const [permissionsAdded, setPermissionsAdded] = useState<string[]>([]);
  console.log({ permissionsAdded });
  const { preferId, idNumber, passport } = useWatch({
    control,
  });
  const [isLoading, setIsLoading] = useState(false);

  const getPractitionerDetailsByIdNumber = async () => {
    // Check if the practitioner exists
    let _practitioner: UserDto = {} as UserDto;

    if (userAuth && idNumber) {
      setIsLoading(true);
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(idNumber);
      setIsLoading(false);
    }
    if (userAuth && passport) {
      setIsLoading(true);
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(passport);
      setIsLoading(false);
    }
    return _practitioner;
  };

  const handleSearch = () => {
    let validPassportOrIdNumber = true;
    // if (idNumber) {
    //   setIsValidPractitioner(undefined);
    //   validPassportOrIdNumber = SA_ID_REGEX.test(idNumber);
    // }

    // if (passport) {
    //   setIsValidPractitioner(undefined);
    //   validPassportOrIdNumber = SA_PASSPORT_REGEX.test(passport);
    // }

    if (validPassportOrIdNumber) {
      getPractitionerDetailsByIdNumber().then((p: any) => {
        setIsPrincipal(p?.appUser?.practitionerObjectData?.isPrincipal);

        if (p?.note !== undefined) {
          setAddNote(p?.note);
        }
        if (
          p?.appUser?.practitionerObjectData?.isRegistered === false ||
          p?.appUser?.practitionerObjectData?.isRegistered === null
        ) {
          setIsPractitionerRegistered(false);
        }
        if (p?.appUser?.practitionerObjectData?.isRegistered === true) {
          setIsPractitionerRegistered(true);
        }
        setIsValidPractitioner(!!p?.appUser?.idNumber);
        setNewPractitioner({
          firstName: p?.appUser?.firstName,
          surname: p?.appUser?.surname,
          idNumber: p?.appUser?.idNumber,
          userId: p?.appUser?.id,
        });
      });
    }
  };

  useEffect(() => {
    if (isValidPractitioner && newPractitioner) {
      setValue('firstName', newPractitioner.firstName || '', {
        shouldValidate: true,
      });
      setValue('surname', newPractitioner.surname || '', {
        shouldValidate: true,
      });
    }
  }, [isValidPractitioner, newPractitioner, setValue]);

  const handleReset = () => {
    reset(initialAddPractitionerValues);
    setIsValidPractitioner(undefined);
  };

  const handleSubmit = async () => {
    const { firstName, idNumber, passport, surname } = getValues();

    const practitionerUserDetails: any =
      await getPractitionerDetailsByIdNumber();

    const updatePermissionInput: UpdateUserPermissionInputModelInput = {
      userId: practitionerUserDetails?.appUser?.id,
      permissionIds: permissionsAdded,
    };

    const updatePermissions = await new PermissionsService(
      userAuth?.auth_token!
    ).UpdateUserPermission(updatePermissionInput);

    onSubmit({
      id: practitionerUserDetails?.appUser?.practitionerObjectData?.id ?? '',
      userId: practitionerUserDetails?.appUser?.id ?? '',
      idNumber: idNumber || passport,
      firstName: newPractitioner?.firstName || firstName,
      surname: newPractitioner?.surname || surname,
      passport: passport,
      preferId: !!idNumber,
      isRegistered: Boolean(
        practitionerUserDetails?.appUser?.practitionerObjectData?.isRegistered
      ),
      isTrainee: Boolean(
        practitionerUserDetails?.appUser?.practitionerObjectData?.isTrainee
      ),
    });
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  useEffect(() => {
    if (idNumber || passport) {
      setIsEdit(true);
      handleSearch();
    }
  }, []);

  function updateArray(checkbox: any, id: string) {
    console.log({ checkbox });
    if (checkbox.checked) {
      setPermissionsAdded([...permissionsAdded, id]);
    } else {
      const filteredPermissions = permissionsAdded?.filter(
        (item) => item !== id
      );
      setPermissionsAdded(filteredPermissions);
    }
  }

  return (
    <div className="wrapper-with-sticky-button">
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <Typography
            type={'h2'}
            text={`Practitioner ${
              listItems && listItems?.length > 0 && listItems?.length + 1
            }`}
            color={'textDark'}
          />
        </div>
        <div>
          {preferId && (
            <div className="mt-4 flex items-center justify-between">
              <FormInput<AddPractitionerModel>
                label={'Practitioner ID number'}
                visible={true}
                nameProp={'idNumber'}
                register={register}
                error={errors['idNumber']}
                placeholder={'E.g. 7601010338089'}
                className="mr-2 w-full pb-2"
              />
            </div>
          )}
          <div>
            {!preferId && (
              <div className="mt-4 flex items-center justify-between">
                <FormInput<AddPractitionerModel>
                  label={'Practitioner Passport number'}
                  visible={true}
                  nameProp={'passport'}
                  error={errors['passport']}
                  register={register}
                  className="mr-2 w-full pb-2"
                />
              </div>
            )}
            {!preferId && (
              <Button
                className={'mt-3 mb-2'}
                type="outlined"
                color="secondary"
                textColor="secondary"
                background={'transparent'}
                size="small"
                text="Enter ID number instead"
                onClick={() => setValue('preferId', true)}
              />
            )}
            {preferId && (
              <Button
                className={'mt-3 mb-2'}
                textColor="secondary"
                type="outlined"
                color="secondary"
                size="small"
                background={'transparent'}
                text="Enter passport number instead"
                onClick={() => setValue('preferId', false)}
              />
            )}
          </div>
          {(idNumber || passport) && !isEdit && (
            <div>
              <Button
                size="normal"
                className="my-4 w-full"
                type="filled"
                color="quatenary"
                text="Search for practitioner"
                textColor="white"
                icon="SearchIcon"
                onClick={handleSearch}
              />
              <Alert
                className="mt-2 mb-2 rounded-md"
                title={`Fill in the ID number & tap the search button to find out if the practitioner is already using ${appName}.`}
                type="info"
              />
            </div>
          )}
          {isLoading && (
            <LoadingSpinner
              size="medium"
              spinnerColor="quatenary"
              backgroundColor="uiLight"
            />
          )}
        </div>
        {(addNote || isPrincipal) && (
          <div>
            <Alert
              type={'error'}
              title={
                isPrincipal
                  ? 'This practitioner is linked to a different SmartStart programme.'
                  : addNote
              }
              list={[
                'Check if the ID you entered is correct.',
                'Make sure the practitioner is still in your programme.',
                'If your practitioner needs help, please contact the SmartStart call centre.',
              ]}
              button={
                <Button
                  text="Contact call centre"
                  icon="PhoneIcon"
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                  onClick={() => callForHelp()}
                />
              }
            />
          </div>
        )}

        {isValidPractitioner === false && (
          <div className="mb-8">
            <Alert
              type={'error'}
              title={'We do not have this practitioner on record.'}
              list={[
                'Check if the ID you entered is correct.',
                'Make sure the practitioner is a SmartStarter.',
                'If you have entered the correct information, contact the call centre or tap Skip to solve the problem later.',
              ]}
              button={
                <Button
                  text="Contact call centre"
                  icon="PhoneIcon"
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                  onClick={callForHelp}
                />
              }
            />
          </div>
        )}
        {isValidPractitioner === true && !addNote && !isPrincipal && (
          <div className="mb-2">
            <Alert type={'success'} title={'Practitioner found!'} />
          </div>
        )}
        {isValidPractitioner === true && !addNote && (
          <div>
            <Typography type={'h3'} text={`First name`} color={'textMid'} />
            <Typography
              type={'h4'}
              text={`${newPractitioner?.firstName}`}
              color={'textMid'}
            />
            <Typography
              type={'h2'}
              text={`What would you like ${newPractitioner?.firstName} to do on ${appName}?`}
              color={'textDark'}
              className="mt-6"
            />
            <Typography
              type={'body'}
              text={`You can edit this in future by going to the Classroom then Practitioners tab.}`}
              color={'textMid'}
            />
          </div>
        )}
        {isValidPractitioner === true &&
          !addNote &&
          permissions.map((item, index) => (
            <CheckboxGroup
              id={item.id}
              key={item.id}
              title={item?.normalizedName}
              checked={permissionsAdded?.some((option) => option === item.id)}
              value={item.id}
              onChange={(event) => {
                updateArray(event, item?.id!);
              }}
              className="mb-1"
              icon={
                <UserIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
              }
              isIconFullWidth
              checkboxColor="primary"
            />
          ))}
        {/* {!addNote && isPractitionerRegistered !== undefined && !isPrincipal && (
          <div>
            <Alert
              type={isPractitionerRegistered ? 'success' : 'error'}
              title={
                isPractitionerRegistered
                  ? 'This practitioner is registered on Funda app.'
                  : 'This practitioner is not registered on Funda App. Ask all of your SmartStart practitioners to register.'
              }
              list={[
                isPractitionerRegistered
                  ? 'Practitioner has been notified.'
                  : 'If your practitioner needs help, please contact the SmartStart call centre.',
              ]}
              button={
                !isPractitionerRegistered ? (
                  <Button
                    text="Contact call centre"
                    icon="PhoneIcon"
                    type={'filled'}
                    color={'primary'}
                    textColor={'white'}
                    onClick={() => callForHelp()}
                  />
                ) : (
                  <></>
                )
              }
            />
          </div>
        )} */}
      </div>
      <div className="-mb-4 self-end">
        <Button
          size="normal"
          className="mb-4 w-full"
          type="filled"
          color="quatenary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          disabled={
            !isValid || isValidPractitioner === false || addNote || isPrincipal
          }
          onClick={handleSubmit}
        />
        {isValidPractitioner === false && (
          <Button
            size="normal"
            className="mb-4 w-full"
            type="outlined"
            color="primary"
            text="Skip"
            textColor="primary"
            icon="ArrowCircleRightIcon"
            onClick={handleReset}
          />
        )}
      </div>
    </div>
  );
};
