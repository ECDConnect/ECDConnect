import * as styles from './preview.styles';
import { BannerWrapper, Button } from '@ecdlink/ui';

interface PreviewProps {}

export const Preview: React.FC<PreviewProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <BannerWrapper onBack={() => {}} onClose={() => {}} showBackground>
          <Button type="filled" color="primary">
            Primary button example
          </Button>
          <Button type="filled" color="secondary">
            Secondary button example
          </Button>
          <Button type="outlined" color="secondary">
            Primary button example
          </Button>
        </BannerWrapper>
      </div>
    </div>
  );
};
