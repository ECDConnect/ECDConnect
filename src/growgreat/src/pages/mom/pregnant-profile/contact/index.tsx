import { RootState } from '@/store/types';
import {
  ActionModal,
  Alert,
  Button,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getMotherById } from '@/store/mother/mother.selectors';
import { useHistory, useLocation } from 'react-router';
import { useWindowSize } from '@reach/window-size';
import { getLogo } from '@/utils/common/svg.utils';
import { LogoSvgs } from '@/utils/common/svg.utils';
import { useCallback } from 'react';
import ROUTES from '@/routes/routes';
import { useDialog } from '@ecdlink/core';

const HEADER_HEIGHT = 122;

export const Contact: React.FC = () => {
  const location = useLocation();
  const { height } = useWindowSize();
  const history = useHistory();
  const dialog = useDialog();

  const [, , , motherId] = location.pathname.split('/');
  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );
  const isLargeName =
    (mother?.user?.firstName || '').length +
      (mother?.user?.surname || '').length >
    22;

  const address =
    mother?.siteAddress?.addressLine1 !== null
      ? mother?.siteAddress?.addressLine1
      : '' + mother?.siteAddress?.addressLine2 !== null
      ? ',' + mother?.siteAddress?.addressLine2
      : '' + mother?.siteAddress?.addressLine3 !== null
      ? ',' + mother?.siteAddress?.addressLine3
      : '' + mother?.siteAddress?.province !== null
      ? ',' + mother?.siteAddress?.province
      : '';

  const callForHelp = () => {
    window.open('tel:' + mother?.user?.phoneNumber);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${mother?.whatsAppNumber}`);
  };

  const gotomap = () => {
    window.open(`https://maps.google.com/maps?q=` + address);
  };

  const navigate = useCallback(
    (location) => () => {
      history.push(location);
    },
    [history]
  );

  function showMenuDialog() {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <ActionModal
            className="z-50"
            title="What do you want to change?"
            actionButtons={[
              {
                colour: 'primary',
                text: "Client's phone number",
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'PhoneIcon',
                onClick: () => {
                  onSubmit();
                  history.push(
                    ROUTES.CLIENTS.MOM_PROFILE.CONTACT_TAB.UPDATE_NUMBERS,
                    {
                      activeTabIndex: 3,
                    }
                  );
                },
              },
              {
                colour: 'primary',
                text: "Client's address",
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'LocationMarkerIcon',
                onClick: () => {
                  onSubmit();
                  history.push(
                    ROUTES.CLIENTS.MOM_PROFILE.CONTACT_TAB.UPDATE_ADDRESS,
                    {
                      activeTabIndex: 3,
                    }
                  );
                },
              },
            ]}
          />
        );
      },
    });
  }

  return (
    <div
      className="mt-16 flex flex-col p-4 "
      style={{ height: height - HEADER_HEIGHT }}
    >
      <Typography
        type="h2"
        weight="bold"
        lineHeight="snug"
        text={`${mother?.user?.firstName || ''} ${
          !isLargeName ? mother?.user?.surname || '' : ''
        }`}
      />
      <Typography type="h5" weight="bold" lineHeight="snug" text="Mother" />

      <div className="mt-4 flex-col">
        <Typography
          type="h4"
          weight="bold"
          lineHeight="snug"
          text="Contact number:"
        />
        <Typography
          type="h5"
          weight="bold"
          lineHeight="snug"
          color="secondary"
          text={`${mother?.user?.phoneNumber}`}
        />
        <Button
          text="Call client"
          icon="PhoneIcon"
          type="outlined"
          size="small"
          color="primary"
          textColor="primary"
          iconPosition="start"
          onClick={callForHelp}
          className="mt-2"
        />
      </div>
      <div className="mt-4 flex-col">
        <Typography
          type="h4"
          weight="bold"
          lineHeight="snug"
          text="WhatsApp number:"
        />
        <Typography
          type="h5"
          weight="bold"
          lineHeight="snug"
          color="secondary"
          text={`${mother?.whatsAppNumber}`}
        />
        <Button
          color={'primary'}
          type={'outlined'}
          className={'mr-4 mt-2'}
          size={'small'}
          onClick={whatsapp}
        >
          <img
            src={getLogo(LogoSvgs.whatsapp)}
            alt="whatsapp"
            className="text-primary mr-1 h-5 w-5"
          />
          <Typography
            color={'primary'}
            type={'small'}
            weight="bold"
            text={`WhatsApp client`}
          />
        </Button>

        <Alert
          type={'info'}
          className="items-left justify-left mt-4 flex"
          title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
        />
        <Divider className="p-4" dividerType="dashed" />
      </div>
      <div className="flex-col">
        <Typography type="h4" weight="bold" lineHeight="snug" text="Address" />
        <Typography type="h5" weight="bold" lineHeight="snug" text={address} />
        <Button
          text="Go to your phone's map"
          icon="LocationMarkerIcon"
          type="outlined"
          size="small"
          color="primary"
          textColor="primary"
          iconPosition="start"
          onClick={gotomap}
          className="mt-2"
        />
      </div>
      <div className="flex h-full flex-col justify-end">
        <Button
          text="Book a visit"
          icon="CalendarIcon"
          type="filled"
          color="primary"
          textColor="white"
          className="mt-4 w-full"
          iconPosition="start"
          onClick={navigate(ROUTES.CLIENTS.MOM_PROFILE.VISITS.BOOK_VISIT)}
        />
        <Button
          text="Edit information"
          icon="PencilIcon"
          type="outlined"
          color="primary"
          textColor="primary"
          className="mt-4 w-full"
          iconPosition="start"
          onClick={showMenuDialog}
        />
      </div>
    </div>
  );
};
