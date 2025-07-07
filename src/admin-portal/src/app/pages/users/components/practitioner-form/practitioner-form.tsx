import { useQuery } from '@apollo/client';
import { UseFormRegister } from 'react-hook-form';
import { GetAllPortalCoaches } from '@ecdlink/graphql';
import { Dropdown, SearchDropDownOption } from '@ecdlink/ui';
import { useTenant } from '../../../../hooks/useTenant';

export interface PractitionerFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
  coachQueryVariables?: any;
  practitionerGetValues?: any;
  practitionerSetValue?: any;
}

const PractitionerForm: React.FC<PractitionerFormProps> = ({
  formKey,
  errors,
  register,
  coachQueryVariables,
  practitionerGetValues,
  practitionerSetValue,
}) => {
  const {
    data: coachData,
    refetch,
    loading,
  } = useQuery(GetAllPortalCoaches, {
    variables: coachQueryVariables,
    fetchPolicy: 'network-only',
  });

  const tenant = useTenant();
  const coachRoleName = tenant?.modules?.coachRoleName;

  const coachesDropdownArray: SearchDropDownOption<string>[] =
    coachData?.allPortalCoaches?.map((item) => ({
      id: item?.userId,
      label: item?.user?.fullName || item?.user?.firstName,
      value: item?.userId,
    }));

  // const { data: principalData } = useQuery(GetAllPractitioner, {
  //   fetchPolicy: 'cache-and-network',
  // });

  return (
    <form key={formKey} className="w-full space-y-4">
      <div className="space-y-4">
        <div className="w-full">
          <div className="w-full">
            <Dropdown<string>
              label={`Practitioner's ${coachRoleName?.toLowerCase()}`}
              subLabel={`Optional. You will need to add the ${coachRoleName?.toLowerCase()} to the admin portal before you can connect them to a practitioner.`}
              fillType="filled"
              textColor="textLight"
              fillColor="adminPortalBg"
              placeholder={'Type to search...'}
              labelColor="textMid"
              list={coachesDropdownArray || []}
              selectedValue={practitionerGetValues()?.coachHierarchy || ''}
              onChange={(item) => practitionerSetValue('coachHierarchy', item)}
              showSearch
              isAdminPortalInput={true}
              className="my-2"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PractitionerForm;
