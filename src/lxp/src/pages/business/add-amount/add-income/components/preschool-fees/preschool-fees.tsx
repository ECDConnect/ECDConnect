import { useState, useMemo } from 'react';
import {
  Typography,
  Button,
  FormInput,
  Divider,
  renderIcon,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { newGuid } from '@/utils/common/uuid.utils';
import { IncomeItemDto, IncomeTypeIds } from '@ecdlink/core';
import { endOfMonth, isBefore, startOfMonth } from 'date-fns';
import { classroomsSelectors } from '@/store/classroom';
import { useHistory } from 'react-router';

export type PreschoolFeesStep2 = {
  classroomGroupIds: string[];
  month: number;
  year: number;
  onSubmit: (incomeItems: IncomeItemDto[], statementId?: string) => void;
};

export const PreschoolFees: React.FC<PreschoolFeesStep2> = ({
  month,
  year,
  classroomGroupIds,
  onSubmit,
}) => {
  const history = useHistory();
  const [updatedFees, setUpdatedFees] = useState<IncomeItemDto[]>([]);

  const startDate = startOfMonth(new Date(year, month, 1));
  const endDate = endOfMonth(startDate);

  const learnersByClassroomGroup = useSelector(
    classroomsSelectors.getLearnersForClassroomGroups(
      classroomGroupIds,
      startDate,
      endDate
    )
  );
  const currentFees = useSelector(
    statementsSelectors.getPreschoolFeesForMonth(
      startDate.getFullYear(),
      startDate.getMonth() + 1
    )
  );

  const groupedChildList = useMemo(() => {
    return learnersByClassroomGroup.map((group) => ({
      classroomGroupName: group.classroomGroupName,
      children: group.learners.map((learner) => {
        const currentFee =
          updatedFees.find((x) => x.childUserId === learner.childUserId) ??
          currentFees.fees.find(
            (fee) => fee.childUserId === learner.childUserId
          );

        return {
          name: `${learner.child?.user?.firstName} ${learner.child?.user?.surname}`,
          childUserId: learner.childUserId,
          currentFee: currentFee,
        };
      }),
    }));
  }, [learnersByClassroomGroup, currentFees]);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const disabled = !!currentFees?.downloaded || isBefore(endDate, sixtyDaysAgo);

  return (
    <>
      {groupedChildList.map((group) => (
        <>
          <Divider dividerType="dashed" className="mt-4" />
          <Typography
            className={'mr-1 pt-2'}
            type={'body'}
            color={'primary'}
            text={group.classroomGroupName}
          />
          {group.children.map((child) => (
            <FormInput<Number>
              label={child.name}
              visible={true}
              className="mt-2"
              type={'text'}
              textInputType={'moneyInput'}
              value={child.currentFee?.amount ?? 0}
              prefixIcon={true}
              disabled={disabled}
              onChange={(event) => {
                // Updated existing
                setUpdatedFees([
                  ...updatedFees.filter(
                    (x) => !child.currentFee || x.id !== child.currentFee.id
                  ),
                  {
                    id: child.currentFee?.id ?? newGuid(),
                    amount: Number(event.target.value),
                    incomeTypeId: IncomeTypeIds.PRESCHOOL_FEE_ID,
                    childUserId: child.childUserId,
                    dateReceived: endDate.toISOString(),
                  },
                ]);
              }}
            />
          ))}
        </>
      ))}
      {!disabled && (
        <Button
          shape="normal"
          color="quatenary"
          type="filled"
          icon="SaveIcon"
          className="mt-6 rounded-2xl"
          disabled={!classroomGroupIds.length}
          onClick={() => onSubmit(updatedFees, currentFees.statementId)}
        >
          <Typography type="body" color="white" text="Save" />
        </Button>
      )}
      {disabled && (
        <Button
          type="outlined"
          color="quatenary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={() => {
            history.goBack();
          }}
        >
          {renderIcon('XIcon', 'h-4 w-4 text-quatenary mr-2')}
          <Typography
            type="body"
            className="mr-2"
            color="quatenary"
            text={'Close'}
          ></Typography>
        </Button>
      )}
    </>
  );
};

export default PreschoolFees;
