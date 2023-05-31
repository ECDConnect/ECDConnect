import { Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';

export const Step6 = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const visitSection = 'Step 6';

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="6. Interactive storytelling that introduces children to new language & learning"
        color="textDark"
      />
      <Typography
        type="h4"
        text={new Date().toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
        color="textMid"
      />
    </div>
  );
};
