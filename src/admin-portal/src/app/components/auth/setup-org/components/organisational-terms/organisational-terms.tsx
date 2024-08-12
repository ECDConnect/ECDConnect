import { useTheme } from '@ecdlink/core';
import { BannerWrapper, Button, Typography } from '@ecdlink/ui';

interface OrganisationalTermsProps {
  setViewOrganisationalTerms: (item: boolean) => void;
}

export const OrganisationalTerms: React.FC<OrganisationalTermsProps> = ({
  setViewOrganisationalTerms,
}) => {
  const { theme } = useTheme();
  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      menuLogoUrl={theme?.images?.logoUrl}
      backgroundColour={'white'}
      onBack={() => setViewOrganisationalTerms(false)}
    >
      <div className="p-28">
        <Typography
          type="h2"
          text={'Schedule 1: Organisational User Consent '}
          className="mb-4"
        />
        <Typography
          type="h3"
          text={`Consent`}
          color={'textDark'}
          className="mb-4"
        />
        <Typography
          type="body"
          text={`The information we collect about you:`}
          color={'textDark'}
          weight="bold"
          className="mb-4"
        />
        <Typography
          type="body"
          text={`When you are a Subscriber to the Platform and use the Services, we collect and use your personal information. `}
          color={'textMid'}
        />
        <Typography
          type="body"
          text={`The personal information we collect can include information:`}
          color={'textDark'}
          weight="bold"
          className="my-4"
        />
        <Typography
          type="body"
          text={`•\u00A0\u00A0\u00A0 your identity and contact details;
            • \u00A0\u00A0\u00A0organisation or company details;
            •\u00A0\u00A0\u00A0 images/photos;
            •\u00A0\u00A0\u00A0 nationality;
            •\u00A0\u00A0\u00A0language;
            • \u00A0\u00A0\u00A0information about behaviour;
            •\u00A0\u00A0\u00A0 financial information (re fees, scholarships etc); and
            •\u00A0\u00A0\u00A0 other personal information.
            •\u00A0\u00A0\u00A0 De-identified data from users of organisation's instance of ECD Connect.`}
          color={'textMid'}
          className="my-4"
        />
        <div className="flex flex-col gap-4">
          <Typography
            type="body"
            text={`Organisations that choose to host their own instance of ECD Connect on their own server will be required to share de-identified user data via email on an annual basis, by the 31st of January for the preceding year). The specific data fields required will be confirmed upon setup.`}
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`Further details of the personal information we collect about you can be found in our Privacy Policy.`}
            color={'textMid'}
          />
        </div>
        <Typography
          type="body"
          text={`How we use your information and the legal basis: `}
          color={'textDark'}
          weight="bold"
          className="my-4"
        />
        <Typography
          type="body"
          text={`We use your personal information for the following purposes including:`}
          color={'textMid'}
        />
        <Typography
          type="body"
          text={`•\u00A0\u00A0\u00A0 your application to subscribe;
            • \u00A0\u00A0\u00A0to provide you with appropriate education and support;
            •\u00A0\u00A0\u00A0 to better understand site-based ECD services; 
            •\u00A0\u00A0\u00A0 to gain insights into programmatic management and support; 
            •\u00A0\u00A0\u00A0 to care for our staff; 
            • \u00A0\u00A0\u00A0 information about behaviour;
            •\u00A0\u00A0\u00A0 to help coordinate, evaluate, fund and organise ECD programmes; 
            •\u00A0\u00A0\u00A0 to comply with our legal obligations; 
            •\u00A0\u00A0\u00A0 to comply with our monitoring and reporting obligations; 
            •\u00A0\u00A0\u00A0 to process appeals, resolve disputes, and defend litigation etc.  `}
          color={'textMid'}
          className="my-4"
        />
        <Typography
          type="body"
          text={`For further information on what personal information we collect, why we collect it, how we use it, and the legal basis for same, please go to our Privacy Policy.  `}
          color={'textMid'}
        />
        <Typography
          type="body"
          text={`How we share your information:`}
          color={'textDark'}
          weight="bold"
          className="my-4"
        />
        <div className="flex flex-col gap-4">
          <Typography
            type="body"
            text={`We may share your personal information with third parties, including researchers, IT providers, government, affiliations and other interested bodies; `}
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`The level of sharing and the nature of what is shared depend on various factors. `}
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`We also share your personal information with other third parties including our insurance company and other service providers (including IT providers, security providers, legal advisors etc.) `}
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`For further information on who we share your data with, when and in what circumstances, and why, please see our Privacy Policy.`}
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`We do not transfer your personal information to a third country or international organisation unless such party as signed an adequate data processing agreement to safeguard and protect the personal information.`}
            color={'textMid'}
          />
        </div>
        <Typography
          type="body"
          text={`How long we hold your personal information:`}
          color={'textDark'}
          weight="bold"
          className="my-4"
        />
        <div className="flex flex-col gap-4">
          <Typography
            type="body"
            text={`Some personal information is only kept for a short period (e.g. We may destroy at the end of an academic year because it is no longer needed).`}
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`Some personal information we retain for a longer period (e.g. retained after you leave or otherwise finish your activity with us. For further information on the retention periods, please go to our Privacy Policy.`}
            color={'textMid'}
          />
        </div>
        <Typography
          type="body"
          text={`You have the following legal rights that can be exercised at any time:`}
          color={'textDark'}
          weight="bold"
          className="my-4"
        />
        <div className="flex flex-col gap-4">
          <Typography
            type="body"
            text={`•\u00A0\u00A0\u00A0Right to complain to the Office of the Information Regulator.`}
            color={'textMid'}
          />
        </div>
        <div className="my-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Typography
              type="body"
              text={`Contact details:`}
              color={'textMid'}
              className="font-semibold"
            />
            <Typography
              type="body"
              text={`JD House 27 Stiemens Street Braamfontein Johannesburg 2001`}
              color={'textMid'}
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography
              type="body"
              text={`Email:`}
              color={'textMid'}
              className="font-semibold"
            />
            <Typography
              type="body"
              text={`complaints.IR@justice.gov.za`}
              color={'secondary'}
              className="underline"
            />
          </div>
        </div>
        <Typography
          type="body"
          text={`•\u00A0\u00A0\u00A0 Right of access to your personal information.
            • \u00A0\u00A0\u00A0Right to rectification of any personal information that is not accurate.
            •\u00A0\u00A0\u00A0 Right to object to processing of your personal information.`}
          color={'textMid'}
          className="my-4"
        />
        <div className="flex flex-col gap-4">
          <Typography
            type="markdown"
            text={`For further information, please see clause 20 of our Privacy Policy, or alternatively, contact our Information Officer at <a class='text-secondary underline cursor-pointer'>security@dgmt.co.za.</a>`}
            color={'textMid'}
            hasMarkup
          />
          <Typography
            type="body"
            text={`Please first give us a chance to resolve any complaint by contacting us at the details below. Your complaint should include a brief description of what happened when it happened and what personal information was affected.`}
            color={'textMid'}
          />
        </div>
        <Typography
          type="body"
          text={`Contact`}
          color={'textDark'}
          weight="bold"
          className="my-4"
        />
        <Typography
          type="markdown"
          text={`If you would like to discuss anything in this privacy notice, please contact: <a class='text-secondary underline cursor-pointer'>security@dgmt.co.za.</a>`}
          color={'textMid'}
          hasMarkup
        />
        <Button
          className="mt-8 rounded-2xl px-24"
          text={'Close'}
          type="filled"
          color="secondary"
          textColor="white"
          onClick={() => setViewOrganisationalTerms(false)}
          icon="XIcon"
        />
      </div>
    </BannerWrapper>
  );
};
