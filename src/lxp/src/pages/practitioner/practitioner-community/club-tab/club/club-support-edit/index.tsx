import {
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  Radio,
  Typography,
  UserAvatar,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';

export const SupportRoleEdit: React.FC = () => {
  const [checkboxValue, setCheckboxValue] = useState(false);

  const location = useLocation();
  const lastPathSegment = location.pathname.split('/').pop();

  const isToChange = lastPathSegment?.includes('edit');

  const isLoading = false;

  const history = useHistory();

  const onSubmit = async () => {};

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={`${isToChange ? 'Change' : 'Assign'} club support`}
      subTitle="step 1 of 1"
      onBack={() => history.goBack()}
    >
      <Typography
        type="h2"
        text="Choose a new club member for the support role"
        className="mb-4"
      />
      <Alert
        className="my-4"
        type="info"
        title="This should be someone who can support you by taking attendance and adding events when you can’t."
      />
      <fieldset className="mb-4 flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((member) => (
          <Radio
            key={member}
            description={`{memberName}`}
            // value={}
            // checked={}
            onChange={() => {}}
            className="mb-4"
            variant="slim"
            customIcon={
              <UserAvatar
                className="mr-4"
                size="md"
                avatarColor="var(--primaryAccent2)"
                text={`MB`}
                displayBorder
              />
            }
          />
        ))}
      </fieldset>
      <Checkbox
        description={`I confirm that I have discussed this with {supportRoleName}.`}
        descriptionColor="textMid"
        checked={checkboxValue}
        onCheckboxChange={() => setCheckboxValue(!checkboxValue)}
      />
      <Alert
        className="my-4"
        type="info"
        title={`{supportRoleName} will be notified immediately.`}
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
