import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Typography, Button, renderIcon } from '@ecdlink/ui';

function generateReport(
  headerColumns: any[],
  bodyRows: any[],
  footer: any[],
  content: any,
  tableBottomContent: any,
  outputName: string
) {
  const doc = new jsPDF('l');

  const options = (data: any) => {
    // Add table header to each new page
    // Add left header
    doc.setFontSize(20);
    doc.setFont('bold');
    doc.text(content.pageTitle, 10, 10);

    // Add right header
    doc.setFontSize(16);
    doc.setFont('bold');
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(
      content.subtitle,
      pageWidth - doc.getStringUnitWidth(content.subtitle) - 50,
      10
    );
  };
  doc.setFontSize(12);
  doc.setFont('bold');

  doc.text(content?.practitioner_name, 10, 20);
  doc.text(content?.phone, 10, 25);
  doc.text(content?.id_number, 10, 30);
  doc.text(content.programme_type, 100, 20);
  doc.text(content.programme_days, 100, 25);
  doc.text(content.site_address, 100, 30);
  doc.setFontSize(8);

  doc.setTextColor(0, 0, 0);
  autoTable(doc, {
    headStyles: {
      fillColor: [211, 211, 211], // Light grey
      textColor: [0, 0, 0],
      fontSize: 8,
      lineWidth: 0.1,
      lineColor: 0x000000,
    },
    footStyles: {
      textColor: [0, 0, 0],
      fillColor: [211, 211, 211], // Light grey
      fontSize: 6,
      lineWidth: 0.1,
      lineColor: 0x000000,
    },
    styles: {
      lineWidth: 0.1,
      lineColor: 0x000000,
    },
    columns: headerColumns,
    body: bodyRows,
    foot: footer,
    startY: 40, // Adjust Y coordinate for table placement
    horizontalPageBreak: true, //break table to multiple pages
    didDrawPage: options,
  });

  let afterTable = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(14);
  if (tableBottomContent.length > 0) {
    doc.text(tableBottomContent[0], 15, afterTable + 15);
    doc.text(tableBottomContent[1], 120, afterTable + 15);
    doc.text(tableBottomContent[2], 190, afterTable + 15);
  }

  doc.text('Sign: ', 10, afterTable + 35);
  doc.rect(25, afterTable + 28, 65, 10);
  doc.text('Date: ', 110, afterTable + 35);
  doc.rect(130, afterTable + 28, 65, 10);

  doc.save(outputName);
}

export interface GeneratePdfReportButtonProps {
  title: string;
  outputName: string;
  headerColumns: any[];
  bodyRows: any[];
  tableFooter?: any[];
  content?: any;
  tableBottomContent?: any;
}

const GeneratePdfReportButton = ({
  title,
  headerColumns,
  bodyRows,
  tableFooter,
  content,
  tableBottomContent,
  outputName,
}: GeneratePdfReportButtonProps) => {
  return (
    <Button
      type="filled"
      color="primary"
      className={'mt'}
      onClick={() =>
        generateReport(
          headerColumns,
          bodyRows,
          [tableFooter],
          content,
          tableBottomContent,
          outputName
        )
      }
    >
      {renderIcon('DownloadIcon', 'h-5 w-5 text-primary')}
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
