import { jsPDF, jsPDFOptions } from 'jspdf';
import autoTable, { ColumnInput, UserOptions } from 'jspdf-autotable';
import { Typography, Button, renderIcon } from '@ecdlink/ui';

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

function generateReport(
  footer: any[],
  tableData:any[],
  content?: any,
  tableBottomContent?: any,
  outputName?: string,
  tableHeadStyles?: UserOptions['headStyles'],
  tableStyles?: UserOptions['styles'],
  tableFootStyles?: UserOptions['footStyles'],
  pageOriantations?: jsPDFOptions['orientation']
) {
  //make landscape document
  const doc = new jsPDF(pageOriantations ?? 'landscape') as jsPDFCustom;

  const options = () => {
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
    doc.setFontSize(12);
    doc.setFont('bold');

    //Document Top text section
    doc.text(content?.text_coulumn_one_row_one, 10, 20);
    doc.text(content?.text_coulumn_one_row_two, 10, 25);
    doc.text(content?.text_coulumn_one_row_three, 10, 30);
    //column two top content
    doc.text(content?.text_column_two_row_one, 100, 20);
    doc.text(content?.text_column_two_row_two, 100, 25);
    doc.text(content?.text_column_two_row_three, 100, 30);
  };

  doc.setFontSize(8);
  tableData.forEach((table, index) => {
    const data = table.data;
    const headers = table.headers;
    // table section with styles
    autoTable(doc, {
      headStyles: tableHeadStyles,
      footStyles: tableFootStyles,
      styles: tableStyles,
      columns: headers,
      body: data,
      foot: footer,
      startY: 35, // Adjust Y coordinate for table placement
      horizontalPageBreak: true, //break table to multiple pages
      didDrawPage: options,
      margin: {
        bottom: 50,
        top: 35,
      },
    });
  });

  //get Y value after the table end to place info
  //min 3 items in row
  let afterTable = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(10);
  if (tableBottomContent && tableBottomContent.length > 0) {
    doc.text(tableBottomContent[0], 15, afterTable + 15);
    doc.text(tableBottomContent[1], 120, afterTable + 15);
    doc.text(tableBottomContent[2], 190, afterTable + 15);
  }
  // Add sign section with form on every page after the last table on page
  if (afterTable) {
    //sign section with form on doc
    doc.text('Sign: ', 10, afterTable + 35);
    doc.rect(25, afterTable + 28, 65, 10);
    doc.text('Date: ', 110, afterTable + 35);
    doc.rect(130, afterTable + 28, 65, 10);
  }

  //create pdf document
  doc.save(outputName);
}

export interface GeneratePdfReportButtonProps {
  title: string;
  outputName: string;
  tableFooter?: any[];
  tableData?: any[];
  content?: any;
  tableBottomContent?: any;
  tableHeadStyles: UserOptions['headStyles'];
  tableStyles: UserOptions['styles'];
  tableFootStyles: UserOptions['footStyles'];
  pageOriantations?: jsPDFOptions['orientation'];
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
  pageOriantations
}: GeneratePdfReportButtonProps) => {
  return (
    <Button
      type="filled"
      color="primary"
      className={'mt'}
      onClick={() =>
        generateReport(
          [tableFooter],
          tableData ?? [],
          content,
          tableBottomContent,
          outputName,
          tableHeadStyles,
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
