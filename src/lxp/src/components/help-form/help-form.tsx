import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Radio,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { options, phoneNumberOrEmailOptions } from './help-form-types';
import { useState } from 'react';

interface HelpFormProps {
  closeAction?: (item: boolean) => void;
}

export const HelpForm: React.FC<HelpFormProps> = ({ closeAction }) => {
  const { isOnline } = useOnlineStatus();
  const [helpType, setHelpType] = useState('');
  const [isPhoneSelected, setIsPhoneSelected] = useState<boolean | undefined>(
    undefined
  );
  const [problemValue, setProblemValue] = useState('');
  const [contactValue, setContactValue] = useState('');
  const contactPlaceholder = contactValue
    ? 'e.g 0123456789'
    : 'e.g name@email.com';
  const contactLabel = isPhoneSelected ? 'Cellphone number' : 'Email address';
  console.log({ helpType });
  return (
    <div>
      <BannerWrapper
        size="small"
        onBack={() => closeAction && closeAction(false)}
        color="primary"
        className={'h-screen'}
        title={`Get help`}
        subTitle={'Step 1 of 1'}
        displayOffline={!isOnline}
      >
        <div className={'flex h-full flex-col overflow-y-scroll p-4'}>
          <Typography
            type="h2"
            color={'textDark'}
            text={`Fill in the form to get help`}
          />
          <fieldset className="my-4 flex flex-col gap-2">
            <Typography type="h4" text={'What do you need help with?'} />
            {options?.map((item) => (
              <Radio
                variant="slim"
                key={item}
                description={item}
                value={item}
                checked={helpType === item}
                onChange={() => setHelpType(item)}
              />
            ))}
          </fieldset>
          <FormInput
            textInputType="textarea"
            label="Please describe the problem"
            placeholder="Add text..."
            onChange={(e) => setProblemValue(e?.target?.value)}
          />
          <div className="my-4">
            <Typography
              type="h4"
              text="How can we get in touch with you?"
              color="textDark"
              className="mb-2"
            />
            <ButtonGroup<boolean>
              color="secondary"
              type={ButtonGroupTypes.Button}
              options={phoneNumberOrEmailOptions}
              onOptionSelected={(option: boolean | boolean[]) =>
                setIsPhoneSelected(option as boolean)
              }
              selectedOptions={isPhoneSelected}
              notSelectedColor="secondaryAccent2"
              textColor="secondary"
              multiple={false}
            />
          </div>
          {isPhoneSelected && (
            <FormInput
              label={contactLabel}
              className="bg-adminPortalBg my-4"
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              textInputType="input"
              placeholder={contactPlaceholder}
              type="number"
            />
          )}
          {isPhoneSelected === false && (
            <FormInput
              label={contactLabel}
              className="bg-adminPortalBg my-4"
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              textInputType="input"
              placeholder={contactPlaceholder}
            />
          )}
          <div className={'w-full p-4'}>
            <Button
              type={'filled'}
              color={'primary'}
              className={'mb-12 w-full'}
              onClick={() => {
                closeAction && closeAction(false);
              }}
            >
              {renderIcon('SaveIcon', 'w-5 h-5 text-white mr-1')}
              <Typography type="help" color={'white'} text={`Save`} />
            </Button>
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};
