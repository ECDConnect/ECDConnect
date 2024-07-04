import { LoadingSpinner } from '@ecdlink/ui';
import React, { useEffect, useState } from 'react';
import { SubmitIncomeStatements } from './submit-income-statements/submit-income-statements';
import { useSelector } from 'react-redux';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@/store';
import { statementsThunkActions } from '@store/statements';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppContext } from '@/walkthrougContext';

export const Money: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const [isLoading, setIsLoading] = useState(false);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const syncStatements = async () => {
      if (userAuth?.auth_token && isOnline) {
        setIsLoading(true);

        // Push any updates
        await appDispatch(
          statementsThunkActions.upsertIncomeStatements({})
        ).unwrap();

        // Fetch updates
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        await appDispatch(
          statementsThunkActions.getIncomeStatements({
            startDate: startDate,
            endDate: undefined,
          })
        ).unwrap();
        setIsLoading(false);
      }
    };

    syncStatements();
  }, []);

  const {
    state: { run: isWalkthrough },
  } = useAppContext();

  return (
    <>
      {isLoading && !isWalkthrough && (
        <LoadingSpinner
          size="medium"
          spinnerColor="uiBg"
          backgroundColor="quatenary"
          className="mb-7 mt-6"
        />
      )}
      {(!isLoading || isWalkthrough) && (
        <>
          <SubmitIncomeStatements />
        </>
      )}
    </>
  );
};
