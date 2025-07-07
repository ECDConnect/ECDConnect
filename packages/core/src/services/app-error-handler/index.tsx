import { ActionModal, DialogPosition } from '@ecdlink/ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useDialog } from '../dialog/DialogService';

export interface AppErrorHandlerProps {
  title?: string;
  detailText?: string;
  buttonText?: string;
  buttonRoute?: string;
}

export const AppErrorHandler: React.FC<AppErrorHandlerProps> = (props) => {
  const history = useHistory();
  const dialog = useDialog();

  const onGraphQLError = (e: Event) => {
    //  history.push(ROUTES.ERROR);
    e.preventDefault();
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            iconColor="alertMain"
            iconBorderColor="errorBg"
            title={props.title || 'Eish! Something went wrong!'}
            detailText={props.detailText || 'Please go back to the home page.'}
            icon={'ExclamationCircleIcon'}
            actionButtons={[
              {
                colour: 'primary',
                text: !!props.buttonText ? props.buttonText : 'Home',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'HomeIcon',
                onClick: () => {
                  onClose();
                  history.push(!!props.buttonRoute ? props.buttonRoute : '/');
                },
              },
            ]}
          />
        );
      },
    });
  };

  const onServerTimeOut = (e: Event) => {
    //  history.push(ROUTES.ERROR);
    e.preventDefault();
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            iconColor="alertMain"
            iconBorderColor="errorBg"
            title={
              props.title || 'Eish! Something went wrong with your network!'
            }
            detailText={
              props.detailText || 'Please check your connection and try again.'
            }
            icon={'ExclamationCircleIcon'}
            actionButtons={[
              {
                colour: 'primary',
                text: !!props.buttonText ? props.buttonText : 'OK',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'HomeIcon',
                onClick: () => {
                  onClose();
                  history.push(!!props.buttonRoute ? props.buttonRoute : '/');
                },
              },
            ]}
          />
        );
      },
    });
  };

  // const onError = (e: Event) => {
  //     // prevent React's listener from firing
  //     e.stopImmediatePropagation();
  //     // prevent the browser's console error message
  //     e.preventDefault();
  // }

  useEffect(() => {
    //window.addEventListener('error', onError);
    window.addEventListener('graphql-error', onGraphQLError, false);
    window.addEventListener('timeout-error', onServerTimeOut, false);
    return () => {
      window.removeEventListener('graphql-error', onGraphQLError);
      window.removeEventListener('timeout-error', onServerTimeOut);
      //window.removeEventListener('error', onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{props.children}</>;
};

//export default AppErrorHandler;
