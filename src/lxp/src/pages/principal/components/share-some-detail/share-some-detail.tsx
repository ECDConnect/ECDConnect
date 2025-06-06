import {
  Typography,
  Card,
  Button,
  BannerWrapper,
  Alert,
  FormInput,
  SA_ID_REGEX,
} from '@ecdlink/ui';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { useTheme } from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { userActions, userSelectors, userThunkActions } from '@/store/user';
import { cloneDeep } from '@apollo/client/utilities';
import { useAppDispatch } from '@/store';
import TransparentLayer from '../../../../assets/TransparentLayer.png';

export const ShareSomeDetails = ({
  onNext,
  setIsNotPrincipal,
  setShareSomeDetails,
}: {
  onNext?: () => void;
  setIsNotPrincipal?: (item: boolean) => void;
  setShareSomeDetails?: (item: boolean) => void;
}) => {
  const { theme } = useTheme();
  const appDispatch = useAppDispatch();
  const [idFieldVisible, setIdFieldVisible] = useState(true);
  const [idNumber, setIdNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const user = useSelector(userSelectors.getUser);
  const [isLoading, setIsLoading] = useState(false);

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    setIdFieldVisible(flag);
    setError('');
  };

  useEffect(() => {
    if (idNumber && idFieldVisible) {
      let validPassportOrIdNumber = true;
      validPassportOrIdNumber = SA_ID_REGEX.test(idNumber);

      if (!validPassportOrIdNumber) {
        setError('Id number is not valid');
      } else {
        setError('');
      }
    }
  }, [idNumber, idFieldVisible]);

  const savePractitionerUserData = async () => {
    setIsLoading(true);
    const copy = cloneDeep(user);
    if (copy) {
      copy.firstName = firstName?.replace(/['"]+/g, '');
      copy.idNumber = idNumber;

      await appDispatch(userActions.updateUser(copy));
      await appDispatch(userThunkActions.updateUser(copy));
    }
    setIsLoading(false);
    onNext && onNext();
    setShareSomeDetails && setShareSomeDetails(false);
  };

  return (
    <>
      <div className="h-full">
        <BannerWrapper
          size={'large'}
          renderBorder={true}
          showBackground={true}
          title={'Edit Profile'}
          onBack={() => setShareSomeDetails && setShareSomeDetails(false)}
          backgroundColour={'white'}
          className={'relative'}
          backgroundUrl={TransparentLayer}
          // displayOffline={!isOnline}
        >
          <div className="flex flex-col gap-11">
            <div className="flex flex-col gap-11">
              <div className="flex w-full px-4">
                <Card
                  className="bg-uiBg mb-6 flex w-full flex-col items-center gap-3 p-6"
                  borderRaduis="xl"
                  shadowSize="lg"
                >
                  <div className="">
                    <Cebisa />
                  </div>
                  <Typography
                    color="textDark"
                    text={`First, please share some detail about yourself.`}
                    type={'h3'}
                    align="center"
                  />
                </Card>
              </div>
            </div>
          </div>

          <Alert
            className="mx-4 mt-2 mb-2 rounded-md"
            title={`We use your data responsibly. We will never sell or share your data with commercial entities. `}
            type="info"
          />

          <FormInput
            label={'First name'}
            className={'p-4'}
            nameProp={'firstname'}
            placeholder={'First name'}
            onChange={(e) => setFirstName(e?.target?.value)}
          />
          <div className="p-4">
            {idFieldVisible && (
              <FormInput
                label={'ID number'}
                visible={true}
                nameProp={'idField'}
                placeholder={'E.g. 7601010338089'}
                onChange={(e) => setIdNumber(e?.target?.value)}
                error={error as unknown as FieldError}
                type="number"
              />
            )}
            {error && (
              <Typography
                type="body"
                hasMarkup
                text={error}
                className="mt-1"
                color="errorMain"
              />
            )}
            {!idFieldVisible && (
              <FormInput
                label={'Passport number'}
                visible={true}
                nameProp={'passportField'}
                placeholder="e.g. A012345"
                onChange={(e) => setIdNumber(e?.target?.value)}
              />
            )}
            {!idFieldVisible && (
              <Button
                className={'mt-3 mb-2'}
                type="outlined"
                color="secondary"
                background={'transparent'}
                size="small"
                onClick={() => toggleIdAndpassport(idFieldVisible)}
              >
                <Typography
                  type="buttonSmall"
                  color="secondary"
                  text={'Enter ID number instead'}
                ></Typography>
              </Button>
            )}
            {idFieldVisible && (
              <Button
                className={'mt-3 mb-2'}
                type="outlined"
                color="secondary"
                size="small"
                background={'transparent'}
                onClick={() => toggleIdAndpassport(idFieldVisible)}
              >
                <Typography
                  type="buttonSmall"
                  color="secondary"
                  text={'Enter passport number instead'}
                ></Typography>
              </Button>
            )}
          </div>

          <div className="mb-4 flex w-full justify-center">
            <Button
              size="normal"
              className="w-11/12"
              type="filled"
              color="quatenary"
              text="Next"
              textColor="white"
              icon="ArrowCircleRightIcon"
              isLoading={isLoading}
              disabled={!idNumber || Boolean(error) || !firstName}
              onClick={savePractitionerUserData}
            />
          </div>
        </BannerWrapper>
      </div>
    </>
  );
};
