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
import moneyInIcon from '@/assets/icon/money-in.svg';
import moneyOutIcon from '@/assets/icon/money-out.svg';

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
            color="textDark"
            text={'What would you like to record?'}
            className="mt-4"
          />
        </div>
        <div className={`flex gap-2 ${state.stepIndex === 2 && 'h-full'}`}>
          <StackedList
            id="createStatements"
            className="-mt-0.5 flex h-full w-full flex-col gap-1 rounded-2xl"
            type="MenuList"
            isFullHeight
            listItems={[
              {
                id: 'createIncome',
                title: 'Income (money in)',
                menuIconUrl: moneyInIcon,
                iconBackgroundColor: 'tertiary',
                iconColor: 'white',
                showIcon: true,
                subTitle: 'Preschool fees, donations, DBE subsidy & others',
                onActionClick: () => {
                  if (!state.run || state?.stepIndex === 2) {
                    history.push(ROUTES.BUSINESS_ADD_INCOME);
                    nextWalkthroughStep();
                  }
                },
                backgroundColor: 'successBg',
                titleStyle: 'text-textDark font-bold',
                subTitleStyle: 'text-textDark',
              },
              {
                title: 'Expense (money out)',
                menuIconUrl: moneyOutIcon,
                iconBackgroundColor: 'secondary',
                iconColor: 'white',
                showIcon: true,
                subTitle:
                  'Rent, utilities, food, educational supplies & others',
                onActionClick: () => {
                  !state.run && history.push(ROUTES.BUSINESS_ADD_EXPENSE);
                },
                backgroundColor: 'secondaryAccent2',
                titleStyle: 'text-textDark font-bold',
                subTitleStyle: 'text-textDark',
              },
            ]}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};

export default AddAmount;
