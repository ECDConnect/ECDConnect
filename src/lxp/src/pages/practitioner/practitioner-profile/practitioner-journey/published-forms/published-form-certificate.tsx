import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { saveHealthCertificateDetails } from '@/store/pqa/pqa.actions';
import { generateHealthSafetyCertificate } from '@/utils/certificate/generateHealthAndSafetyCertificate';
import { BannerWrapper, Button, FormInput, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import signatureFile from '@/assets/certificates/signatureFile.png';
import logoFile from '@/assets/certificates/logoFile.png';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

export type PublishedFormCertificateProps = {
  completedVisitId: string;
  certificateName?: string;
  visitCompletedDate?: string;
  certificateRegNr?: string;
  onBack: (value: boolean) => void;
};

export const PublishedFormCertificate: React.FC<
  PublishedFormCertificateProps
> = ({
  completedVisitId,
  certificateName,
  visitCompletedDate,
  certificateRegNr,
  onBack,
}) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const saveAndDownload = async () => {
    const certificateId =
      certificateRegNr ||
      `ECDC-HSC-${new Date().getFullYear()}-${
        Math.floor(Math.random() * 90000) + 10000
      }`;
    const baseDate = new Date(visitCompletedDate || new Date());
    const visitDateLong = baseDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const visitDateShort = baseDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-');

    await appDispatch(
      saveHealthCertificateDetails({
        visitId: completedVisitId!,
        certificateName: pdfFieldName,
        certificateRegNr: certificateId,
      })
    )
      .unwrap()
      .then(() => {
        downloadPDF(certificateId, visitDateLong, visitDateShort);
      })
      .catch((error) => {
        console.error('Failed to save certificate name:', error);
      });
  };

  const downloadPDF = (
    certificateId: string,
    visitDateLong: string,
    visitDateShort: string
  ) => {
    // Convert a URL to base64
    async function urlToBase64(url: string): Promise<string> {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    const handleDownload = async () => {
      const logoB64 = await urlToBase64(logoFile); // your logo File
      const sigB64 = await urlToBase64(signatureFile); // your signature File

      const pdf = generateHealthSafetyCertificate(
        logoB64,
        sigB64,
        pdfFieldName,
        visitDateLong,
        certificateId
      );

      pdf.save(
        `ECDConnect_HealthSafetyCheck_${pdfFieldName}_${visitDateShort}.pdf`
      );
    };
    handleDownload();
    onBack(false);
  };

  const [pdfFieldName, setPdfFieldName] = useState(
    certificateName || `${practitioner?.user?.firstName}`
  );

  return (
    <BannerWrapper
      size="normal"
      title="Check certificate details"
      renderBorder={true}
      showBackground={false}
      displayOffline={!isOnline}
      renderOverflow
      onClose={() => onBack(false)}
      onBack={() => onBack(false)}
    >
      <div className="mt-4 px-4">
        <Typography
          color={'textDark'}
          className=""
          type="h2"
          text={`Check certificate details`}
        />
        <Typography
          className="mb-2"
          type="body"
          color="textMid"
          text={`This is how your name will appear on your certifcate.`}
        />

        <FormInput
          className="mb-4 w-full"
          label={`Name`}
          placeholder={''}
          type={'text'}
          maxCharacters={40}
          maxLength={40}
          onChange={(event) => setPdfFieldName(event.target.value)}
          value={pdfFieldName}
        />

        <div className="mt-auto">
          <Button
            onClick={saveAndDownload}
            disabled={pdfFieldName === ''}
            className="mt-auto w-full"
            size="normal"
            color="quatenary"
            type="filled"
            icon="DownloadIcon"
            text="Save & download"
            textColor="white"
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
