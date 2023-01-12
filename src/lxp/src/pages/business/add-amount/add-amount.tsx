import {
  ComponentBaseProps,
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  Alert,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@routes/routes';
import * as styles from './add-amount.styles';

export const AddAmount: React.FC<ComponentBaseProps> = () => {
  const history = useHistory();

  return (
    <BannerWrapper
      title={`Add an amount`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => history.push(ROUTES.BUSINESS)}
      // displayOffline={!isOnline}
      className="w-full p-4"
    >
      <div className="mb-3 flex w-full flex-wrap justify-center">
        <Typography
          type="h2"
          color="textMid"
          text={'What would you like to record?'}
          className="mt-4"
        />
        <div className="flex gap-2">
          <Button
            type="filled"
            color="primary"
            className={'mx-auto mt-4 w-11/12 rounded-xl'}
            onClick={() => history.push(ROUTES.BUSINESS_ADD_INCOME)}
          >
            {renderIcon('PlusIcon', styles.buttonIconPrimary)}
            <Typography
              type="help"
              //   className="mr-2"
              color="white"
              text={'Income (money in)'}
            ></Typography>
          </Button>
          <Button
            type="outlined"
            color="primary"
            className={'mx-auto mt-4 w-11/12 rounded-xl px-1'}
            onClick={() => {}}
          >
            {renderIcon('MinusIcon', styles.buttonIconSecondary)}
            <Typography
              type="help"
              //   className="mr-2"
              color="primary"
              text={'Expenses (money out)'}
            ></Typography>
          </Button>
        </div>
        <Alert
          type={'info'}
          title={'What are income & expenses?'}
          list={[
            '<b>Income</b> is the money that comes into your business. In an early learning programme, your income will mostly be caregiver fees, and could also include stipends, Department of Basic Education (DBE) subsidies or donations.',
            '<b>Expenses</b> are the costs that you pay to run your business. In an early learning programme, this would be food, rent, educational supplies and others. ',
          ]}
          className="mt-6"
        />
      </div>
    </BannerWrapper>
  );
};

export default AddAmount;
