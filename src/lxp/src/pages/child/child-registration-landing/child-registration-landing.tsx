import { AuthUser, useDialog, useQueryParams } from '@ecdlink/core';
import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useAppDispatch } from '@store';
import { authActions } from '@store/auth';
import { childrenThunkActions } from '@store/children';
import { CaregiverChildRegistration } from '../caregiver-child-registration/caregiver-child-registration';
import { PractitionerChildRegistration } from '../practitioner-child-registration/practitioner-child-registration';

export const ChildRegistrationLanding: React.FC = () => {
  const location = useLocation();
  const { resetAppStaticStores, resetAuth } = useStoreSetup();
  const queryParams = useQueryParams(location.search);
  const authToken = queryParams.getValue('token');
  const [loading, setLoading] = useState(true);
  const [childDetails, setChildDetails] = useState<any>();
  const dispatch = useAppDispatch();
  const dialog = useDialog();
  const history = useHistory();
  const presentExpiredLink = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            icon="XCircleIcon"
            iconBorderColor="errorBg"
            iconColor="errorMain"
            title="This link has expired"
            detailText="Please contact the practitioner and ask them to send you a new registration link"
            actionButtons={[
              {
                colour: 'primary',
                type: 'filled',
                text: 'Ok',
                textColour: 'white',
                onClick: () => {
                  history.push('/');
                  onClose();
                },
              },
            ]}
          />
        );
      },
    });
  };

  useEffect(() => {
    const getChildDetails = async () => {
      if (resetAppStaticStores) {
        await resetAppStaticStores(false);
        await resetAuth();
      }
      const response = await dispatch(
        childrenThunkActions.openAccessAddChildDetail({
          token: authToken || '',
        })
      ).unwrap();

      if (!response) {
        presentExpiredLink();
        return undefined;
      }

      const authState: AuthUser = JSON.parse(response.accessToken);

      dispatch(authActions.setAuthUser({ ...authState, isTempUser: true }));

      setLoading(false);
      return response;
    };

    if (authToken) {
      const details = getChildDetails();
      details
        .then((details) => {
          setChildDetails(details);
          setLoading(false);
        })
        .catch(() => {
          presentExpiredLink();
        });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authToken && !loading) {
    return <PractitionerChildRegistration />;
  }
  if (authToken && childDetails) {
    return (
      <CaregiverChildRegistration childDetails={childDetails} caregiverAuthToken={authToken} />
    );
  }

  return <div />;
};
