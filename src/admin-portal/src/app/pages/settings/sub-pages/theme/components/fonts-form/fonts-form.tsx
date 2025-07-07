import FormField from '../../../../../../components/form-field/form-field';
import { FormComponentProps } from '../../../../../../models/FormComponentProps';
import { ThemeFonts } from '../../../../../../schemas/themeFonts';

export function FontsForm({
  register,
  errors,
}: FormComponentProps<ThemeFonts>) {
  return (
    <form key={`themefontsForm:${new Date().getTime()}`}>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <FormField
            label={'Organisation Font'}
            nameProp={'fontUrl'}
            register={register}
            error={errors ? errors['fontUrl'].message : ''}
          />
        </div>

        <div className="sm:col-span-6">
          <FormField
            label={'H1 Override Font Url'}
            nameProp={'mainHeadingOverrideFontUrl'}
            register={register}
            error={errors ? errors['mainHeadingOverrideFontUrl'].message : ''}
          />
        </div>
      </div>
    </form>
  );
}
