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
import StatementsWrapper from '../money/submit-income-statements/components/statements-wrapper/StatementsWrapper';
import { useAppContext } from '@/walkthrougContext';

export const AddAmount: React.FC<ComponentBaseProps> = () => {
  const history = useHistory();

  const { setState, state } = useAppContext();

  const nextStep = () => {
    setState({ stepIndex: 3 });
  };
  const stateStepIndex1 = state?.stepIndex === 1 && state?.run === true;
  const stateStepIndex2 = state?.stepIndex === 2 && state?.run === true;

  return (
    <BannerWrapper
      title={`Add an amount`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => history.push(ROUTES.BUSINESS)}
      className="w-full p-4"
    >
      <StatementsWrapper />
      <div id="createStatements">
        <div className="mb-3 flex w-full flex-wrap justify-center">
          <Typography
            type="h2"
            color="textMid"
            text={'What would you like to record?'}
            className="mt-4"
          />
          <div className="flex gap-2">
            <div>
              <Button
                type="filled"
                color="primary"
                size="small"
                className={`mx-auto mt-4 w-11/12 rounded-xl  ${
                  stateStepIndex1 ? 'pointer-events-none' : ''
                }`}
                onClick={() => {
                  history.push(ROUTES.BUSINESS_ADD_INCOME);
                  nextStep();
                }}
                id="createIncome"
              >
                {renderIcon('PlusIcon', 'w-8 h-8 text-white mr-1')}
                <Typography
                  type="buttonSmall"
                  color="white"
                  text={'Income (money in)'}
                  className={'w-full whitespace-nowrap'}
                ></Typography>
              </Button>
            </div>
            <Button
              type="outlined"
              color="primary"
              className={`mx-auto mt-4 w-11/12 rounded-xl px-1 ${
                stateStepIndex1 || stateStepIndex2 ? 'pointer-events-none' : ''
              } `}
              onClick={() => history.push(ROUTES.BUSINESS_ADD_EXPENSE)}
            >
              {renderIcon('MinusIcon', styles.buttonIconSecondary)}
              <Typography
                type="buttonSmall"
                color="primary"
                text={'Expenses (money out)'}
                className={'w-full whitespace-nowrap'}
              ></Typography>
            </Button>
          </div>
        </div>
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
    </BannerWrapper>
  );
};

export default AddAmount;
