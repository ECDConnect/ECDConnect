import {
  Typography,
  Button,
  BannerWrapper,
  Colours,
  SubTitleShape,
  DialogPosition,
  Dialog,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { childrenSelectors } from '@/store/children';
import { useHistory, useLocation } from 'react-router';
import {
  getMonthName,
  getShapeClass,
} from '@/utils/classroom/attendance/track-attendance-utils';
import AddPreschoolFees from './add-preschool-fees';
import { useState } from 'react';

export type PreschoolFeesStep = {
  childId: string;
};

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH_INDEX = new Date().getMonth(); // 0 = Jan, 11 = Dec

const getStyle = (amount: number) => {
  return amount > 0
    ? 'rounded-full px-2 py-0.5 bg-successMain mr-2'
    : 'rounded-full px-2 py-0.5 bg-errorDark mr-2';
};
const getColor = (amount: number): Colours => {
  return amount > 0 ? 'successDark' : 'errorDark';
};

const getShape = (amount: number): SubTitleShape => {
  return amount > 0 ? 'circle' : 'square';
};

const formatValue = (amount: number) => {
  if (typeof amount !== 'number') return '';

  // Options for conditional decimal display:
  // maximumFractionDigits limits to 2 (standard for ZAR).
  // minimumFractionDigits 0 ensures no trailing zeros if integer.
  const options = {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  // South African locale is typically 'en-ZA' or just 'default' for browser locale
  return new Intl.NumberFormat('en-ZA', options).format(amount);
};

export const PreschoolFees: React.FC<PreschoolFeesStep> = ({}) => {
  const history = useHistory();
  const location = useLocation<PreschoolFeesStep>();
  const childId = location.state.childId;

  const child = useSelector(childrenSelectors.getChildById(childId));
  const preschoolFees = useSelector(
    statementsSelectors.getPreschoolFeesForChild(child?.userId || '')
  );
  const [addPreschoolFees, setAddPreschoolFees] = useState(false);
  let totalPaid = 0;

  const feesByMonth = new Map<number, number>();
  preschoolFees?.forEach((incomeItem) => {
    const date = new Date(incomeItem.incomeItems[0].dateReceived);
    if (date.getFullYear() === CURRENT_YEAR) {
      const monthIndex = date.getMonth();
      if (monthIndex <= CURRENT_MONTH_INDEX) {
        feesByMonth.set(monthIndex, incomeItem.incomeItems[0].amount);
        totalPaid += incomeItem.incomeItems[0].amount;
      }
    }
  });

  const pastAndCurrentMonths = Array.from(
    { length: CURRENT_MONTH_INDEX + 1 },
    (_, i) => {
      const monthIndex = i;
      return {
        monthIndex,
        monthName: getMonthName(monthIndex),
        amount: feesByMonth.get(monthIndex) ?? 0,
      };
    }
  );

  const monthsInReverseOrder = [...pastAndCurrentMonths].reverse();
  const totalColor = getColor(totalPaid);

  return (
    <BannerWrapper
      size="small"
      showBackground={false}
      color="primary"
      onBack={() => history.goBack()}
      title="Preschool fees"
      subTitle=""
      className="flex h-full flex-col p-4"
    >
      <Typography
        type="h2"
        color="textDark"
        text={`Preschool fees ${CURRENT_YEAR}`}
      />
      <div className="mt-2 w-full">
        <div className="justify-left flex gap-1">
          <div className={getStyle(totalPaid)}>
            <Typography
              type={'help'}
              weight={'bold'}
              text={formatValue(totalPaid)}
              color={'white'}
            />
          </div>
          <Typography
            type="h3"
            text={`paid so far this year`}
            color={totalColor}
          />
        </div>
      </div>
      <table className="text-textDark mt-5 w-full table-fixed text-left">
        <colgroup>
          <col style={{ width: '60%' }} />
          <col style={{ width: '40%' }} />
        </colgroup>
        <thead>
          <tr className="bg-uiBg border-quatenary border-b">
            <th className="py-3 pl-4">MONTH</th>
            <th className="pr-4 text-left">FEES PAID</th>
          </tr>
        </thead>
        <tbody>
          {monthsInReverseOrder.map((monthData, idx) => {
            const amount = monthData.amount;
            const color = getColor(amount);
            const shape = getShape(amount);

            return (
              <tr
                key={monthData.monthIndex}
                className={`${(idx + 1) % 2 === 0 ? 'bg-uiBg' : 'bg-white'}`}
              >
                <td className="py-3 pl-4">
                  <Typography
                    text={monthData.monthName}
                    type="body"
                    color="textDark"
                  />
                </td>
                <td className="py-3 pr-4">
                  <div className="justify-left flex items-center gap-2">
                    <div className={getShapeClass(shape, color)} />
                    <Typography
                      type="body"
                      color={color}
                      text={formatValue(amount)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button
        icon="PlusCircleIcon"
        text="Add preschool fee"
        className="mt-auto mt-10 w-full"
        color="quatenary"
        textColor="white"
        type="filled"
        onClick={() => setAddPreschoolFees(true)}
      />
      <Button
        color="quatenary"
        type="outlined"
        onClick={() => history.push('/child-caregivers', { childId })}
        className="mt-3 w-full"
        icon="ChatAlt2Icon"
        text="Contact caregiver"
        textColor="quatenary"
      />
      <Dialog
        visible={addPreschoolFees}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <AddPreschoolFees
          onBack={() => setAddPreschoolFees(false)}
          childId={childId}
        />
      </Dialog>
    </BannerWrapper>
  );
};

export default PreschoolFees;
