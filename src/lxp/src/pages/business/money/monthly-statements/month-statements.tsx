import ROUTES from '@/routes/routes';
import React, { useState, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  statementsActions,
  statementsSelectors,
  statementsThunkActions,
} from '@/store/statements';
import { authSelectors } from '@/store/auth';
import { MonthStatementsDetails } from '../../components/month-statements-details';
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

  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

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

    try {
      const base64String = await appDispatch(
        statementsThunkActions.getIncomeStatementPdf({ statementId })
      ).unwrap();

      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${monthName}_statement.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up to avoid memory leaks
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
    }
  }, [appDispatch, isOnline, statementId, monthName]);

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
                isOnline ? setShowConfirmDialog(true) : showOnlineOnly();
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
            visible={showConfirmDialog}
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
                    downloadPdf().then(() => {
                      appDispatch(
                        statementsActions.markStatementAsDownloaded({
                          statementId,
                        })
                      );
                    });
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
