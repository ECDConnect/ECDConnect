import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Typography, Button, renderIcon } from '@ecdlink/ui';

function generateReport(url: string) {
  const doc = new jsPDF('l');
  const numDays = 29;

  const options = (data: any) => {
    // Add table header to each new page
    // Add left header
    doc.setFontSize(20);
    doc.setFont('bold');
    doc.text('Left Header Text', 10, 10);

    // Add right header
    doc.setFontSize(16);
    doc.setFont('bold');
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(
      'Right Header Text',
      pageWidth - doc.getStringUnitWidth('Right Header Text') - 50,
      10
    );
  };
  doc.setFontSize(12);
  doc.setFont('bold');
  doc.text('Name: Anesu ndoro', 10, 20);
  doc.text('Phone Number: +1 123-456-7890', 10, 25);
  doc.text('ID Number: 123456789', 10, 30);
  doc.text('Programme Type: XYZ', 100, 20);
  doc.text('Program Days: Monday to Friday', 100, 25);
  doc.text('Site Address: 1234 ABC St, City, State, Country', 100, 30);
  doc.setFontSize(8);
  const data = [
    { child: 'John', id: 'IDTEST2525255', day1: '1', day2: '1', day3: '0' },
  ];

  for (let i = 0; i < 50; i++) {
    const newArray = {
      child: 'John Bblocks',
      id: 'IDTEST2525255',
      day1: '1',
      day2: '1',
      day3: '0',
      day4: '0',
      day5: '0',
    };
    data.push(newArray);
  }
  const tableColumns = [
    { header: 'Child', dataKey: 'child' },
    { header: 'ID/Passport', dataKey: 'id' },
    ...Array.from({ length: numDays }, (_, i) => ({
      header: `${i + 1}`, // day number as header
      dataKey: `day${i + 1}`, // unique key for each day column
    })),
  ];

  const footer = [
    'Child Attendance per Day',
    '', // Placeholder for ID/Passport column
    '', // Placeholder for Day 1 column
    '', // Placeholder for Day 2 column
    // ... continue with empty placeholders for Day 3 to Day 29 columns ...
  ];
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
    columns: tableColumns,
    body: data,
    foot: [footer],
    startY: 40, // Adjust Y coordinate for table placement
    horizontalPageBreak: true, //break table to multiple pages
    didDrawPage: options,
  });

  let afterTable = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.text('Total Monthly Attendance:', 10, afterTable + 15);
  doc.text('Total number of sessions: 198', 100, afterTable + 15);
  doc.text(
    'Number of children who attended all sessions: 9',
    180,
    afterTable + 15
  );

  doc.text('Sign: ', 10, afterTable + 35);
  doc.rect(25, afterTable + 28, 65, 10);
  doc.text('Date: ', 110, afterTable + 35);
  doc.rect(130, afterTable + 28, 65, 10);

  doc.save('report.pdf');
}

export interface GeneratePdfReportButtonProps {
  title: string;
  url: string;
}

const GeneratePdfReportButton = ({
  title,
  url,
}: GeneratePdfReportButtonProps) => {
  return (
    <Button
      type="filled"
      color="primary"
      className={'mt'}
      onClick={() => generateReport(url)}
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
