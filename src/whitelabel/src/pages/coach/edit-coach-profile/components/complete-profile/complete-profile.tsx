import { Typography, renderIcon } from '@ecdlink/ui';
import ROUTES from '@routes/routes';
import { useHistory } from 'react-router-dom';
import * as styles from './complete-profile.styles';

export const CompleteProfile: React.FC = () => {
  const history = useHistory();
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Typography
          type={'h3'}
          text={'Complete your Profile'}
          color={'textDark'}
          className={styles.header}
        />
        <Typography
          type={'body'}
          text={'Share more information to make Funda App useful for you.'}
          color={'textLight'}
          className={styles.text}
        />
        <div className={styles.linkText}>
          <div onClick={() => history.push(ROUTES.COACH.PROFILE.EDIT)}>
            <Typography
              type={'help'}
              weight={'bold'}
              color={'primary'}
              text={'Complete your Profile'}
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
