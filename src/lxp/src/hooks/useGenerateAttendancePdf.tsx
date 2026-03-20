import {
  AttendancePageHeaderDto,
  AttendanceReportTableDataDto,
} from '@ecdlink/core';
import { jsPDF, jsPDFOptions } from 'jspdf';
import autoTable, { RowInput, UserOptions } from 'jspdf-autotable';

const checkMarkImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA0CAYAAAAqunDVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG0SURBVHgB7dgxTsMwFIDhZ1rRDhkioUqIKRNipDegI1u5AZwAbgBXYGQCToA4QXsDyoAUmLKgZkBtBoYUqTV+RkUpahInaWwjvW9K09jyL6tJVABCCCGEEEL+MQYWcz3PZbPWLQD3GLC7yfj1WmWctVE/QdsD4OxweY43mt3o/WWUN3YLLLQuCDXnc1dlvHU7lRYEjI+m47euyhxW7VRWEG999VTnsWan8oKiIIhU57IiapNBchgYtukgORQMcncPxPOHD8Sht/JFhSA5HAypK0hOAQbUGSSnAc3qDpJTgUY6guR0Khft7O33Fwt2jscc2FkU+gEUpCtITpl3gbzlxq2nxGICEdYrEqYzCKm+JnnJY1wgLlRloO4g1Mi7II6iuO10mNjSo8RpV3zui/OP8edH6qJMBKHcKCQWPiwaZioIKUWhImEmg5ByFFIJSw0CNuTt2XHdQahQFMoKc5zOMwf+AH+CxP8L99PQP8HfJ2hQ+uErduRK7Mhl3nUYNAn9U9Co8E4tpezYChNBqHQUygozFYQqRaF1YSaDUOUo9BvGwBWvUDfipnABhBBCCCGEkHK+AWBwJ/5V9p+VAAAAAElFTkSuQmCC';
const crossMarkImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA0CAYAAADBjcvWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHBSURBVHgB7ZixTgJBEIZntKEgBkJM0MoKLC19DN5ALC19Ax/BNxDfSDq1USsx0XAFBZXrDhcMd9zmbnZnrpqvgVsS5j5uuP3nAAzDMAzDMIy26Q1HV/2T8bI/HL8NTkcTUGK3Dr0HJghMqJB/OdseO3DTbPH6CIKQCALO/hcQsuXnSx8YHAAXhF7xEGcxv2iIPalI2GLO4W15TUouJFVVs45DYLJefT91uscfvocL/y9/QpNOd/C+Xv3MIYKgFOB1tnieARO2GCEtJy1FRIkRUnIaUkS0GJEqpyVFJIkRsXKaUkSyGMGV05YiRMSIpnJtSOV1hekNz6cI7qG8TgklL6gvlddRICRXhYYUIdaKu4TasoyWFKEiRtTJaUoR/BDM4tfFfZaO2hWrS+mp2bIOFbGmo4emnMLtPrxP5QWrtwLpYVX0itVtvlojTxViYk0TRVtyImLcmNSGXLJYbPbTlksSSw20mnLRYlIpXUsuSkx69NCQY4tpzVPScuys6AvdldekAi19x3YjL9REvAcmyU+CpVN6SI4LuxV9u3z5drmgMOZP4EZj9Ni05dFgjg4vN3X8k2BaA8MwDMMwDKNN/gDIC3NKdjMEagAAAABJRU5ErkJggg==';

export const useGenerateAttendancePdf = () => {
  const generateReport = (
    tableData: any[],
    signature: string,
    downloadDate: string,
    tableHeadStyles?: UserOptions['headStyles'],
    content?: any,
    tableBottomContent?: any,
    tableStyles?: UserOptions['styles'],
    tableFootStyles?: UserOptions['footStyles'],
    pageOriantations?: jsPDFOptions['orientation'],
    tableHeaders?: any[],
    outputName?: string,
    logo?: string,
    classHeaders?: any[]
  ) => {
    //make landscape document
    const doc = new jsPDF(pageOriantations ?? 'landscape');
    let startY = 30; // initial startY value
    const imgWidth = 45;
    const imgHeight = 8;
    const tablesByType: { [key: string]: AttendanceReportTableDataDto[] } = {};

    tableData.forEach((table, index) => {
      // Step 1: Map the data into the desired format
      const pageData = table.items.map(
        (item: {
          attendance?: { key: string | number; value: number | null }[];
          childFullName?: string;
          childIdNumber?: string;
          totalActualAttendance?: number;
          totalExpectedAttendance?: number;
        }) => {
          const {
            childFullName,
            childIdNumber,
            totalActualAttendance,
            totalExpectedAttendance,
          } = item;

          const attendance = (item.attendance ?? []).reduce(
            (obj: Record<string, number | '*'>, { key, value }) => {
              obj[`day${key}`] = value !== null ? value : '*';
              return obj;
            },
            {}
          );

          return {
            child: childFullName ?? '',
            id: childIdNumber ?? '',
            totalExpectedAttendance: totalExpectedAttendance ?? '',
            totalActualAttendance: totalActualAttendance ?? '',
            ...attendance,
          };
        }
      );

      type PageRow = (typeof pageData)[number];
      // Step 2: Get all days from the table
      const dayKeys = Array.from(
        new Set(
          pageData.flatMap((row: PageRow) =>
            Object.keys(row).filter((key) => key.startsWith('day'))
          )
        )
      ).sort((a: any, b: any) => {
        const aNum = parseInt(a.replace('day', ''), 10);
        const bNum = parseInt(b.replace('day', ''), 10);
        return aNum - bNum;
      });

      // Step 3: Calculate totals per day
      // Step 3: Calculate totals per day
      const totals = dayKeys.map((dayKey) =>
        pageData.reduce((sum: number, row: PageRow) => {
          const value = row[dayKey as keyof PageRow];
          return sum + (typeof value === 'number' ? value : 0);
        }, 0)
      );

      const formattedTotals = totals.map((total) =>
        total === 0 ? '*' : total.toString()
      );

      const sumAttendance = dayKeys.reduce((total, dayKey) => {
        return (
          total +
          pageData.reduce((sum: number, row: PageRow) => {
            const value = row[dayKey as keyof PageRow];
            return sum + (typeof value === 'number' ? value : 0);
          }, 0)
        );
      }, 0) as number;

      // Step 4: Build footer row
      const footerRow = ['Child Attendance per Day', '', ...formattedTotals];

      const classHeaderData = classHeaders?.find(
        (x) => x.classroomGroupId === table.classroomGroupId
      );
      const classPageHeader = {
        subtitle: `Class: ${classHeaderData?.classroomGroupName ?? 'N/A'}`,
        text_coulumn_one_row_one: `Name: ${classHeaderData?.name}`,
        text_coulumn_one_row_two: `ID number: ${
          classHeaderData?.idNumber === null ? '' : classHeaderData?.idNumber
        }`,
        text_coulumn_one_row_three: `Phone number: ${
          classHeaderData?.phone === null ? '' : classHeaderData?.phone
        }`,
        text_column_two_row_one: `Class days: ${
          classHeaderData?.programmeDays === null
            ? ''
            : classHeaderData?.programmeDays
        } `,
        text_column_two_row_two: `Site address: ${
          classHeaderData?.classSiteAddress === null
            ? ''
            : classHeaderData?.classSiteAddress
        }`,
        text_column_two_row_three: '',
      } as AttendancePageHeaderDto;

      // Step 5: Build final PDF table object
      const pdfTable: AttendanceReportTableDataDto = {
        tableName: table.classroomGroup.name,
        classPageHeader: classPageHeader,
        headers: tableHeaders!,
        data: pageData,
        footer: footerRow,
        totalAttendance: sumAttendance.toString(),
        totalExpected: pageData[0].totalExpectedAttendance.toString(),
        totalChildren: pageData.length.toString(),
      };

      // Step 6: Add to table map
      const key = index.toString();
      if (!tablesByType[key]) {
        tablesByType[key] = [];
      }
      tablesByType[key].push(pdfTable);
    });

    let lastTableType: string | null = null;
    Object.entries(tablesByType).forEach(([tableType, tables]) => {
      if (tableType !== lastTableType && tableType !== undefined) {
        if (lastTableType !== null) {
          doc.addPage();
        }
        doc.setFontSize(16);
        doc.setFont('bold');
        lastTableType = tableType;
      }

      tables?.forEach((table) => {
        const schoolName = 'Class: ' + table.tableName;
        const headers = table.headers;
        const footerRow = [table.footer];
        const totalAttendance = `Total monthly attendance: ${table.totalAttendance}`;
        const totalSessions = `Total number of sessions: ${table.totalExpected}`;
        const numberOfChildren = `Number of children who attended all sessions: ${table.totalChildren}`;
        const legend = `* = child was not registered yet OR practitioner did not take attendance`;
        const classPageHeader = table.classPageHeader;

        const pageHeight = doc.internal.pageSize.height;

        autoTable(doc, {
          headStyles: tableHeadStyles,
          footStyles: tableFootStyles,
          styles: tableStyles,
          head: !!table.tableName
            ? [
                [
                  {
                    content: ``,
                    colSpan: 5,
                    styles: { halign: 'left' },
                  },
                ],
                table.headers.map((h) => h.header),
              ]
            : [table.headers.map((h) => h.header)],
          columns: headers,
          body: table.data.map((d) => table.headers.map((h) => d[h.dataKey])),
          foot: footerRow as RowInput[],
          rowPageBreak: 'avoid',
          horizontalPageBreakRepeat: 'avoid',
          margin: {
            top: 35,
          },
          didParseCell: (data) => {
            if (typeof data.cell.raw === 'number') {
              data.cell.text = ['']; // Remove text
            }
          },
          didDrawCell: (data) => {
            const { cell } = data;
            const cellValue = cell.raw;

            if (typeof cellValue === 'number') {
              const image = cellValue ? checkMarkImage : crossMarkImage;

              const x = cell.x + 1;
              const y = cell.y + cell.height / 2 - 2.5;

              doc.addImage(image, 'PNG', x, y, 4, 4);
            }
          },
          didDrawPage: (data) => {
            logo && doc.addImage(logo, 'PNG', 10, 5, 10, 10);
            doc.setFontSize(20);
            doc.setFont('bold');
            doc.text(content?.pageTitle ?? '', 60, 10);

            // Add right header
            doc.setFontSize(16);
            doc.setFont('bold');
            const pageWidth = doc.internal.pageSize.getWidth();

            doc.text(
              schoolName,
              pageWidth - doc.getStringUnitWidth(schoolName) - 50,
              10
            );
            doc.setFontSize(12);
            doc.setFont('bold');

            // Document Top text section
            doc.text(classPageHeader.text_coulumn_one_row_one ?? '', 10, 20);
            doc.text(classPageHeader.text_coulumn_one_row_two ?? '', 10, 25);
            doc.text(classPageHeader.text_coulumn_one_row_three ?? '', 10, 30);
            // Column two top
            doc.text(classPageHeader.text_column_two_row_one ?? '', 100, 20);
            doc.text(classPageHeader.text_column_two_row_two ?? '', 100, 25);
            doc.text(classPageHeader.text_column_two_row_three ?? '', 100, 30);
          },
        });

        let afterTable = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(9);
        // Stats
        if (tableBottomContent && tableBottomContent.length > 0) {
          doc.text(totalAttendance, 15, afterTable + 8);
          doc.text(totalSessions, 60, afterTable + 8);
          doc.text(numberOfChildren, 105, afterTable + 8);
          doc.text(legend, 180, afterTable + 8);
        }

        // Signature and Date
        doc.setFontSize(14);
        signature &&
          doc.addImage(
            signature,
            'PNG',
            40,
            pageHeight - 10,
            imgWidth,
            imgHeight
          );
        doc.text(downloadDate, 142, pageHeight - 19);
        doc.text('Sign: ', 20, pageHeight - 20);
        doc.rect(35, pageHeight - 25, 65, 10);
        doc.text('Date: ', 110, pageHeight - 20);
        doc.rect(125, pageHeight - 25, 65, 10);

        // Calculate position for next table
        startY = (doc as any).lastAutoTable.finalY + 10;
      });
    });

    const pdfBlobUrl = doc.output('bloburl');
    if (!outputName) {
      window.open(pdfBlobUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = pdfBlobUrl.toString();
      link.download = outputName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return { generateReport };
};
