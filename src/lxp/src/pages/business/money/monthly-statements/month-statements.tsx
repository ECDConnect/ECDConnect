import ROUTES from '@/routes/routes';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { authSelectors } from '@/store/auth';
import { MonthStatementsDetails } from '../../components/month-statements-details';
import { PractitionerService } from '@/services/PractitionerService';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import { ReportTableDataDto } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { practitionerSelectors } from '@/store/practitioner';
import { UserOptions } from 'jspdf-autotable';
import { BannerWrapper, Typography } from '@ecdlink/ui';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import GeneratePdfReportButton from '@/components/download-pdf-button/download-pdf-button';

interface ReportDetailsForPractitionerData {
  classroomGroupName: string;
  name: string;
  principalName: string;
  classroomGroupId: string;
  programmeTypeName: string;
  idNumber: string;
  insertedDate: string;
  programmeDays: string;
  phone: string;
  classSiteAddress: null | string;
}

export interface MonthStatementsDetailsState {
  statementId: string;
}

export const MonthStatements: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const location = useLocation<MonthStatementsDetailsState>();
  const statementId = location.state.statementId;

  const [reportDetails, setReportDetails] =
    useState<ReportDetailsForPractitionerData>();

  const [pdfReportData, setPdfReportData] = useState<
    ReportTableDataDto[] | undefined
  >(undefined);

  const statement = useSelector(
    statementsSelectors.getStatementById(statementId)
  );

  const onBack = () => {
    history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST);
  };

  // TODO check what we are using this for, can we get from state
  useEffect(() => {
    const getClassroomDetails = async () => {
      const res = await new PractitionerService(
        userAuth?.auth_token || ''
      ).getReportDetailsForPractitioner(userAuth?.id || '');
      return res;
    };

    getClassroomDetails().then((data) => {
      setReportDetails(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOnline || !statement) {
      return;
    }

    const monthlyDetailsdata = async () => {
      const report = await new IncomeStatementsService(
        userAuth?.auth_token || ''
      ).getMonthsIncomeExpensesReport(
        userAuth?.id!,
        statement.month,
        statement.year
      );
      setPdfReportData(report);
    };

    monthlyDetailsdata();
  }, [appDispatch, userAuth, isOnline, statement]);

  const footer = [
    'Total',
    '', // Placeholder for Day 2 column
  ];

  const signature = practitioner?.signingSignature ?? '';

  const tableTopContent = {
    pageTitle: `Income Statement`,
    subtitle: '',
    //column2 with 3 rows of text
    text_column_two_row_one: `Name: ${practitioner?.user?.fullName}`,
    text_column_two_row_two: `ID: ${reportDetails?.idNumber}`,
    text_column_two_row_three: `Phone: ${reportDetails?.phone}`,
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

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`View ${getMonthName(statement?.month || 0)} statement`}
      color={'primary'}
      onBack={onBack}
      displayOffline={!isOnline}
    >
      {!!statement ? (
        <MonthStatementsDetails
          incomeItems={statement.incomeItems}
          expenseItems={statement.expenseItems}
          month={statement.month}
          year={statement.year}
        />
      ) : (
        <Typography
          type="h1"
          weight="bold"
          color="textDark"
          text={'Statement not found'}
        />
      )}
      <div className={'flex h-full w-full flex-1 flex-col px-4 py-4'}>
        {!!pdfReportData && (
          <GeneratePdfReportButton
            component="income-statements"
            title="Download Statement"
            outputName={`${getMonthName(
              statement?.month || 0
            )}-income-statement-report.pdf`}
            tableFooter={footer}
            tableData={pdfReportData}
            content={tableTopContent}
            tableHeadStyles={tableHeadStyles}
            tableFootStyles={tableFootStyles}
            tableStyles={tableStyles}
            pageOriantations={'portrait'}
            signature={signature}
            downloadDate={new Date().toDateString()}
          />
        )}
      </div>
    </BannerWrapper>
  );
};
