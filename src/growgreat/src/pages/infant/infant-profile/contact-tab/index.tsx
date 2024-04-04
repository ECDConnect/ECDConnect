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
import { useHistory, useLocation } from 'react-router';
import { useWindowSize } from '@reach/window-size';
import { getLogo } from '@/utils/common/svg.utils';
import { LogoSvgs } from '@/utils/common/svg.utils';
import { useCallback, useEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useDialog } from '@ecdlink/core';
import { getInfantById } from '@/store/infant/infant.selectors';
import { INFANT_PROFILE_TABS } from '..';
import { CalendarAddEventOptions } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';

const HEADER_HEIGHT = 122;

export interface Address {
  long_name: string;
  short_name: string;
  types: string[];
}

export const ContactTab: React.FC = () => {
  const location = useLocation();
  const { height } = useWindowSize();
  const history = useHistory();
  const dialog = useDialog();
  const calendarAddEvent = useCalendarAddEvent();

  const [, , , childId] = location.pathname.split('/');
  const child = useSelector((state: RootState) =>
    getInfantById(state, childId)
  );

  const isLargeName =
    (child?.user?.firstName || '').length +
      (child?.user?.surname || '').length >
    22;

  const [formattedAddress, setFormattedAddress] = useState('');
  const getAddress = useCallback(() => {
    setFormattedAddress('');

    let address = '';
    if (
      child?.caregiver?.siteAddress?.addressLine1 !== undefined &&
      child?.caregiver?.siteAddress?.addressLine1 !== null
    ) {
      address = address + child?.caregiver?.siteAddress?.addressLine1;
    }
    if (
      child?.caregiver?.siteAddress?.addressLine2 !== undefined &&
      child?.caregiver?.siteAddress?.addressLine2 !== null
    ) {
      address = address + ', ' + child?.caregiver?.siteAddress?.addressLine2;
    }
    if (
      child?.caregiver?.siteAddress?.addressLine3 !== undefined &&
      child?.caregiver?.siteAddress?.addressLine3 !== null
    ) {
      address = address + ', ' + child?.caregiver?.siteAddress?.addressLine3;
    }
    if (
      child?.caregiver?.siteAddress?.province !== undefined &&
      child?.caregiver?.siteAddress?.province !== null &&
      child?.caregiver?.siteAddress?.province.description !== 'N/A'
    ) {
      address =
        address + ', ' + child?.caregiver?.siteAddress?.province.description;
    }

    setFormattedAddress(address);
  }, [child?.caregiver?.siteAddress]);

  useEffect(() => getAddress(), [getAddress]);

  const callForHelp = () => {
    window.open('tel:' + child?.caregiver?.phoneNumber);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${child?.caregiver?.whatsAppNumber}`);
  };

  const gotomap = () => {
    window.open(`https://maps.google.com/maps?q=` + formattedAddress);
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
                  history.push(`${location.pathname}/edit-numbers`, {
                    activeTabIndex: INFANT_PROFILE_TABS.CONTACT,
                  });
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
                  history.push(`${location.pathname}/edit-address`, {
                    activeTabIndex: INFANT_PROFILE_TABS.CONTACT,
                  });
                },
              },
            ]}
          />
        );
      },
    });
  }

  const onBookVisit = () => {
    const options: CalendarAddEventOptions = {
      event: {
        participantUserIds: [childId],
      },
    };
    calendarAddEvent(options);
  };

  return (
    <div
      className="mt-16 flex flex-col p-4 "
      style={{ height: height - HEADER_HEIGHT }}
    >
      <Typography
        type="h2"
        weight="bold"
        lineHeight="snug"
        text={`${child?.caregiver?.firstName || ''} ${
          !isLargeName ? child?.caregiver?.surname || '' : ''
        }`}
      />
      <Typography
        type="h5"
        weight="bold"
        lineHeight="snug"
        text={`Primary Caregiver - ${child?.caregiver?.relation?.description}`}
        className="mb-4"
      />
      <div id="walkthrough-contact-step-1">
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
          text={`${child?.caregiver?.phoneNumber}`}
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
        <Typography
          className="mt-4"
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
          text={`${child?.caregiver?.whatsAppNumber}`}
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
      </div>
      <Alert
        type={'info'}
        className="items-left justify-left mt-4 flex"
        title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
      />
      <Divider className="p-4" dividerType="dashed" />
      <div id="walkthrough-contact-step-2">
        <Typography type="h4" weight="bold" lineHeight="snug" text="Address" />
        <Typography
          type="h5"
          weight="bold"
          lineHeight="snug"
          text={formattedAddress}
        />
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
          onClick={onBookVisit}
        />
        <Button
          id="walkthrough-contact-step-3"
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
