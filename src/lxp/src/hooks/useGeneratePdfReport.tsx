import { ReportTableDataDto } from '@/../../../packages/core/lib/models/dto/Statements/income-statements.dto';
import { jsPDF, jsPDFOptions } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

export const useGeneratePdfReport = () => {
  const generateReport = (
    tableData: ReportTableDataDto[],
    signature: string,
    downloadDate: string,
    numberOfChildren: number,
    tableHeadStyles?: UserOptions['headStyles'],
    content?: any,
    tableBottomContent?: any,
    outputName?: string,
    component?: string,
    tableStyles?: UserOptions['styles'],
    footer?: any[],
    tableFootStyles?: UserOptions['footStyles'],
    pageOriantations?: jsPDFOptions['orientation']
  ) => {
    //make landscape document
    const doc = new jsPDF(pageOriantations ?? 'landscape');
    let startY = 30; // initial startY value
    var imgWidth = 45;
    var imgHeight = 8;
    const tablesByType: { [key: string]: ReportTableDataDto[] } = {};

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
        doc.setFontSize(16);
        doc.setFont('bold');
        doc.text(tableType, 10, 19 + 7);
        lastTableType = tableType;
      }

      const total = tables.reduce((acc, obj) => acc + obj.total, 0);

      tables.forEach((table, index) => {
        const headers = table.headers;
        let finalFooter =
          component === 'income-statements' || component === 'submit-statements'
            ? [
                [
                  'Total',
                  ...new Array(headers.length - 2).fill(''),
                  `R ${table.total}`,
                ],
              ]
            : footer;

        // table section with styles
        autoTable(doc, {
          headStyles: tableHeadStyles,
          footStyles: tableFootStyles,
          styles: tableStyles,
          head: !!table.tableName
            ? [
                [
                  {
                    content: `${table.tableName}`,
                    colSpan: 5,
                    styles: { halign: 'left' },
                  },
                ],
                table.headers.map((h) => h.header),
              ]
            : [table.headers.map((h) => h.header)],
          columns: headers,
          body: table.data.map((d) => table.headers.map((h) => d[h.dataKey])),
          foot: finalFooter,
          rowPageBreak: 'avoid', // avoid breaking rows into multiple sections
          horizontalPageBreakRepeat: 'avoid',
          margin: {
            top: 35,
          },
          didDrawPage: (data) => {
            // Add table header to each new page
            // Add left header
            doc.setFontSize(20);
            doc.setFont('bold');
            doc.text(content?.pageTitle ?? '', 10, 10);

            // Add right header
            doc.setFontSize(16);
            doc.setFont('bold');
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.text(
              content.subtitle ?? '',
              pageWidth - doc.getStringUnitWidth(content.subtitle ?? '') - 50,
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
      if (
        (component === 'income-statements' ||
          component === 'submit-statements') &&
        tableData.length > 1
      ) {
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
        doc.text(
          `${numberOfChildren}`,
          145,
          (doc as any).lastAutoTable.finalY + 48
        );
        doc.setFillColor(255, 0, 0);
        doc.rect(140, (doc as any).lastAutoTable.finalY + 42, 25, 10, 'S');

        doc.setFontSize(16);
        signature &&
          doc.addImage(
            signature,
            'PNG',
            40,
            (doc as any).lastAutoTable.finalY + 90,
            imgWidth,
            imgHeight
          );
        doc.text(downloadDate, 135, (doc as any).lastAutoTable.finalY + 98);

        //sign document section
        doc.text('Sign: ', 20, (doc as any).lastAutoTable.finalY + 95);
        doc.rect(35, (doc as any).lastAutoTable.finalY + 90, 65, 10);
        doc.text('Date: ', 110, (doc as any).lastAutoTable.finalY + 95);
        doc.rect(125, (doc as any).lastAutoTable.finalY + 90, 65, 10);
      }
    });
    doc.setFillColor(255, 255, 255); // set grey background color
    //get Y value after the last table end to place info
    //min 3 items in row
    let afterTable = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(9);
    if (tableBottomContent && tableBottomContent.length > 0) {
      doc.text(tableBottomContent[0], 15, afterTable + 15);
      doc.text(tableBottomContent[1], 60, afterTable + 15);
      doc.text(tableBottomContent[2], 105, afterTable + 15);
      doc.text(tableBottomContent[3], 180, afterTable + 15);
    }

    if (tableData.length === 1) {
      // add the image to the PDF document
      doc.setFontSize(16);
      signature &&
        doc.addImage(
          signature,
          'PNG',
          40,
          (doc as any).lastAutoTable.finalY + 26,
          imgWidth,
          imgHeight
        );
      doc.text(downloadDate, 135, (doc as any).lastAutoTable.finalY + 33);

      doc.setFontSize(14);
      doc.text('Sign: ', 20, (doc as any).lastAutoTable.finalY + 30);
      doc.rect(35, (doc as any).lastAutoTable.finalY + 25, 65, 10);
      doc.text('Date: ', 110, (doc as any).lastAutoTable.finalY + 30);
      doc.rect(125, (doc as any).lastAutoTable.finalY + 25, 65, 10);
    }
    // send pdf to SmartStart
    if (component === 'submit-statements') {
      // save the PDF document as binary data
      var pdfData = doc.output();
      // convert the binary data to a base64-encoded string
      var base64String = btoa(pdfData);
      return base64String;
    } else {
      //export pdf report
      doc.save(outputName);
    }
  };
  return { generateReport };
};
