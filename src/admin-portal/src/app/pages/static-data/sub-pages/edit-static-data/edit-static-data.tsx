import { DocumentNode, useQuery } from '@apollo/client';
import {
  GenderList,
  GetAllEducation,
  GetAllGrant,
  GetAllLanguage,
  GetAllProgrammeAttendanceReason,
  GetAllProvince,
  GetAllRace,
  GetAllReasonForLeaving,
  GetAllRelation,
} from '@ecdlink/graphql';
import { Divider, FormInput, Typography } from '@ecdlink/ui';
import { useState } from 'react';

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
  const key = query as string;
  const findQuery = (query) => {
    if (query === 'getAllGender') {
      return GenderList;
    }
    if (query === 'GetAllRace') {
      return GetAllRace;
    }
    if (query === 'GetAllProgrammeAttendanceReason') {
      return GetAllProgrammeAttendanceReason;
    }
    if (query === 'GetAllLanguage') {
      return GetAllLanguage;
    }
    if (query === 'GetAllProvince') {
      return GetAllProvince;
    }
    if (query === 'GetAllGrant') {
      return GetAllGrant;
    }

    if (query === 'GetAllEducation') {
      return GetAllEducation;
    }
    if (query === 'GetAllRelation') {
      return GetAllRelation;
    }
    if (query === 'GetAllReasonForLeaving') {
      return GetAllReasonForLeaving;
    }
    return GetAllReasonForLeaving;
  };

  const { data, refetch } = useQuery(findQuery(query), {
    fetchPolicy: 'cache-and-network',
  });
  const [dataValues, setDataValues] = useState(data?.[key]);
  console.log({ dataValues });
  const onChange = (e) => {
    const id = e?.target?.id;
    const changedItem = dataValues?.find((item) => item?.id === id);
    const filteredItems = dataValues?.filter((item) => item?.id !== id);
    let changedItemMapped = Object.assign({}, changedItem);
    changedItemMapped = { ...changedItemMapped, description: e.target.value };
    console.log({ changedItem });
    console.log({ filteredItems });
    const { name, value, checked, type } = e.target;
    console.log(e);

    setDataValues([...filteredItems, changedItemMapped]);
  };

  console.log({ data });
  console.log(data?.[key]?.length);
  console.log({ query });
  return (
    <div className="w-full p-4">
      <div className="absolute right-4" onClick={onCancel}>
        X
      </div>
      <Typography
        weight="semibold"
        type={'h1'}
        color={'textDark'}
        text={`${section?.name} - edit`}
        className="pt-8"
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
        text={'You must include a minimum of 1 and maximum of 10 options.'}
      />

      {dataValues &&
        dataValues?.length > 0 &&
        dataValues?.map((item, idx) => {
          return (
            <FormInput
              className="bg-adminPortalBg my-4"
              id={item?.id}
              value={item?.reason || item?.description}
              // disabled={isViewAnswers}
              onChange={(e) => onChange(e)}
              textInputType="input"
              placeholder={'Add a response...'}
            />
          );
        })}
    </div>
  );
};
