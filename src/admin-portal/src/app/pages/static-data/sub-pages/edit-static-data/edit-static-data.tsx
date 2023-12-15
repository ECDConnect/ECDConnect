import { DocumentNode, useMutation, useQuery } from '@apollo/client';
import { NOTIFICATION, useDialog, useNotifications } from '@ecdlink/core';
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
  Button,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { newGuid } from '../../../../utils/uuid.utils';

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
  console.log({ query });
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
            fieldName: 'description',
            filterType: 'EQUALS',
            value: 'Male',
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
  const disabled = filteredArr?.length === 0;

  const onSubmit = async () => {
    filteredArr?.map(async (item) => {
      const inputModel = handleInputModels(item);
      setIsLoading(true);
      if (
        (item?.id && item?.description === '') ||
        (item?.id && item?.description === '')
      ) {
        deleteMutation({
          variables: {
            id: item.id,
          },
        })
          .then((response: any) => {
            console.log(response);
            if (response) {
              refetch();
              onCancel();
              setNotification({
                title: `Successfully Deleted ${section?.name}`,
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
                title: `Successfully Created ${section?.name}!`,
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
              title: `Successfully Updated ${section?.name}!`,
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

  return (
    <div className="w-full p-4">
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
              <div className="flex items-center gap-2" key={idx}>
                <FormInput
                  className="bg-adminPortalBg my-4 w-9/12"
                  id={item?.id}
                  value={item?.reason || item?.description}
                  // disabled={isViewAnswers}
                  onChange={(e) => onChange(e, idx)}
                  textInputType="input"
                  placeholder={'Add a response...'}
                />
                <FormInput
                  className="bg-adminPortalBg my-4 w-3/12"
                  id={item?.id}
                  value={item?.locale}
                  // disabled={isViewAnswers}
                  onChange={(e) => onLocaleChange(e, idx)}
                  textInputType="input"
                  placeholder={'Add a code...'}
                />
              </div>
            );
          }
          return (
            <FormInput
              key={idx}
              className="bg-adminPortalBg my-4"
              id={item?.id}
              value={item?.reason || item?.description}
              // disabled={isViewAnswers}
              onChange={(e) => onChange(e, idx)}
              textInputType="input"
              placeholder={'Add a response...'}
            />
          );
        })}
      <Button
        type="filled"
        color="secondary"
        className={'mx-auto mt-8 w-full rounded-2xl'}
        onClick={onSubmit}
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
    </div>
  );
};
