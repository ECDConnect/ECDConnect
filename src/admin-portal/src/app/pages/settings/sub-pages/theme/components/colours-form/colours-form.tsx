import { camelCaseToSentanceCase } from '@ecdlink/core';
import 'react-color-palette/lib/css/styles.css';
import { get } from 'react-hook-form';
import FormColorField from '../../../../../../components/form-color-field/form-color-field';
import { FormComponentProps } from '../../../../../../models/FormComponentProps';
import {
  initialThemeColours,
  ThemeColours,
} from '../../../../../../schemas/themeColours';

import * as styles from './colours-form.styles';

export function ColoursForm({
  errors,
  register,
  getValues,
  setValue,
}: FormComponentProps<ThemeColours>) {
  const getFormFields = () => {
    const keys = Object.keys(initialThemeColours);
    const colours = getValues();
    const colorKeys = Object.keys(colours);

    return keys.map((key, idx) => {
      const colorKey = colorKeys.find((x) => x === key);
      // @ts-ignore
      const color = colours[colorKey];
      const error = get(errors, key);
      return (
        <div key={`theme-colour-form-field-${idx}`} className="sm:col-span-3">
          <FormColorField
            setValue={setValue}
            currentColor={color ?? ''}
            label={camelCaseToSentanceCase(key)}
            nameProp={key}
            register={register}
            error={error ? error.message : ''}
          />
        </div>
      );
    });
  };

  return (
    <form
      key={`themecoloursForm:${new Date().getTime()}`}
      className={styles.form}
    >
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
        {getFormFields()}
      </div>
    </form>
  );
}
