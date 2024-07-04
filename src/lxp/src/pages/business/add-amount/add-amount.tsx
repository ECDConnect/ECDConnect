import {
  ComponentBaseProps,
  BannerWrapper,
  Typography,
  StackedList,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@routes/routes';
import StatementsWrapper from '../money/submit-income-statements/components/walkthrough-statements-wrapper/StatementsWrapper';
import { useAppContext } from '@/walkthrougContext';
import { BusinessTabItems } from '../business.types';

export const AddAmount: React.FC<ComponentBaseProps> = () => {
  const history = useHistory();

  const { setState, state } = useAppContext();

  const nextWalkthroughStep = () => {
    setState({ stepIndex: 3 });
  };

  return (
    <BannerWrapper
      title={`Add an amount`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() =>
        history.push(ROUTES.BUSINESS, {
          activeTabIndex: BusinessTabItems.MONEY,
        })
      }
      className="w-full p-4"
    >
      <StatementsWrapper />
      <div className="h-full">
        <div className="mb-3 flex w-full flex-wrap">
          <Typography
            type="h2"
            color="textMid"
            text={'What would you like to record?'}
            className="mt-4"
          />
        </div>
        <div className={`flex gap-2 ${state.stepIndex === 2 && 'h-full'}`}>
          <StackedList
            id="createStatements"
            className="-mt-0.5 flex h-full w-full flex-col gap-1 rounded-2xl"
            type="TitleList"
            isFullHeight
            listItems={[
              {
                id: 'createIncome',
                title: 'Income (money in)',
                titleIcon: 'ArrowCircleLeftIcon',
                description: 'Preschool fees, donations, DBE subsidy & others',
                titleIconClassName: 'bg-tertiary text-white',
                onActionClick: () => {
                  history.push(ROUTES.BUSINESS_ADD_INCOME);
                  nextWalkthroughStep();
                },
                classNames: 'bg-successBg',
              },
              {
                title: 'Expense (money out)',
                titleIcon: 'ArrowCircleRightIcon',
                description:
                  'Rent, utilities, food, educational supplies & others',
                titleIconClassName: 'bg-secondary text-white',
                onActionClick: () => history.push(ROUTES.BUSINESS_ADD_EXPENSE),
                classNames: 'bg-secondaryAccent2',
              },
            ]}
          />
        </div>
        {/* <div className="flex gap-2">
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
          </div> */}
      </div>
      {/* <Alert
        type={'info'}
        title={'What are income & expenses?'}
        list={[
          '<b>Income</b> is the money that comes into your business. In an early learning programme, your income will mostly be caregiver fees, and could also include stipends, Department of Basic Education (DBE) subsidies or donations.',
          '<b>Expenses</b> are the costs that you pay to run your business. In an early learning programme, this would be food, rent, educational supplies and others. ',
        ]}
        className="mt-6"
      /> */}
    </BannerWrapper>
  );
};

export default AddAmount;
