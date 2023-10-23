import {
  BannerWrapper,
  Button,
  IconTitleDescriptionTile,
  renderIcon,
  Typography,
} from '@ecdlink/ui';

import { useOnlineStatus } from '@hooks/useOnlineStatus';
import SignatureCanvas from 'react-signature-canvas';
import { analyticsActions } from '@store/analytics';
import * as styles from './trainee-add-signature.styles';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import {
  practitionerActions,
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useEffect } from 'react';
import { PractitionerInput } from '@ecdlink/graphql';
import { useHistory } from 'react-router';

export const TraineeAddSignature = () => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  let signature = {} as SignatureCanvas | null;

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Practitioner Signature',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const saveSignature = (signature: string) => {
    const copy = Object.assign({}, practitioner);
    if (copy.signingSignature !== signature) {
      copy.signingSignature = signature;

      const input: PractitionerInput = {
        Id: copy.id,
        IsActive: true,
        Progress: copy.progress,
        SigningSignature: copy.signingSignature,
      };

      appDispatch(practitionerActions.updatePractitioner(copy));
      appDispatch(practitionerThunkActions.updatePractitioner(input));
    }
  };

  const submitSignature = () => {
    const signatureString = signature!
      .getTrimmedCanvas()
      .toDataURL('image/png');
    saveSignature(signatureString);
  };

  const clearSignature = () => {
    signature?.clear();
    saveSignature('');
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Business'}
      subTitle={'Step 1 of 1'}
      color={'primary'}
      onBack={history.goBack}
      displayOffline={!isOnline}
      className="pb-16"
    >
      <div className={'p-4'}>
        <div className={styles.labelContainer}>
          <Typography
            type="body"
            className=""
            color="textDark"
            text="Add your signature to Funda App"
            weight="bold"
          ></Typography>
        </div>
        <IconTitleDescriptionTile
          title="You can use this signature to sign forms on the app."
          subTitle="You can access and change your signature through your Funda App profile in future."
          icon="InformationCircleIcon"
          iconColour={'infoDark'}
          iconBorderColour={'uiBg'}
          className={'mb-4'}
        />
        <SignatureCanvas
          canvasProps={{ className: styles.signatureCanvas }}
          ref={(ref) => {
            signature = ref;
          }}
        />
        <div className="mt-4">
          <Button
            type="outlined"
            color="primary"
            className={styles.button}
            onClick={clearSignature}
          >
            {renderIcon('XIcon', styles.clearIcon)}
            <Typography type={'body'} text={'Clear'} color={'primary'} />
          </Button>
          <Button
            type="filled"
            color="primary"
            className={styles.button}
            onClick={() => {
              submitSignature();
            }}
          >
            {renderIcon('ArrowCircleRightIcon', styles.icon)}
            <Typography type={'body'} text={'Next'} color={'white'} />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
