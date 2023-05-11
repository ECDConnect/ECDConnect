import { jsPDF, jsPDFOptions } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { Typography, Button, renderIcon } from '@ecdlink/ui';
import { weeksToDays } from 'date-fns';
import { useGenenratePdfReport } from '@/hooks/useGenenratePdfReport';

type TableData = {
  tableName: string;
  type: string;
  headers: { header: string; dataKey: string }[];
  data: { [key: string]: any }[];
  total: number;
};
export interface GeneratePdfReportButtonProps {
  tableFootStyles: UserOptions['footStyles'];
  title: string;
  outputName: string;
  tableFooter?: any[];
  tableData?: any[];
  content?: any;
  component?: string;
  tableHeadStyles?: UserOptions['headStyles'];
  tableBottomContent?: any;
  tableStyles: UserOptions['styles'];
  pageOriantations?: jsPDFOptions['orientation'];
  signature: string;
  downloadDate: string;
}

const GeneratePdfReportButton = ({
  title,
  tableFooter,
  tableData,
  content,
  tableBottomContent,
  outputName,
  tableHeadStyles,
  tableStyles,
  tableFootStyles,
  pageOriantations,
  component,
  signature,
  downloadDate,
}: GeneratePdfReportButtonProps) => {
  const { generateReport } = useGenenratePdfReport();
  return (
    <Button
      type="filled"
      color="primary"
      className={'mt'}
      onClick={() =>
        generateReport(
          [tableFooter],
          tableData ?? [],
          signature,
          downloadDate,
          tableHeadStyles,
          content,
          tableBottomContent,
          outputName,
          component,
          tableStyles,
          tableFootStyles,
          pageOriantations
        )
      }
    >
      {renderIcon('DownloadIcon', 'h-5 w-5 text-white')}
      <Typography
        type="h6"
        color="white"
        text={title}
        className="ml-2"
      ></Typography>
    </Button>
  );
};

export default GeneratePdfReportButton;
