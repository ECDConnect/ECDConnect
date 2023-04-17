import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Typography, Button, renderIcon } from '@ecdlink/ui';

function generateReport(url: string) {
  const doc = new jsPDF('l');

  // Add left header
  doc.setFontSize(12);
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

  doc.setFontSize(8);
  doc.setFont('bold');
  doc.text('Name: Anesu ndoro', 10, 20);
  doc.text('Phone Number: +1 123-456-7890', 10, 25);
  doc.text('ID Number: 123456789', 10, 30);
  doc.text('Programme Type: XYZ', 100, 20);
  doc.text('Program Days: Monday to Friday', 100, 25);
  doc.text('Site Address: 1234 ABC St, City, State, Country', 100, 30);
  doc.setFontSize(5);
  // const customTableStyle: any = {
  //   child: { halign: 'left' },
  //   passport: { halign: 'left' },
  //   'Day 1': { halign: 'center' },
  //   'Day 2': { halign: 'center' },
  //   'Day 3': { halign: 'center' },
  //   'Day 4': { halign: 'center' },
  //   'Day 5': { halign: 'center' },
  //   'Day 6': { halign: 'center' },
  //   'Day 7': { halign: 'center' },
  //   'Day 8': { halign: 'center' },
  //   'Day 9': { halign: 'center' },
  //   'Day 10': { halign: 'center' },
  //   'Day 11': { halign: 'center' },
  //   'Day 12': { halign: 'center' },
  //   'Day 13': { halign: 'center' },
  //   'Day 14': { halign: 'center' },
  //   'Day 15': { halign: 'center' },
  //   'Day 16': { halign: 'center' },
  //   'Day 17': { halign: 'center' },
  //   'Day 18': { halign: 'center' },
  //   'Day 19': { halign: 'center' },
  //   'Day 20': { halign: 'center' },
  //   'Day 21': { halign: 'center' },
  //   'Day 22': { halign: 'center' },
  //   'Day 23': { halign: 'center' },
  //   'Day 24': { halign: 'center' },
  //   'Day 25': { halign: 'center' },
  //   'Day 26': { halign: 'center' },
  //   'Day 27': { halign: 'center' },
  //   'Day 28': { halign: 'center' },
  //   'Day 29': { halign: 'center' },
  // };
  const numDays = 29;
  const numChildren = 50;
  
  // Generate child data
  const data = Array.from({ length: numChildren }, (_, i) => ({
    child: `Child ${i + 1}`,
    id: `IDTEST${Math.floor(Math.random() * 100000000)}`,
    ...Array.from({ length: numDays }, () => ({
      [`day${Math.floor(Math.random() * 3)}`]: '1' // randomize between '0' and '1'
    })).reduce((acc, val) => ({ ...acc, ...val }), {}) // merge day data into object
  }));
  
  // Generate table columns
  const tableColumns = [
    { header: 'Child', dataKey: 'child' },
    { header: 'ID/Passport', dataKey: 'id' },
    ...Array.from({ length: numDays }, (_, i) => ({
      header: `${i + 1}`, // day number as header
      dataKey: `day${i + 1}` // unique key for each day column
    }))
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
      fontSize: 8,
      lineWidth: 0.1,
      lineColor: 0x000000,
    },
    styles: {
      lineWidth: 0.1,
      lineColor: 0x000000,
    },
    // columnStyles: customTableStyle,
    // head: [tableHeader],
    columns: tableColumns,
    body: data,
    foot: [footer],
    startY: 40, // Adjust Y coordinate for table placement
    horizontalPageBreak: true, //break table to multiple pages
  });

  let afterTable = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(8);
  doc.text('Total Monthly Attendance:', 10, afterTable + 20);
  doc.text('Total number of sessions: 198', 60, afterTable + 20);
  doc.text(
    'Number of children who attended all sessions: 9',
    110,
    afterTable + 20
  );

  doc.text('Sign: ', 10, afterTable + 46);
  doc.rect(20, afterTable + 40, 65, 10);
  doc.text('Date: ', 100, afterTable + 46);
  doc.rect(110, afterTable + 40, 65, 10);

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
