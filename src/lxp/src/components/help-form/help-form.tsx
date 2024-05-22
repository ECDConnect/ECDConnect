import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Radio,
  SA_CELL_REGEX,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { options, phoneNumberOrEmailOptions } from './help-form-types';
import { useState } from 'react';
import {
  Config,
  HelpFormModel,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import { HelpService } from '@/services/HelpService';
import { isEmail } from '@/utils/common/string.utils';

interface HelpFormProps {
  closeAction?: (item: boolean) => void;
}

export const HelpForm: React.FC<HelpFormProps> = ({ closeAction }) => {
  const { isOnline } = useOnlineStatus();
  const { setNotification } = useNotifications();
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
  const disableButton = !helpType || !problemValue || !contactValue;
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [cellphone, setCellphone] = useState('');
  const [isValidCellphone, setIsValidCellphone] = useState(true);

  const sendHelpMessage = async () => {
    const input: HelpFormModel = {
      subject: helpType,
      description: problemValue,
      cellNumber: isPhoneSelected ? contactValue : '',
      email: isPhoneSelected === false ? contactValue : '',
      isLoggedIn: false,
      contactPreference: isPhoneSelected ? 'phoneNumber' : 'email',
      userId: null,
    };

    const message = await new HelpService(Config.authApi)
      .SendHelp(input)
      .catch(() => {
        setNotification({
          title: ` Failed to send the message!`,
          variant: NOTIFICATION.ERROR,
        });
      });

    if (message) {
      setNotification({
        title: `Message sent!`,
        variant: NOTIFICATION.SUCCESS,
      });
    } else {
      setNotification({
        title: `Message not sent!`,
        variant: NOTIFICATION.SUCCESS,
      });
    }

    closeAction && closeAction(false);
  };

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    const isValid = isEmail(inputValue);
    setIsValidEmail(isValid);
    if (isValid) {
      setContactValue(email);
    }
  };

  const handleCellphoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    setCellphone(inputValue);

    // Regular expression for South African cellphone number validation
    const cellphonePattern = SA_CELL_REGEX;
    const isValid = cellphonePattern.test(inputValue);
    setIsValidCellphone(isValid);

    if (isValid) {
      setContactValue(cellphone);
    }
  };

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
              onOptionSelected={(option: boolean | boolean[]) => {
                setIsPhoneSelected(option as boolean);
                setContactValue('');
                setCellphone('');
                setEmail('');
              }}
              selectedOptions={isPhoneSelected}
              notSelectedColor="secondaryAccent2"
              textColor="secondary"
              multiple={false}
            />
          </div>
          {isPhoneSelected && (
            <div className="my-4">
              <FormInput
                label={contactLabel}
                className="bg-adminPortalBg mb-1"
                value={cellphone}
                onChange={(e) => handleCellphoneChange(e)}
                textInputType="input"
                placeholder={contactPlaceholder}
                type="number"
              />
              {!isValidCellphone && cellphone && (
                <Typography
                  type="help"
                  text="Please enter a valid South African cellphone number."
                  color="errorMain"
                />
              )}
            </div>
          )}
          {isPhoneSelected === false && (
            <>
              <FormInput
                label={contactLabel}
                className="bg-adminPortalBg my-4"
                value={email}
                onChange={(e) => handleEmailChange(e)}
                textInputType="input"
                placeholder={contactPlaceholder}
              />
              {!isValidEmail && email && (
                <Typography
                  type="help"
                  text=" Please enter a valid email address."
                  color="errorMain"
                />
              )}
            </>
          )}
          <div className={'w-full py-4'}>
            <Button
              type={'filled'}
              color={'primary'}
              className={'mb-20 w-full'}
              disabled={disableButton}
              onClick={() => {
                sendHelpMessage();
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
