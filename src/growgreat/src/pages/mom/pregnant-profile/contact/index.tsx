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
import { useCallback, useEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useDialog } from '@ecdlink/core';
import { PREGNANT_PROFILE_TABS } from '..';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { CalendarAddEventOptions } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';
import { addDays } from 'date-fns';

const HEADER_HEIGHT = 122;

export interface Address {
  long_name: string;
  short_name: string;
  types: string[];
}

export const Contact: React.FC = () => {
  const location = useLocation();
  const { height } = useWindowSize();
  const history = useHistory();
  const dialog = useDialog();
  const calendarAddEvent = useCalendarAddEvent();

  const [, , , motherId] = location.pathname.split('/');
  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );
  const isLargeName =
    (mother?.user?.firstName || '').length +
      (mother?.user?.surname || '').length >
    22;

  const [formattedAddress, setFormattedAddress] = useState('');
  const getAddress = useCallback(() => {
    setFormattedAddress('');

    let address = '';
    if (
      mother?.siteAddress?.addressLine1 !== undefined &&
      mother?.siteAddress?.addressLine1 !== null
    ) {
      address = address + mother?.siteAddress?.addressLine1;
    }
    if (
      mother?.siteAddress?.addressLine2 !== undefined &&
      mother?.siteAddress?.addressLine2 !== null
    ) {
      address = address + ', ' + mother?.siteAddress?.addressLine2;
    }
    if (
      mother?.siteAddress?.addressLine3 !== undefined &&
      mother?.siteAddress?.addressLine3 !== null
    ) {
      address = address + ', ' + mother?.siteAddress?.addressLine3;
    }
    if (
      mother?.siteAddress?.province !== undefined &&
      mother?.siteAddress?.province !== null &&
      mother?.siteAddress?.province.description !== 'N/A'
    ) {
      address = address + ', ' + mother?.siteAddress?.province.description;
    }

    setFormattedAddress(address);
  }, [mother?.siteAddress]);

  useEffect(() => getAddress(), [getAddress]);

  const callForHelp = () => {
    window.open('tel:' + mother?.user?.phoneNumber);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${mother?.whatsAppNumber}`);
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
                    activeTabIndex: PREGNANT_PROFILE_TABS.CONTACT,
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
                    activeTabIndex: PREGNANT_PROFILE_TABS.CONTACT,
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
        participantUserIds: [motherId],
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
        text={`${mother?.user?.firstName || ''} ${
          !isLargeName ? mother?.user?.surname || '' : ''
        }`}
      />
      <Typography
        type="h5"
        weight="bold"
        lineHeight="snug"
        text="Mother"
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
