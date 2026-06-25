import { jsPDF } from 'jspdf';
import { hexToRgb, urlToBase64 } from './certificate.utils';
import { SmartStartFieldPositions } from './smartstart-templates';

const FIELD_MAX_WIDTH = 120;
const FIELD_FONT_SIZE = 11;

const drawCenteredField = (
  doc: jsPDF,
  text: string,
  centerX: number,
  y: number,
  color: [number, number, number]
) => {
  doc.setTextColor(...color);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(FIELD_FONT_SIZE);

  const lines = doc.splitTextToSize(text, FIELD_MAX_WIDTH);

  doc.text(lines, centerX, y, { align: 'center' });
};

const fieldY = (pageH: number, ratio: number, offsetMm = 0) =>
  pageH * ratio + offsetMm;

/**
 * Generates a SmartStart training course certificate PDF using a PNG template.
 */
export async function generateSmartStartCourseCertificate(
  templateImageUrl: string,
  recipientName: string,
  idNumber: string,
  completionDate: string,
  colorHex: string,
  fieldPositions: SmartStartFieldPositions
): Promise<jsPDF> {
  const templateBase64 = await urlToBase64(templateImageUrl);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const centerX = pageW / 2;
  const textColor = hexToRgb(colorHex);

  doc.addImage(templateBase64, 'PNG', 0, 0, pageW, pageH);

  drawCenteredField(
    doc,
    recipientName,
    centerX,
    fieldY(pageH, fieldPositions.nameYRatio, fieldPositions.nameYOffsetMm),
    textColor
  );
  drawCenteredField(
    doc,
    idNumber || '-',
    centerX,
    fieldY(pageH, fieldPositions.idYRatio, fieldPositions.idYOffsetMm),
    textColor
  );
  drawCenteredField(
    doc,
    completionDate,
    centerX,
    fieldY(pageH, fieldPositions.dateYRatio, fieldPositions.dateYOffsetMm),
    textColor
  );

  return doc;
}
