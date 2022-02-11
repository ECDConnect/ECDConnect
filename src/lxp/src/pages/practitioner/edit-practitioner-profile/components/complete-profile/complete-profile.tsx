import { Typography } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useHistory } from 'react-router-dom';
import * as styles from './complete-profile.styles';
export const CompleteProfile: React.FC = () => {
  const history = useHistory();
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Typography
          type={'h3'}
          text={'Complete your profile'}
          color={'textDark'}
          className={styles.header}
        />
        <Typography
          type={'body'}
          text={'Share more information about your programme to make Funda App useful for you.'}
          color={'textLight'}
          className={styles.text}
        />
        <div className={styles.linkText}>
          <div onClick={() => history.push('/practitioner/profile/edit/')}>
            <Typography
              type={'help'}
              weight={'bold'}
              color={'primary'}
              text={'Complete your profile'}
              className={styles.texthover}
            />
          </div>
          {renderIcon('ArrowNarrowRightIcon', styles.icon)}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
