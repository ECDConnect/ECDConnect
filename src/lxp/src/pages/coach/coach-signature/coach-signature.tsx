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
import * as styles from './coach-signature.styles';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@store';
import ROUTES from '@routes/routes';

export const CoachSignature: React.FC = () => {
  const [signatureData, setSignatureData] = useState('');
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  let signature = {} as SignatureCanvas | null;

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Coach Signature',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const setTrimmedSignature = () => {
    const signatureString = signature!
      .getTrimmedCanvas()
      .toDataURL('image/png');
    setSignatureData(signatureString);

    // Save to local storage here
    console.log(signatureData);
  };

  const clearSignature = () => {
    signature?.clear();
    setSignatureData('');

    // Save empty signature to local storage
  };

  return (
    <BannerWrapper
      size="normal"
      renderBorder={true}
      title="Add your signature"
      color={'primary'}
      onBack={() => history.push(ROUTES.COACH.ABOUT.ROOT)}
      backgroundColour="uiBg"
      displayOffline={!isOnline}
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
          title="You can use this app to sign forms on the app."
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
            onClick={setTrimmedSignature}
          >
            {renderIcon('SaveIcon', styles.icon)}
            <Typography type={'body'} text={'Save'} color={'white'} />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
