import { useTheme } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogPosition,
  Divider,
  HeaderSlide,
  HeaderSlider,
  Typography,
} from '@ecdlink/ui';
import Banner1 from '../../../../assets//setup_banner1.svg';
import Banner2 from '../../../../assets//setup_banner2.svg';
import Banner3 from '../../../../assets//setup_banner3.svg';
import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { IndividualTerms } from './components/individual-terms/individual-terms';
import { useHistory } from 'react-router';
import ROUTES from '../../../routes/app.routes-constants';
import setupBackground from '../../../../assets/setup_background.svg';
import { OrganisationalTerms } from './components/organisational-terms/organisational-terms';

export const SetupOrg = () => {
  const { theme } = useTheme();
  const history = useHistory();
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [viewIndividualTerms, setViewIndividualTerms] =
    useState<boolean>(false);
  const [viewOrganisationalTerms, setViewOrganisationalTerms] = useState(false);
  const [acceptIndividualTerms, setAcceptIndidivualTerms] = useState(false);
  const [acceptOrganisationalTerms, setAcceptOrganisationalTerms] =
    useState(false);

  const headerSlide: HeaderSlide[] = [
    {
      title: '',
      text: '',
      image: Banner1,
    },
    {
      title: '',
      text: '',
      image: Banner2,
    },
    {
      title: '',
      text: '',
      image: Banner3,
    },
  ];

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      className={'h-screen'}
      showBackground={false}
      color={'primary'}
      menuLogoUrl={theme?.images?.logoUrl}
    >
      <div className="grid grid-cols-2">
        <div className="flex h-screen items-center justify-center gap-4 p-24">
          <div>
            <Typography
              type={'unspecified'}
              hasMarkup
              weight="semibold"
              lineHeight="tight"
              text={`Welcome to ECD Connect`}
              className={'text-72 font-semibold'}
              color={'textDark'}
            />
            <Typography
              type={'h2'}
              color={'textDark'}
              text={`If you would like to register as a new organisation on ECD Connect, please accept the individual & organisational agreements.`}
            />
            <Divider className="my-4" dividerType="dashed" />
            <div className="'flex items-center' w-full flex-row justify-start">
              <div className="mt-4 flex flex-wrap items-start">
                <Checkbox<Boolean>
                  checked={acceptIndividualTerms}
                  onCheckboxChange={() =>
                    setAcceptIndidivualTerms(!acceptIndividualTerms)
                  }
                />
                <div className="ml-4 flex">
                  <Typography
                    text={'I accept the individual'}
                    type="help"
                    color={'textMid'}
                    className="whitespace-nowrap"
                    onClick={() =>
                      setAcceptIndidivualTerms(!acceptIndividualTerms)
                    }
                  />
                  &nbsp;
                  <Typography
                    onClick={() => setViewIndividualTerms(true)}
                    className={'cursor-pointer whitespace-nowrap'}
                    text={`terms and conditions`}
                    underline={true}
                    type="help"
                    color={'secondary'}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-start">
                <Checkbox<Boolean>
                  checked={acceptOrganisationalTerms}
                  onCheckboxChange={() =>
                    setAcceptOrganisationalTerms(!acceptOrganisationalTerms)
                  }
                />
                <div className="flex">
                  <Typography
                    text={'I accept the organisational'}
                    type="help"
                    color={'textMid'}
                    className="ml-4 whitespace-nowrap"
                    onClick={() =>
                      setAcceptOrganisationalTerms(!acceptOrganisationalTerms)
                    }
                  />
                  &nbsp;
                  <Typography
                    onClick={() => setViewOrganisationalTerms(true)}
                    className={'cursor-pointer whitespace-nowrap'}
                    text={`terms and conditions`}
                    underline={true}
                    type="help"
                    color={'secondary'}
                  />
                </div>
              </div>
            </div>
            <Card className="bg-infoBb my-4 w-full rounded-xl p-4">
              <div className="flex gap-4">
                <InformationCircleIcon className="text-infoDark h-7 w-7" />
                <div>
                  <Typography
                    text={`For a summary of everything you will need to have ready to complete the setup wizard, please:`}
                    type="help"
                    weight="semibold"
                    color={'infoDark'}
                    className="text-sm"
                  ></Typography>
                  <Typography
                    text={`<a>click here</a>.`}
                    type="markdown"
                    color={'secondary'}
                    className="cursor-pointer text-sm font-semibold underline"
                    hasMarkup
                    onClick={() => setOpenSummaryModal(true)}
                  ></Typography>
                </div>
              </div>
            </Card>
            <Button
              className="mt-4 w-6/12 rounded-2xl"
              icon="ArrowCircleRightIcon"
              type="filled"
              color="secondary"
              textColor="white"
              text="Start"
              disabled={!acceptIndividualTerms || !acceptOrganisationalTerms}
              onClick={() => history.push(ROUTES.SETUP_ORG_FORM)}
            />
          </div>
        </div>
        <div className="bg-adminPortalBg bg=[url('../../../../assets/setup_background.svg')] h-screen">
          <div className="aboslute">
            <img className="absolute" src={setupBackground} alt="" />
            <div className="relative top-24 left-40 w-8/12">
              <HeaderSlider
                className="mx-4 h-full"
                cardClassName="h-550"
                slides={headerSlide}
                autoPlay
                infiniteLoop
                transitionTime={500}
                isSetupComponent={true}
              />
            </div>
          </div>
        </div>
        <Dialog
          visible={openSummaryModal}
          position={DialogPosition.Middle}
          className="rounded-2xl p-96"
        >
          <ActionModal
            icon={'InformationCircleIcon'}
            iconColor={'infoDark'}
            iconSize={20}
            importantText={`Here’s a summary of everything you will need to set your organisation up:`}
            customDetailText={
              <div className="mb-8 w-full text-left">
                <div>{`1. Organisation name`}</div>
                <div>{`2. App name`}</div>
                <div>{`3. Email address for app support requests from users`}</div>
                <div>{`4. Preferred app URL`}</div>
                <div>{`5. Organisation logos: light version, dark version and favicon (you can skip this step)`}</div>
                <div>{`6. Organisation’s colours (you can skip this step or choose the ECD Connect colours)`}</div>
                <div>{`7. Your SMS service provider details. Add some explainer text about how this SMS is used. Choose an SMS service provider: BulkSMS, SMSPortal, or \u00A0\u00A0iTouch. Set up a profile for your organisation & copy the following details:`}</div>
                <div>{`\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0a. If you choose BulkSMS, copy the “Token ID”, “Token Secret” and “Token Basic Auth”`}</div>
                <div>{`\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0b. If you choose SMSPortal, create an API Key (select “REST”), then copy the “API Key” and “API Secret”`}</div>
                <div>{`\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0c. If you choose iTouch, copy “Username” and “Password.`}</div>
                <div>{`8. Decide which modules you would like to make available to your users (Attendance, Child progress, Classroom activities, Income statements, Training, Calendar, Coach)`}</div>
                <div>{`9. Two super-administrator login details: email addresses to create new accounts`}</div>
              </div>
            }
            actionButtons={[
              {
                colour: 'quatenaryMain',
                text: 'Close',
                textColour: 'quatenaryMain',
                leadingIcon: 'XIcon',
                onClick: () => setOpenSummaryModal(false),
                type: 'outlined',
              },
            ]}
            buttonClass="rounded-2xl"
          />
        </Dialog>
        <Dialog
          visible={viewIndividualTerms}
          position={DialogPosition.Full}
          className="rounded-2xl"
        >
          <IndividualTerms setViewIndividualTerms={setViewIndividualTerms} />
        </Dialog>
        <Dialog
          visible={viewOrganisationalTerms}
          position={DialogPosition.Full}
          className="rounded-2xl"
        >
          <OrganisationalTerms
            setViewOrganisationalTerms={setViewOrganisationalTerms}
          />
        </Dialog>
      </div>
    </BannerWrapper>
  );
};
