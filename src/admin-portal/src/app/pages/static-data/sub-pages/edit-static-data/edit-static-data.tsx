import { DocumentNode, useMutation, useQuery } from '@apollo/client';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import {
  CreateEducation,
  CreateGender,
  CreateGrant,
  CreateLanguage,
  CreateProgrammeAttendanceReason,
  CreateProvince,
  CreateRace,
  CreateReasonForLeaving,
  CreateRelation,
  DeleteEducation,
  DeleteGender,
  DeleteGrant,
  DeleteLanguage,
  DeleteProgrammeAttendanceReason,
  DeleteProvince,
  DeleteRace,
  DeleteReasonForLeaving,
  DeleteRelation,
  EducationInput,
  GenderInput,
  GenderList,
  GetAllEducation,
  GetAllGrant,
  GetAllLanguage,
  GetAllProgrammeAttendanceReason,
  GetAllProvince,
  GetAllRace,
  GetAllReasonForLeaving,
  GetAllRelation,
  GrantInput,
  LanguageInput,
  ProgrammeAttendanceReasonInput,
  ProvinceInput,
  RaceInput,
  ReasonForLeavingInput,
  RelationInput,
  UpdateEducation,
  UpdateGender,
  UpdateGrant,
  UpdateLanguage,
  UpdateProgrammeAttendanceReason,
  UpdateProvince,
  UpdateRace,
  UpdateReasonForLeaving,
  UpdateRelation,
} from '@ecdlink/graphql';
import {
  ActionModal,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { newGuid } from '../../../../utils/uuid.utils';
import { XIcon } from '@heroicons/react/solid';

interface EditStaticDataProps {
  query: string | DocumentNode;
  onCancel?: () => void;
  section?: any;
}

export const EditStaticData: React.FC<EditStaticDataProps> = ({
  query,
  onCancel,
  section,
}) => {
  const handleCreateQuery = (query) => {
    switch (query) {
      case 'GetAllGender':
        return CreateGender;
      case 'GetAllRace':
        return CreateRace;
      case 'GetAllProgrammeAttendanceReason':
        return CreateProgrammeAttendanceReason;
      case 'GetAllLanguage':
        return CreateLanguage;
      case 'GetAllProvince':
        return CreateProvince;
      case 'GetAllGrant':
        return CreateGrant;
      case 'GetAllEducation':
        return CreateEducation;
      case 'GetAllRelation':
        return CreateRelation;
      default:
        return CreateReasonForLeaving;
    }
  };

  const handleUpdateQuery = (query) => {
    switch (query) {
      case 'GetAllGender':
        return UpdateGender;
      case 'GetAllRace':
        return UpdateRace;
      case 'GetAllProgrammeAttendanceReason':
        return UpdateProgrammeAttendanceReason;
      case 'GetAllLanguage':
        return UpdateLanguage;
      case 'GetAllProvince':
        return UpdateProvince;
      case 'GetAllGrant':
        return UpdateGrant;
      case 'GetAllEducation':
        return UpdateEducation;
      case 'GetAllRelation':
        return UpdateRelation;
      default:
        return UpdateReasonForLeaving;
    }
  };

  const handleDeleteQuery = (query) => {
    switch (query) {
      case 'GetAllGender':
        return DeleteGender;
      case 'GetAllRace':
        return DeleteRace;
      case 'GetAllProgrammeAttendanceReason':
        return DeleteProgrammeAttendanceReason;
      case 'GetAllLanguage':
        return DeleteLanguage;
      case 'GetAllProvince':
        return DeleteProvince;
      case 'GetAllGrant':
        return DeleteGrant;
      case 'GetAllEducation':
        return DeleteEducation;
      case 'GetAllRelation':
        return DeleteRelation;
      default:
        return DeleteReasonForLeaving;
    }
  };

  const { setNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [create] = useMutation(handleCreateQuery(query));
  const [update] = useMutation(handleUpdateQuery(query));
  const key = query as string;
  const [deleteMutation] = useMutation(handleDeleteQuery(query));
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);
  const [displaySaveForm, setDisplaySaveForm] = useState(false);

  const findQuery = (query) => {
    switch (query) {
      case 'GetAllGender':
        return GenderList;
      case 'GetAllRace':
        return GetAllRace;
      case 'GetAllProgrammeAttendanceReason':
        return GetAllProgrammeAttendanceReason;
      case 'GetAllLanguage':
        return GetAllLanguage;
      case 'GetAllProvince':
        return GetAllProvince;
      case 'GetAllGrant':
        return GetAllGrant;
      case 'GetAllEducation':
        return GetAllEducation;
      case 'GetAllRelation':
        return GetAllRelation;
      default:
        return GetAllReasonForLeaving;
    }
  };

  const { data, refetch } = useQuery(findQuery(query), {
    variables: {
      pagingInput: {
        filterBy: [
          {
            fieldName: 'isActive',
            filterType: 'EQUALS',
            value: 'true',
          },
        ],
        pageNumber: 0,
        pageSize: 0,
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const [dataValues, setDataValues] = useState(
    data?.[key]?.filter((item) => item?.isActive === true)
  );

  const dataValuesDescriptionLength =
    query === 'GetAllProgrammeAttendanceReason'
      ? dataValues?.filter(
          (item) => item?.reason !== '' && item?.reason !== null
        )
      : dataValues?.filter((item) => item?.description !== '');

  const handleInputModels = useCallback((item: any) => {
    if (query === 'GetAllGender') {
      const inputModel: GenderInput = {
        Id: item?.id ?? undefined,
        Description: item?.description,
        IsActive: true,
      };

      return inputModel;
    }

    if (query === 'GetAllRace') {
      const inputModel: RaceInput = {
        Id: item?.id ?? undefined,
        Description: item?.description,
        IsActive: true,
      };

      return inputModel;
    }

    if (query === 'GetAllProgrammeAttendanceReason') {
      const inputModel: ProgrammeAttendanceReasonInput = {
        Id: item?.id ?? undefined,
        Reason: item?.reason,
        IsActive: true,
      };

      return inputModel;
    }

    if (query === 'GetAllLanguage') {
      const inputModel: LanguageInput = {
        Id: item?.id ?? undefined,
        Description: item?.description,
        Locale: item?.locale,
        IsActive: true,
      };

      return inputModel;
    }

    if (query === 'GetAllProvince') {
      const inputModel: ProvinceInput = {
        Id: item?.id ?? undefined,
        Description: item?.description,
        IsActive: true,
      };

      return inputModel;
    }

    if (query === 'GetAllGrant') {
      const inputModel: GrantInput = {
        Id: item?.id ?? undefined,
        Description: item?.description,
        IsActive: true,
      };

      return inputModel;
    }

    if (query === 'GetAllEducation') {
      const inputModel: EducationInput = {
        Id: item?.id ?? undefined,
        Description: item?.description,
        IsActive: true,
      };

      return inputModel;
    }

    if (query === 'GetAllRelation') {
      const inputModel: RelationInput = {
        Id: item?.id ?? undefined,
        Description: item?.description,
        IsActive: true,
      };

      return inputModel;
    }

    if (query === 'GetAllReasonForLeaving') {
      const inputModel: ReasonForLeavingInput = {
        Id: item?.id ?? undefined,
        Description: item?.description,
        IsActive: true,
      };

      return inputModel;
    }
  }, []);

  const onChange = (e, idx) => {
    let newArray = [...dataValues];
    if (query === 'GetAllProgrammeAttendanceReason') {
      newArray[idx] = { ...newArray[idx], reason: e.target.value };

      setDataValues(newArray);

      return;
    }
    newArray[idx] = { ...newArray[idx], description: e.target.value };

    setDataValues(newArray);
  };

  const onLocaleChange = (e, idx) => {
    let newArray = [...dataValues];
    newArray[idx] = { ...newArray[idx], locale: e.target.value };

    setDataValues(newArray);
  };

  useEffect(() => {
    if (data) {
      const activeItems = data?.[key]?.filter(
        (item) => item?.isActive === true
      );

      if (activeItems?.length < 20) {
        const emptyArray = [];
        const inputLimit =
          query === 'GetAllLanguage'
            ? 20 - activeItems?.length
            : 10 - activeItems?.length;

        if (query === 'GetAllLanguage') {
          for (let i = 0; i < inputLimit; i++) {
            emptyArray?.push({
              description: '',
              id: '',
              __typename: '',
              locale: '',
            });
          }

          setDataValues([...activeItems, ...emptyArray]);

          return;
        }

        if (query === 'GetAllProgrammeAttendanceReason') {
          for (let i = 0; i < inputLimit; i++) {
            emptyArray?.push({
              reason: '',
              id: '',
              __typename: '',
            });
            setDataValues([...activeItems, ...emptyArray]);
          }

          return;
        }

        for (let i = 0; i < inputLimit; i++) {
          emptyArray?.push({
            description: '',
            id: '',
            __typename: '',
          });
        }

        setDataValues([...activeItems, ...emptyArray]);

        return;
      }
      setDataValues(data?.[key]?.filter((item) => item?.isActive === true));
    }
  }, [data, key, query]);

  let filteredArr = useMemo(
    () =>
      query === 'GetAllLanguage'
        ? dataValues?.filter((o1) => {
            return data?.[key].every(
              (o2) =>
                (o2.description !== o1.description &&
                  o1?.description !== '' &&
                  o2.locale !== o1.locale &&
                  o1?.locale !== '') ||
                (o1?.description === '' && o1?.id)
            );
          })
        : query === 'GetAllProgrammeAttendanceReason'
        ? dataValues?.filter((o1) => {
            return data?.[key]
              ?.filter((item) => item?.isActive !== false)
              .every(
                (o2) =>
                  (o2.reason !== o1.reason && o1?.reason !== '') ||
                  (o1?.reason === '' && o1?.id)
              );
          })
        : dataValues?.filter((o1) => {
            return data?.[key]
              ?.filter((item) => item?.isActive !== false)
              .every(
                (o2) =>
                  (o2.description !== o1.description &&
                    o1?.description !== '') ||
                  (o1?.description === '' && o1?.id)
              );
          }),
    [data, dataValues, key, query]
  );

  const disabled =
    filteredArr?.length === 0 || dataValuesDescriptionLength?.length === 0;

  const onSubmit = async () => {
    filteredArr?.map(async (item) => {
      const inputModel = handleInputModels(item);
      setIsLoading(true);
      if (
        (item?.id && item?.description === '') ||
        (item?.id &&
          query === 'GetAllProgrammeAttendanceReason' &&
          (item?.reason === '' || item?.reason === null))
      ) {
        deleteMutation({
          variables: {
            id: item.id,
          },
        })
          .then((response: any) => {
            if (response) {
              refetch();
              onCancel();
              setNotification({
                title: `Changes saved`,
                variant: NOTIFICATION.SUCCESS,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
        return;
      }
      if (!item?.id) {
        let newInputModel = inputModel;
        newInputModel.Id = newGuid();

        await create({
          variables: {
            input: { ...newInputModel },
          },
        })
          .then((response) => {
            if (response.data && response.data) {
              setNotification({
                title: `Changes saved`,
                variant: NOTIFICATION.SUCCESS,
              });
              // setEdit(true);
            }
            setIsLoading(false);
            onCancel();
            // create the redirect to the main list
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setIsLoading(true);
        await update({
          variables: {
            id: item?.id,
            input: { ...inputModel },
          },
        })
          .then((response) => {
            setNotification({
              title: `Changes saved!`,
              variant: NOTIFICATION.SUCCESS,
            });
            onCancel();
            // create the redirect to the main list
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  useEffect(() => {
    if (filteredArr?.length > 0) {
      setFormIsDirty(true);
    } else {
      setFormIsDirty(false);
    }
  }, [filteredArr?.length]);

  return (
    <div className="w-full p-4">
      {formIsDirty && (
        <div className="focus:outline-none focus:ring-primary absolute right-5 -top-20 z-10 mt-6 flex h-7 items-center rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2">
          <button
            className="focus:outline-none focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2"
            onClick={() => setDisplayFormIsDirty(true)}
          >
            <span className="sr-only">Close panel</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}
      <Typography
        weight="semibold"
        type={'h1'}
        color={'textDark'}
        text={`${section?.name} - edit`}
        className="pt-4"
      ></Typography>
      <Typography
        type={'body'}
        color={'textMid'}
        className="pt-2"
        text={'Step 1 of 1'}
      />
      <Divider dividerType="dashed" className="my-4" />
      <Typography
        type={'h4'}
        color={'textMid'}
        className="pt-4"
        text={'Response options *'}
      />
      <Typography
        type={'body'}
        color={'textMid'}
        className="pt-2"
        text={`You must include a minimum of 1 and maximum of ${
          query === 'GetAllLanguage' ? '20' : '10'
        } options.`}
      />

      {dataValues &&
        dataValues?.length > 0 &&
        dataValues?.map((item, idx: number) => {
          if (query === 'GetAllLanguage') {
            return (
              <div>
                <div className="flex items-center gap-2" key={idx}>
                  <FormInput
                    className="bg-adminPortalBg my-4 w-9/12"
                    id={item?.id}
                    value={item?.reason || item?.description}
                    // disabled={isViewAnswers}
                    onChange={(e) => onChange(e, idx)}
                    textInputType="input"
                    placeholder={'Add a response...'}
                    error={
                      dataValuesDescriptionLength?.length === 0 && idx === 0
                        ? 'This field is required'
                        : ('' as any)
                    }
                    maxLength={24}
                  />

                  <FormInput
                    className="bg-adminPortalBg my-4 w-3/12"
                    id={item?.id}
                    value={item?.locale}
                    // disabled={isViewAnswers}
                    onChange={(e) => onLocaleChange(e, idx)}
                    textInputType="input"
                    placeholder={'Add a code...'}
                    maxLength={24}
                  />
                </div>
                {dataValuesDescriptionLength?.length === 0 && idx === 0 && (
                  <Typography
                    type={'help'}
                    color={'errorMain'}
                    text={`This field is required`}
                  />
                )}
              </div>
            );
          }
          return (
            <div>
              <FormInput
                key={idx}
                className="bg-adminPortalBg my-4"
                id={item?.id}
                value={item?.reason || item?.description}
                // disabled={isViewAnswers}
                onChange={(e) => onChange(e, idx)}
                textInputType="input"
                placeholder={'Add a response...'}
                error={
                  dataValuesDescriptionLength?.length === 0 && idx === 0
                    ? 'This field is required'
                    : ('' as any)
                }
                maxLength={24}
              />
              {dataValuesDescriptionLength?.length === 0 && idx === 0 && (
                <Typography
                  type={'help'}
                  color={'errorMain'}
                  text={`This field is required`}
                />
              )}
            </div>
          );
        })}
      <Button
        type="filled"
        color="secondary"
        className={'mx-auto mt-8 w-full rounded-2xl'}
        onClick={() => setDisplaySaveForm(true)}
        disabled={disabled}
        isLoading={isLoading}
      >
        {renderIcon('SaveIcon', 'h-4 w-4 text-white mr-2')}
        <Typography
          type="help"
          className="mr-2"
          color="white"
          text={'Save'}
        ></Typography>
      </Button>

      <Dialog
        className="px-60"
        stretch
        visible={displayFormIsDirty}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Discard unsaved changes?`}
          detailText={'If you leave now, you will lose all of your changes.'}
          buttonClass="rounded-2xl"
          actionButtons={[
            {
              text: 'Keep editing',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => setDisplayFormIsDirty(false),
              leadingIcon: 'PencilIcon',
            },
            {
              text: 'Discard changes',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: () => {
                onCancel();
              },
              leadingIcon: 'TrashIcon',
            },
          ]}
        />
      </Dialog>
      <Dialog
        className="px-60"
        stretch
        visible={displaySaveForm}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to update the ${section?.name} field?`}
          detailText={
            'This will change what users see on the app and will affect reports and dashboards.'
          }
          buttonClass="rounded-2xl"
          actionButtons={[
            {
              text: 'Yes, confirm',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: () => {
                onSubmit();
              },
              leadingIcon: 'CheckIcon',
            },
            {
              text: 'No, continue editing',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => setDisplaySaveForm(false),
              leadingIcon: 'XIcon',
            },
          ]}
        />
      </Dialog>
    </div>
  );
};
