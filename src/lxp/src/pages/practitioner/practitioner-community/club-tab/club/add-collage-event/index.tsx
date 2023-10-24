import {
  Alert,
  BannerWrapper,
  Button,
  FormInput,
  ImageInput,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';

export const AddCollageEvent: React.FC = () => {
  const acceptedFormats = ['jpg', 'pdf', 'jpeg'];

  const isLoading = false;

  const history = useHistory();

  const onSubmit = async () => {};

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Be creative"
      subTitle="step 1 of 1"
      onBack={() => history.goBack()}
    >
      <Typography type="h2" text="Be creative" className="mb-4" />
      <Typography type="h4" text="Add your collage photo" className="mb-2" />
      <ol className="mb-2 list-decimal pl-4">
        {[
          'the material used',
          'lub making the resource',
          'the final product',
        ].map((item) => (
          <li className="text-textMid text-14">{item}</li>
        ))}
      </ol>
      <ImageInput
        className="mb-4"
        acceptedFormats={acceptedFormats}
        label=""
        nameProp="maternalCaseRecord"
        icon="CameraIcon"
        iconContainerColor="tertiary"
        currentImageString={''}
        overrideOnClick={() => {}}
        onValueChange={(imageString: string) => {}}
      />
      <FormInput
        textInputType="textarea"
        label="Add a description"
        placeholder="e.g. Made puppets for this month’s theme."
      />
      <Alert
        className="my-4"
        type="warning"
        title="You will not be able to edit this after saving."
        list={[
          'Please make sure all the information you have entered is correct and final.',
          'Your club can only submit 1 “Be creative” image per month.',
        ]}
      />
      <Button
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        isLoading={isLoading}
        disabled
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
