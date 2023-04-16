import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Typography, Button, renderIcon } from '@ecdlink/ui';

function generateReport(url: string) {
  const doc = new jsPDF();

  const tableHeader = ['Child', 'ID/Passport', '1', '2', '3', '4' ];
  const data = [
    { child: 'Sweden', passport: 'CXXX76', 1: '0', 2: '1', 3: '1' },
    { child: 'Norway', passport: 'M87665', 1: '0', 2: '1', 3: '1' },
  ];

  autoTable(doc, {
    headStyles: {
      fillColor: [211, 211, 211], // Light grey
      textColor: [0, 0, 0],
      fontSize: 5,
    },
    columnStyles: {
      child: { halign: 'left', },
      passport: { halign: 'left', },
      ...Object.fromEntries(
        tableHeader
          .slice(2)
          .map((key) => [key, { halign: 'center' }])
      ),
    },
    body: data,
    columns: tableHeader.map((key) => ({ header: key, dataKey: key })),
  });

  doc.save('att-report.pdf');
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
    <div>
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
    </div>
  );
};

export default GeneratePdfReportButton;
