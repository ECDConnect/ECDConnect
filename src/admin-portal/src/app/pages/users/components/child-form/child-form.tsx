/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery } from '@apollo/client';
import { GetAllLanguage } from '@ecdlink/graphql';
import {
  LanguageDto,
  initialChildValues,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import { get, UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';

export interface ChildFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const ChildForm: React.FC<ChildFormProps> = ({ formKey, errors, register }) => {
  const { data } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });

  const getFormFields = () => {
    const keys = Object.keys(initialChildValues);

    return keys.map((key, idx) => {
      const error = get(errors, key);

      let type = 'text';

      if (key === 'joinReferencePanel' || key === 'contribution') {
        type = 'checkbox';
      }

      if (key === 'languageId') {
        return (
          <div key={`care-giver-form-${idx}`} className="sm:col-span-3">
            <FormSelectorField
              label="Language"
              nameProp={key}
              register={register}
              options={
                data &&
                data.GetAllLanguage &&
                data.GetAllLanguage.map((x: LanguageDto) => {
                  return { key: x.id, value: x.description };
                })
              }
              error={error ? error.message : ''}
            />
          </div>
        );
      }

      return (
        <div key={`care-giver-form-${idx}`} className="sm:col-span-3">
          <FormField
            label={camelCaseToSentanceCase(key)}
            nameProp={key}
            register={register}
            type={type}
            error={error ? error.message : ''}
          />
        </div>
      );
    });
  };

  return (
    <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {getFormFields()}
      </div>
    </form>
  );
};

export default ChildForm;
