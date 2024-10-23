import { jsPDFOptions } from 'jspdf';
import { UserOptions } from 'jspdf-autotable';
import { Typography, Button, renderIcon } from '@ecdlink/ui';
import { useGeneratePdfReport } from '@/hooks/useGeneratePdfReport';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export interface GeneratePdfReportButtonProps {
  isLoading?: boolean;
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
  numberOfChildren: number;
  onClick?: () => void;
}

const GeneratePdfReportButton = ({
  isLoading,
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
  numberOfChildren,
  onClick,
}: GeneratePdfReportButtonProps) => {
  const { isOnline } = useOnlineStatus();
  const { generateReport } = useGeneratePdfReport();
  return (
    <Button
      isLoading={isLoading}
      disabled={isLoading || !isOnline}
      type="filled"
      color="quatenary"
      className={'w-full'}
      onClick={() => {
        if (!!onClick) {
          onClick();
        }
        generateReport(
          tableData ?? [],
          signature,
          downloadDate,
          numberOfChildren,
          tableHeadStyles,
          content,
          tableBottomContent,
          outputName,
          component,
          tableStyles,
          [tableFooter],
          tableFootStyles,
          pageOriantations
        );
      }}
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
