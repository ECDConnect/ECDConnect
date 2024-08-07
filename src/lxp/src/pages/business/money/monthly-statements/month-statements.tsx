import ROUTES from '@/routes/routes';
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statementsActions, statementsSelectors } from '@/store/statements';
import { authSelectors } from '@/store/auth';
import { MonthStatementsDetails } from '../../components/month-statements-details';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import { useDialog } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

export interface MonthStatementsDetailsState {
  statementId: string;
}

export const MonthStatements: React.FC = () => {
  const dialog = useDialog();
  const history = useHistory();
  const location = useLocation<MonthStatementsDetailsState>();

  const statementId = location.state.statementId;

  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  const userAuth = useSelector(authSelectors.getAuthUser);

  const [showConfrimDialog, setShowConfirmDialog] = useState<boolean>(false);

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const statement = useSelector(
    statementsSelectors.getStatementById(statementId)
  );

  const onBack = () => {
    history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST);
  };

  const monthName = getMonthName(!!statement ? statement.month - 1 : 0);

  const downloadPdf = useCallback(async () => {
    if (!isOnline || !statementId) {
      showOnlineOnly();
      return;
    }

    const getPdf = async () => {
      const report = await new IncomeStatementsService(
        userAuth?.auth_token || ''
      ).getIncomeStatementPdf(statementId);

      return report;
    };

    const base64String = await getPdf();

    const downloadLink = document.createElement('a');

    downloadLink.href = `data:application/pdf;base64,${base64String}`;

    downloadLink.download = `${monthName}_statement.pdf`;

    downloadLink.click();
  }, [appDispatch, userAuth, isOnline, statementId]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`View ${monthName} statement`}
      color={'primary'}
      onBack={onBack}
      displayOffline={!isOnline}
    >
      {!!statement && (
        <>
          <MonthStatementsDetails statement={statement} />
          <div className={'flex w-full flex-1 flex-col px-4 py-4'}>
            <Button
              type="filled"
              color="quatenary"
              className={'w-full'}
              onClick={() => {
                setShowConfirmDialog(true);
              }}
            >
              {renderIcon('DownloadIcon', 'h-5 w-5 text-white')}
              <Typography
                type="h6"
                color="white"
                text={'Download Statement'}
                className="ml-2"
              />
            </Button>
          </div>
          <Dialog
            stretch={false}
            visible={showConfrimDialog}
            position={DialogPosition.Middle}
          >
            <ActionModal
              icon={'ExclamationCircleIcon'}
              iconColor="alertMain"
              importantText={`Are you sure you want to download your ${monthName} statement?`}
              detailText={
                'You will not be able to edit the statement after downloading.'
              }
              actionButtons={[
                {
                  text: 'Yes, download',
                  textColour: 'white',
                  colour: 'quatenary',
                  type: 'filled',
                  onClick: () => {
                    appDispatch(
                      statementsActions.markStatementAsDownloaded({
                        statementId,
                      })
                    );
                    downloadPdf();
                    setShowConfirmDialog(false);
                  },
                  leadingIcon: 'DownloadIcon',
                },
                {
                  text: 'Close',
                  textColour: 'quatenary',
                  colour: 'quatenary',
                  type: 'outlined',
                  onClick: () => setShowConfirmDialog(false),
                  leadingIcon: 'PencilIcon',
                },
              ]}
            />
          </Dialog>
        </>
      )}
      {!statement && (
        <Typography
          type="h1"
          weight="bold"
          color="textDark"
          text={'Statement not found'}
        />
      )}
    </BannerWrapper>
  );
};
