import {
  Alert,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogPosition,
  FormInput,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import {
  OnNext,
  PractitionerSetupSteps,
} from '../../setup-principal/setup-principal.types';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { useEffect, useMemo, useState } from 'react';
import { ClassroomService } from '@/services/ClassroomService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import Article from '@/components/article/article';
import { ContentConsentTypeEnum } from '@ecdlink/core';
import { PrincipalCheckPreschoolCode } from './components/principal-check-preschool-code';
import { InvitePrincipal } from './components/invite-principal';
import { useTenant } from '@/hooks/useTenant';
import { useAppDispatch } from '@/store';
import { userSelectors } from '@/store/user';
import { useNotificationService } from '@/hooks/useNotificationService';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { MutationAddPractitionerToPrincipalArgs } from '@ecdlink/graphql';
import { ShareSomeDetails } from '../share-some-detail/share-some-detail';

export const PreschoolCodeCheck: React.FC<{
  onNext: OnNext;
  onPreschoolNext: any;
  setPrincipalNumberDetails: any;
}> = ({ onNext, onPreschoolNext, setPrincipalNumberDetails }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const user = useSelector(userSelectors.getUser);
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const isOpenAccess = tenant?.isOpenAccess;
  const { stopService } = useNotificationService();
  const [preschoolCode, setPreschoolCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allowPermissions, setAllowPermissions] = useState(false);
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);
  const [principalPreschoolCodeTutorial, setPrincipalPreschoolCodeTutorial] =
    useState(false);
  const [invitePrincipal, setInvitePrincipal] = useState(false);
  const [isValidPreschool, setIsValidPreschool] = useState<ClassroomDto>();
  const [searched, setSearched] = useState(false);
  const [classroomPrincipal, setClassroomPrincipal] = useState('');
  const [isLoadingPractitionerInvite, setIsLoadingPractitionerInvite] =
    useState(false);
  const [shareSomeDetails, setShareSomeDetails] = useState(false);

  useEffect(() => {
    if (isOpenAccess && !user?.firstName) {
      setShareSomeDetails(true);
    }
  }, []);

  const getPractitionerResponse = async () => {
    setIsLoading(true);
    setIsLoadingPractitionerInvite(true);

    const input: MutationAddPractitionerToPrincipalArgs = {
      userId: classroomPrincipal,
      idNumber: user?.idNumber || user?.userName,
      firstName: user?.firstName,
      preschoolCode: preschoolCode,
    };
    onPreschoolNext(input);
    onNext(PractitionerSetupSteps.ADD_PHOTO);
  };

  const handleSearchPreschool = async () => {
    setIsLoading(true);
    const preschoolCodeValidation: any = await new ClassroomService(
      userAuth?.auth_token!
    ).getClassroomForPreschoolCode(preschoolCode);
    setIsLoading(false);
    if (preschoolCodeValidation) {
      setIsValidPreschool(preschoolCodeValidation);
      setSearched(true);
      setClassroomPrincipal(preschoolCodeValidation?.userId as any);
    } else {
      setSearched(true);
      setIsValidPreschool(undefined);
      setPreschoolCode('');
    }
  };

  const handleSkipAddPractitionerToPrincipal = async () => {
    onNext(PractitionerSetupSteps.ADD_PHOTO);
  };

  const renderPreschoolSearchMessage = useMemo(() => {
    if (isValidPreschool && searched) {
      return (
        <Alert
          className={'mt-5 mb-3'}
          title={`Preschool found: ${isValidPreschool?.name}`}
          type={'success'}
        />
      );
    }

    if (!isValidPreschool && searched) {
      return (
        <Alert
          className={'mt-5 mb-3'}
          title={`Oops, preschool not found!`}
          list={[
            'Ask your principal to check the code.',
            'Re-enter the code and tap the search button.',
          ]}
          type={'error'}
        />
      );
    }

    return null;
  }, [isValidPreschool, searched]);

  return (
    <div className="h-screen overscroll-y-auto pt-7">
      <div className="flex flex-col gap-11">
        <div>
          <Card
            className="bg-uiBg mb-6 flex flex-col items-center gap-3 p-6"
            borderRaduis="xl"
            shadowSize="lg"
          >
            <div className="">
              <Cebisa />
            </div>
            <Typography
              color="textDark"
              text={`Connect with your principal`}
              type={'h3'}
              align="center"
            />
          </Card>
        </div>
      </div>

      <Typography
        color="textDark"
        text={`If your principal has already signed up for ${appName}, ask them for the preschool code. If they haven't signed up yet, tap “Skip”.`}
        type={'h4'}
        className="mt-4 mb-2"
      />
      <Button
        color={'secondaryAccent2'}
        type={'filled'}
        text="Learn more"
        icon="InformationCircleIcon"
        iconPosition="end"
        textColor="secondary"
        className={'mb-4 rounded-xl'}
        size={'small'}
        onClick={() => setPrincipalPreschoolCodeTutorial(true)}
      />

      <div className="h-fit space-y-4">
        <FormInput
          label={'Preschool code:'}
          placeholder={'AngelsDaycare001'}
          type={'text'}
          onChange={(e) => {
            setPreschoolCode(e?.target?.value);
            setSearched(false);
          }}
          value={preschoolCode}
        ></FormInput>

        {preschoolCode && !isLoading && (
          <>
            <Button
              type="filled"
              color="quatenary"
              className={'mt-1 mb-2 w-full'}
              disabled={!preschoolCode && !isLoading}
              isLoading={isLoading}
              onClick={handleSearchPreschool} // Navigate to a different page if it is principle
            >
              {renderIcon('SearchIcon', 'mr-2 text-white w-5')}
              <Typography
                type={'help'}
                text={'Search for preschool'}
                color={'white'}
              />
            </Button>
          </>
        )}

        <div>{renderPreschoolSearchMessage}</div>

        {isLoading && (
          <LoadingSpinner
            size="medium"
            spinnerColor="quatenary"
            backgroundColor="uiLight"
          />
        )}

        {isValidPreschool && searched && (
          <div
            className={`${
              allowPermissions
                ? 'border-quatenary bg-quatenaryBg border'
                : 'bg-uiBg'
            } bg-uiBg mt-2 flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4`}
          >
            <Checkbox
              description={`I give permission for my information to be shared with the preschool principal`}
              descriptionColor="textMid"
              checked={allowPermissions}
              onCheckboxChange={() => setAllowPermissions(!allowPermissions)}
            />
            &nbsp;
            <Button
              color={'secondaryAccent2'}
              type={'filled'}
              text="Read"
              textColor="secondary"
              className={'rounded-xl'}
              size={'small'}
              onClick={() => setViewPermissionToShare(true)}
            />
          </div>
        )}

        <Button
          type="filled"
          color="quatenary"
          className={'bottom-12 mt-1 mb-2 w-full'}
          disabled={!isValidPreschool?.name || !allowPermissions}
          isLoading={isLoadingPractitionerInvite}
          onClick={getPractitionerResponse} // Navigate to a different page if it is principle
        >
          {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
          <Typography type={'help'} text={'Next'} color={'white'} />
        </Button>
        <Button
          type="outlined"
          color="quatenary"
          className={'border-quatenary bottom-12 mt-1 mb-2 w-full border'}
          onClick={() =>
            isOpenAccess
              ? setInvitePrincipal(true)
              : handleSkipAddPractitionerToPrincipal()
          } // Navigate to a different page if it is principle
        >
          {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
          <Typography type={'help'} text={'Skip'} color={'quatenary'} />
        </Button>
      </div>
      <Article
        visible={viewPermissionToShare}
        consentEnumType={ContentConsentTypeEnum.PermissionToShare}
        onClose={function (): void {
          setViewPermissionToShare(false);
        }}
      />
      <Dialog
        stretch={true}
        visible={principalPreschoolCodeTutorial}
        position={DialogPosition.Full}
      >
        <PrincipalCheckPreschoolCode
          setPrincipalPreschoolCodeTutorial={setPrincipalPreschoolCodeTutorial}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={invitePrincipal}
        position={DialogPosition.Full}
      >
        <InvitePrincipal
          onNext={onNext}
          setInvitePrincipal={setInvitePrincipal}
          setPrincipalNumberDetails={setPrincipalNumberDetails}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={shareSomeDetails}
        position={DialogPosition.Full}
      >
        <ShareSomeDetails setShareSomeDetails={setShareSomeDetails} />
      </Dialog>
    </div>
  );
};
