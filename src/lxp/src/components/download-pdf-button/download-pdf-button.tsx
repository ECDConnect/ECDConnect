import { jsPDF, jsPDFOptions } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { Typography, Button, renderIcon } from '@ecdlink/ui';
type TableData = {
  tableName: string;
  type: string;
  headers: { header: string; dataKey: string }[];
  data: { [key: string]: any }[];
  total: number;
};
export interface GeneratePdfReportButtonProps {
  title: string;
  outputName: string;
  tableFooter?: any[];
  tableData?: any[];
  content?: any;
  component?: string;
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
  pageOriantations,
  component,
}: GeneratePdfReportButtonProps) => {
  const generateReport = (
    footer: any[],
    tableData: TableData[],
    content?: any,
    tableBottomContent?: any,
    outputName?: string,
    component?: string,
    tableHeadStyles?: UserOptions['headStyles'],
    tableStyles?: UserOptions['styles'],
    tableFootStyles?: UserOptions['footStyles'],
    pageOriantations?: jsPDFOptions['orientation']
  ) => {
    //make landscape document
    const doc = new jsPDF(pageOriantations ?? 'landscape');
    let startY = 35; // initial startY value

    const tablesByType: { [key: string]: TableData[] } = {};

    // Group tables by type
    tableData.forEach((table) => {
      if (table.type in tablesByType) {
        tablesByType[table.type].push(table);
      } else {
        tablesByType[table.type] = [table];
      }
    });

    let lastTableType: string | null = null;
    Object.entries(tablesByType).forEach(([tableType, tables]) => {
      if (tableType !== lastTableType && tableType !== undefined) {
        if (lastTableType !== null) {
          doc.addPage();
        }
        doc.setFontSize(12);
        doc.setFont('bold');
        doc.text(tableType, 10, 19 + 7);
        lastTableType = tableType;
      }

      const total = tables.reduce((acc, obj) => acc + obj.total, 0);

      tables.forEach((table, index) => {
        const headers = table.headers;
        let finalFooter =
          component !== 'income-statements'
            ? footer
            : [
                [
                  'Total',
                  ...new Array(headers.length - 2).fill(''),
                  `R ${table.total}`,
                ],
              ];

        // table section with styles
        autoTable(doc, {
          headStyles: tableHeadStyles,
          footStyles: tableFootStyles,
          styles: tableStyles,
          head: [
            table.tableName === undefined
              ? [
                  {
                    content: ``,
                    colSpan: 30,
                  },
                ]
              : [
                  {
                    content: `${table.tableName}`,
                    colSpan: 5,
                    styles: { halign: 'left' },
                  },
                ],
            table.headers.map((h) => h.header),
          ],
          columns: headers,
          body: table.data.map((d) => table.headers.map((h) => d[h.dataKey])),
          foot: finalFooter,
          startY: startY,
          rowPageBreak: 'avoid', // avoid breaking rows into multiple sections
          horizontalPageBreakRepeat: 'avoid',
          didDrawPage: (data) => {
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
              content.subtitle ?? '',
              pageWidth - doc.getStringUnitWidth(content.subtitle) - 50,
              10
            );
            doc.setFontSize(12);
            doc.setFont('bold');

            //Document Top text section
            doc.text(content.text_coulumn_one_row_one ?? '', 10, 20);
            doc.text(content.text_coulumn_one_row_two ?? '', 10, 25);
            doc.text(content.text_coulumn_one_row_three ?? '', 10, 30);
            //column two top content
            doc.text(content.text_column_two_row_one ?? '', 100, 20);
            doc.text(content.text_column_two_row_two ?? '', 100, 25);
            doc.text(content.text_column_two_row_three ?? '', 100, 30);
          },
        });
        // Calculate position for next table
        startY = (doc as any).lastAutoTable.finalY + 10;
      });
      if (component === 'income-statements') {
        const columns = ['Additional Notes'];
        const data = [['']];
        autoTable(doc, {
          columns,
          headStyles: tableHeadStyles,
          body: data,
          columnStyles: { 0: { minCellHeight: 20 } },
          rowPageBreak: 'avoid', // avoid breaking rows into multiple sections
        });
        doc.setFillColor(200, 200, 200); // set grey background color
        doc.rect(
          15,
          (doc as any).lastAutoTable.finalY + 10,
          doc.internal.pageSize.width - 30,
          15,
          'F'
        );

        //DBE section
        doc.setFillColor(215, 215, 215); // set grey background color
        doc.rect(
          15,
          (doc as any).lastAutoTable.finalY + 40,
          doc.internal.pageSize.width - 30,
          15,
          'F'
        );
        doc.setFontSize(14);
        doc.setFillColor(255, 255, 255);
        doc.text('Total', 25, (doc as any).lastAutoTable.finalY + 18);
        doc.text(
          `R ${total.toFixed(2)}`,
          150,
          (doc as any).lastAutoTable.finalY + 18
        );

        //DBE reg section
        doc.setDrawColor(0);
        doc.setFontSize(10);
        doc.text(
          'Level of DBE registration:',
          25,
          (doc as any).lastAutoTable.finalY + 48
        );
        doc.setFillColor(255, 0, 0);
        doc.rect(65, (doc as any).lastAutoTable.finalY + 42, 25, 10, 'S');
        doc.text(
          'Number of Children:',
          105,
          (doc as any).lastAutoTable.finalY + 48
        );
        doc.setFillColor(255, 0, 0);
        doc.rect(140, (doc as any).lastAutoTable.finalY + 42, 25, 10, 'S');

        //sig
        doc.text('Sign: ', 20, (doc as any).lastAutoTable.finalY + 66);
        doc.rect(30, (doc as any).lastAutoTable.finalY + 60, 65, 10);
        doc.text('Date: ', 110, (doc as any).lastAutoTable.finalY + 66);
        doc.rect(120, (doc as any).lastAutoTable.finalY + 60, 65, 10);
      }
    });
    doc.setFillColor(255, 255, 255); // set grey background color
    //get Y value after the last table end to place info
    //min 3 items in row
    let afterTable = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    if (tableBottomContent && tableBottomContent.length > 0) {
      doc.text(tableBottomContent[0], 15, afterTable + 15);
      doc.text(tableBottomContent[1], 120, afterTable + 15);
      doc.text(tableBottomContent[2], 190, afterTable + 15);
    }

    //export pdf report
    doc.save(outputName);
  };

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
          component,
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
