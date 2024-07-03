import ROUTES from '@/routes/routes';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statementsActions, statementsSelectors } from '@/store/statements';
import { authSelectors } from '@/store/auth';
import { MonthStatementsDetails } from '../../components/month-statements-details';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import { ReportTableDataDto } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { practitionerSelectors } from '@/store/practitioner';
import { UserOptions } from 'jspdf-autotable';
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
import GeneratePdfReportButton from '@/components/download-pdf-button/download-pdf-button';
import { childrenSelectors } from '@/store/children';
import { useGeneratePdfReport } from '@/hooks/useGeneratePdfReport';

export interface MonthStatementsDetailsState {
  statementId: string;
}

export const MonthStatements: React.FC = () => {
  const history = useHistory();
  const { generateReport } = useGeneratePdfReport();

  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const location = useLocation<MonthStatementsDetailsState>();
  const statementId = location.state.statementId;
  const children = useSelector(childrenSelectors.getChildren);

  const [showConfrimDialog, setShowConfirmDialog] = useState<boolean>(false);

  const [pdfReportData, setPdfReportData] = useState<
    ReportTableDataDto[] | undefined
  >(undefined);

  const statement = useSelector(
    statementsSelectors.getStatementById(statementId)
  );

  const onBack = () => {
    history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST);
  };

  useEffect(() => {
    if (!isOnline || !statementId) {
      return;
    }

    const monthlyDetailsdata = async () => {
      const report = await new IncomeStatementsService(
        userAuth?.auth_token || ''
      ).getMonthsIncomeExpensesReport(statementId);
      setPdfReportData(report);
    };

    monthlyDetailsdata();
  }, [appDispatch, userAuth, isOnline, statementId]);

  const footer = [
    'Total',
    '', // Placeholder for Day 2 column
  ];

  const signature = practitioner?.signingSignature ?? '';

  const tableTopContent = {
    pageTitle: `Income Statement`,
    subtitle: '',
    //column2 with 3 rows of text
    text_column_two_row_one: `Name: ${practitioner?.user?.firstName} ${practitioner?.user?.surname}`,
    text_column_two_row_two: `ID: ${practitioner?.user?.idNumber}`,
    text_column_two_row_three: `Phone: ${practitioner?.user?.phoneNumber}`,
  };

  const tableHeadStyles: UserOptions['headStyles'] = {
    fillColor: [211, 211, 211], // Light grey
    textColor: [0, 0, 0],
    fontSize: 8,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };
  const tableStyles: UserOptions['styles'] = {
    lineWidth: 0.1,
    lineColor: 0x000000,
  };
  const tableFootStyles: UserOptions['footStyles'] = {
    textColor: [0, 0, 0],
    fillColor: [211, 211, 211], // Light grey
    fontSize: 10,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };

  const generatePdf = () => {
    generateReport(
      pdfReportData ?? [],
      signature,
      new Date().toDateString(), // TODO: Should this be the date the statement was submitted?,
      children?.length || 0,
      tableHeadStyles,
      tableTopContent,
      undefined,
      `${getMonthName(statement!.month - 1)}-income-statement-report.pdf`,
      'income-statements',
      tableStyles,
      [footer],
      tableFootStyles,
      'portrait'
    );
  };

  const monthName = getMonthName(!!statement ? statement.month - 1 : 0);

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
          <div className={'flex h-full w-full flex-1 flex-col px-4 py-4'}>
            {!!pdfReportData && (
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
            )}
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
                    generatePdf();
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
