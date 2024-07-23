import { Alert, BannerWrapper, Divider } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ContactPerson } from '../../../components/contact-person/contact-person';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { childrenSelectors } from '@store/children';
import { ContactCaregiversState } from './contact-caregivers.types';

export const ContactCaregivers: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state: locationState } = useLocation<ContactCaregiversState>();
  const { childId } = locationState;
  const child = useSelector(childrenSelectors.getChildById(childId));

  const caregiver = child?.caregiver;

  return (
    <BannerWrapper
      className={'h-full'}
      size={'small'}
      onBack={history.goBack}
      color={'primary'}
      title={`Contact ${child?.user?.firstName}'s caregiver`}
      displayOffline={!isOnline}
    >
      <div
        className={
          'flex h-full w-full flex-col overflow-y-scroll px-4 pt-2 pb-20'
        }
      >
        <Alert
          className={'mt-4 mb-6'}
          type={'info'}
          title={
            'WhatsApps and phone calls will be charged at your standard carrier rates.'
          }
        />
        {caregiver && (
          <ContactPerson
            name={caregiver.firstName || ''}
            surname={caregiver.surname || ''}
            type={'Primary caregiver'}
            contactNumber={caregiver.phoneNumber || ''}
          />
        )}
        <Divider dividerType="dashed" className="my-6" />
        {caregiver && !!caregiver.emergencyContactFirstName && (
          <ContactPerson
            name={caregiver.emergencyContactFirstName}
            surname={caregiver.emergencyContactSurname || ''}
            type={'Emergency contact'}
            contactNumber={caregiver.emergencyContactPhoneNumber || ''}
          />
        )}
        <Divider dividerType="dashed" className="my-6" />
        {caregiver && !!caregiver.additionalFirstName && (
          <ContactPerson
            name={caregiver.additionalFirstName}
            surname={caregiver.additionalSurname || ''}
            type={'Alternative pickup'}
            contactNumber={caregiver.additionalPhoneNumber || ''}
          />
        )}
      </div>
    </BannerWrapper>
  );
};
