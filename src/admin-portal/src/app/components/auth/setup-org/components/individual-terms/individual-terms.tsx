import { useTheme } from '@ecdlink/core';
import { BannerWrapper, Button, Typography } from '@ecdlink/ui';

interface IndividualTermsProps {
  setViewIndividualTerms: (item: boolean) => void;
}

export const IndividualTerms: React.FC<IndividualTermsProps> = ({
  setViewIndividualTerms,
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
      onBack={() => setViewIndividualTerms(false)}
    >
      <div className="p-28">
        <Typography
          type="h2"
          text={'ECD Connect Terms and Conditions'}
          className="mb-4"
        />
        <Typography
          type="body"
          text={`Items in these Terms and Conditions that are of importance or that carry a level of risk for you are in bold. Please pay special attention to these clauses and make sure you understand them. If you don’t understand something please get us to explain it to you.`}
          className="mb-4"
          color={'textMid'}
        />
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Definitions`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1.1`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“Acceptance Date” means the date on which you accepted the Agreement, by way of electronic medium, for example by clicking “I agree” on a web page or via your mobile phone;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1.2`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“Activation Date” means the date on which ECD Connect will give you access to and/or enable you to use our Platform;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1.3`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“Agreement” means the agreement concluded between you and ECD Connect which agreement will be exclusively governed by these general terms and conditions;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1.4`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“Business Day” means Monday to Friday, but excludes Saturdays and a day which is an official public holiday in the Republic of South Africa;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1.5`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“Business Hours” means the hours between 08h00 and 17h00 on a Business Day;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1.6`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“Caregiver User” means a parent, guardian or caregiver of a child who is registered on the Platform to benefit from the Services;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1.7`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“ECT Act” means the Electronic Communications and Transactions Act, 2002;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex gap-4">
          <Typography
            type="body"
            text={`1.8`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“ECD Connect”, “we”, “us” and “our” means; ECD Connect, a project of the DG MURRAY TRUST, a Trust registered in terms of the laws of the Republic of South Africa (with Trust number IT171/79 and which has its registered office at 1 Wodin Rd, Claremont, South Africa)`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`1.9`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“ECD Connect Marks” means any trademarks, logos, brand names, trade names domain names or other names or marks of ECD Connect whether registered or not;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex gap-4">
          <Typography
            type="body"
            text={`1.10`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“Individual User” means a trainer or educator registered to use the Platform and Services;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex gap-4">
          <Typography
            type="body"
            text={`1.11`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`“Intellectual Property Rights” means the copyright in any work in terms of the Copyright Act, No. 98 of 1978, and includes without limitation the right to reproduce that work, the rights in respect of a trade mark conferred by the Trade Marks Act, No. 194 of 1993, the rights in respect of a design conferred by the Designs Act, No. 195 of 1993, and the rights in respect of a patent conferred by the Patents Act, No. 57 of 1978 including any applications for the aforegoing and any names, licenses, know how, trade secrets and data associated with the aforegoing;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="flex gap-4">
          <Typography
            type="body"
            text={`1.12`}
            className="mb-4"
            color={'textMid'}
          />
          <Typography
            type="body"
            text={`"Juristic Person" means a company or close corporation and includes a body corporate, partnership, association or trust;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex items-center gap-4">
          <Typography type="body" text={`1.13`} color={'textMid'} />
          <div className="flex items-center gap-2">
            <Typography
              type="body"
              text={`“Legal Notices Website” means`}
              color={'textMid'}
            />
            <Typography
              text={`<a href="https://www.ecdconnect.org.za" target="_blank" class='text-quatenaryMain cursor-pointer'>www.ecdconnect.org.za</>`}
              type={'markdown'}
              color="textMid"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.14`} color={'textMid'} />
          <Typography
            type="body"
            text={`“Organisational User” means an affiliated organisation or franchisor registered to use the Platform and Services;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex items-center items-center gap-4">
          <Typography type="body" text={`1.15`} color={'textMid'} />
          <div className="flex items-center gap-2">
            <Typography
              type="body"
              text={`“Platform” means the ECD Connect platform available at`}
              color={'textMid'}
            />
            <Typography
              text={`<a href="https://www.ecdconnect.org.za" target="_blank" class='text-quatenaryMain cursor-pointer'>www.ecdconnect.org.za</>`}
              type={'markdown'}
              color="textMid"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.16`} color={'textMid'} />
          <Typography
            type="body"
            text={`“POPIA” means the Protection of Personal Information Act of 2013 as amended or replaced from time to time;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.17`} color={'textMid'} />
          <Typography
            type="body"
            text={`“Privacy Policy” means our privacy policy available here [www.myecdconnect.co.za] which will govern how we process personal information obtained by us via the Platform or your use of the Services in terms of POPIA;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.18`} color={'textMid'} />
          <Typography
            type="body"
            text={`“Third Party Service Provider” means a third party who provides services to you via the Platform;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.19`} color={'textMid'} />
          <Typography
            type="body"
            text={`“Service” means the content, tools or services available you on the Platform;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.20`} color={'textMid'} />
          <Typography
            type="body"
            text={`“Subscriber”, “you” means an Organisational User, an Individual User of any of the Platform or Service;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.21`} color={'textMid'} />
          <Typography
            type="body"
            text={`“Uncontrollable Event” means (including without limitation) any fire, flood, earthquake, elements of nature or acts of God, pandemics, acts of governmental authority, riots, civil disorders, rebellions or revolutions in any country or any other cause beyond the reasonable control of ECD Connect including the termination or suspension of a service or product provided by a third party, that may result in a delay or a failure to provide any Services or the Platform; and`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.22`} color={'textMid'} />
          <Typography
            type="body"
            text={`“VAT” means Value Added Tax as provided for in the Value Added Tax Act, 1991.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`2`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Commencement, Duration, Termination`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`2.1`} color={'textDark'} />
          <Typography
            type="body"
            text={`The Agreement will commence on the Acceptance Date and endure indefinitely until it is cancelled as provided for in this clause 2`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`2.2`} color={'textDark'} />
          <Typography
            type="body"
            text={`ECD Connect may cancel the Agreement on the expiry of the reasonable notice period given to you to remedy a material breach and you have failed to remedy that breach within such reasonable period, or otherwise as provided for in the terms and conditions.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`2.3`} color={'textDark'} />
          <Typography
            type="body"
            text={`ECD Connect may cancel the Agreement on the expiry of the reasonable notice period given to you to remedy a material breach and you have failed to remedy that breach within such reasonable period, or otherwise as provided for in the terms and conditions.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`3`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`ECT Act`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`3.1`} color={'textMid'} />
          <Typography
            text={`The consumer protection provisions of the ECT Act, apply to transactions and communications that are executed electronically by a <a href="" target="_blank" class='text-quatenaryMain cursor-pointer'>natural person</a> . It also does not apply to paper-based
            transactions, e.g. where you apply for a service or product by
            completing an agreement in writing.`}
            type={'markdown'}
            color="textMid"
            className="w-full"
            hasMarkup
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`4`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Conditions of access`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`ECD Connect will make the Platform available to you on the Activation Date.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`ECD Connect will, where relevant, issue a user name to you prior to the Activation Date in order to enable you to gain access to and/or use the Platform. In such instance, you will not be able to access and/or use the Platform without a user name and password.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3`} color={'textMid'} />
          <Typography type="body" text={`You agree that:`} color={'textMid'} />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`you will use your user name and password for your own personal use only;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`you will not disclose your user name and password to any other person for any reason whatsoever and that you will maintain the confidentiality thereof;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`in the event that your password is compromised, you will immediately notify ECD Connect and change your password;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.4`} color={'textMid'} />
          <Typography
            type="body"
            text={`you, as the holder of the user name and activity linked to your ECD Connect account, irrespective of whether the Platform has been utilized or is being utilized by you or not and accordingly the activity on your ECD Connect account will be deemed to have arisen from (or relate to) your access to and/or use of a Service on the Platform;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.5`} color={'textMid'} />
          <Typography
            type="body"
            text={`you will not, at any time, permit and/or initiate a simultaneous network log-in; and`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.6`} color={'textMid'} />
          <Typography
            text={`you will not attempt to circumvent ECD Connect's user <a href="" target="_blank" class='text-quatenaryMain cursor-pointer'>authentication</a> .  processes or engage in attempts to access ECD Connect's network where not expressly authorised to do so.`}
            type={'markdown'}
            color="textMid"
            className="w-full"
            hasMarkup
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.7`} color={'textMid'} />
          <Typography
            type="body"
            text={`Please Note: You may not obtain any certification by using the Platform or the Services. It is provided to enhance your personal development, understanding of early childhood development and understanding the running of a business and of your finances.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.7`} color={'textMid'} />
          <Typography
            type="body"
            text={`Prohibited Uses. Without prior authorisation, you must not electronically reproduce or forward any image contained within the Platform for any purpose unless ECD Connect has expressly informed you that you may share it. Images must not be posted on any social media site, website, forum or other online location. You may not use images in any way that violates the rights of individuals such as defamation, intrusion on privacy, misappropriation of likeness, or depiction in an unintended context. You may not use images in any way that violates civil and criminal laws such as those regulating pornography, obscenity, fraudulent schemes, counterfeiting, espionage, and aid to illicit activities.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`5`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Service Delivery, Service Availability `}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`5.1`} color={'textMid'} />
          <Typography
            text={`ECD Connect will use reasonable endeavors to make its Platform available to its users, and to maintain the availability thereof for use by its users. However, we provide the Platform “as is” and “as available” and do not warrant or guarantee that the services will at  <a href="" target="_blank" class='text-quatenaryMain cursor-pointer'>all times be free of errors or interruptions, be always</a> available, fit for any purpose, not infringe any third party rights, be secure and reliable, or will conform to your delivery timeline requirements.`}
            type={'markdown'}
            color="textMid"
            className="w-full"
            hasMarkup
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`5.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`ECD Connect will use its best endeavors to notify you in advance of any maintenance and repairs which may result in the unavailability of a Service, but can not always guarantee this.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`6`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Communication, Complaints Handling and Dispute Resolution`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`All communications will abide by our Privacy Policy and applicable law. You will always be entitled to notify us in writing that you do not wish to receive or continue to receive such communications, to pre-emptively block the receipt of such communications.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`Complaints must be submitted to ECD Connect and will be dealt with by ECD Connect in accordance with the provisions of this clause 6.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`Without prejudice to your rights in law, you are required, to first approach us with any complaint or dispute and afford us an opportunity to resolve a complaint before you approach any other relevant authority, court or other dispute resolution body or refer the matter to Arbitration as contemplated in clause 6.7 below.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.4`} color={'textMid'} />
          <Typography
            text={`Please direct all complaints to <a href="" target="_blank" class='text-quatenaryMain cursor-pointer'>security@dgmt.co.za</a>. Your complaint should include the following:`}
            type={'markdown'}
            color="textMid"
            className="w-full"
            hasMarkup
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.4.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`your name and surname;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.4.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`the date on which the complaint arose; and`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.4.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`a brief description of what gave rise to the complaint.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.5`} color={'textMid'} />
          <Typography
            type="body"
            text={`You may approach any other relevant authority, court or dispute resolution body or refer the matter to Arbitration as set out in clause 6.7 below, for resolution of the dispute, should you not be satisfied with the proposed resolution of the dispute by ECD Connect.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.6`} color={'textMid'} />
          <Typography
            type="body"
            text={`Any dispute between the parties may be referred to arbitration and finally resolved in accordance with the rules of the Arbitration Foundation of Southern Africa. Such arbitration shall be held either in Cape Town, and conducted in the English language before one arbitrator appointed in accordance with the said rules. Any award will be final and not subject to appeal. This agreement to arbitrate shall be enforceable in, and judgement upon any award may be entered in any court of any country having appropriate jurisdiction. A dispute shall be deemed to have arisen when either party notifies the other party in writing to that effect.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.7`} color={'textMid'} />
          <Typography
            type="body"
            text={`The arbitrator shall have the power to give default judgement if any party fails to make submissions on due date and/or fails to appear at the arbitration.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.8`} color={'textMid'} />
          <Typography
            type="body"
            text={`The provisions set out above shall not prevent either party from approaching any court of competent jurisdiction to obtain interim or other relief in cases of urgency.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`7`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Software`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`7.1`} color={'textDark'} />
          <Typography
            type="body"
            text={`Any software and accompanying documentation we provide to you remains our property or that of our licensors. You will take all reasonable steps to protect such software or documentation from theft, loss or damage. You will be obliged to review and agree to the applicable end user license agreement before installing or using the software or documentation. Unless otherwise provided in the applicable end user license agreement, all end user license agreements will terminate upon termination of the Agreement.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`7.2`} color={'textDark'} />
          <Typography
            type="body"
            text={`Organisations, affiliates and franchisor's utilising the Platform will be able to white label the Platform with their own branding and offer the Services under their own name and style. Such services must be provided under the same terms and conditions as provided by ECD Connect to them. No commercial use is allowed. You will be able to customise the white label version free of charge but should you wish ECD Connect to host the white label solution for you a hosting fee will be payable as advised.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`8`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Security and Privacy`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`8.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`ECD Connect will be entitled to take whatever action ECD Connect may deem necessary and reasonable to preserve the security and reliability of its network and the Platform.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`8.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`You may not utilize the Platform or any Service in any manner which may compromise the security of ECD Connect's Platform.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`8.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`ECD Connect will deal with your personal information in accordance with the provisions of our Privacy Policy which is available on our Legal Notices Website and in compliance with all relevant laws and as further detailed in this document.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`9`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`POPIA`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`9.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`If you are accessing the Platform and Services as an Organisational User please complete the consent and data processing notification form at Schedule 1;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`9.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`If you are accessing the Platform and Services as an Individual User please complete the consent and data processing notification form at Schedule 2;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`9.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`If you are accessing the Platform and Services as a Caregiver User please complete the consent and data processing notification form at Schedule 3.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`10`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Intellectual Property Rights`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`10.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`You agree to comply with all laws applicable to any Intellectual Property Rights in respect of any data, files and/or information accessed, retrieved or stored by you through your use of any of our Services or the Platform.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`10.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`You are prohibited from using any ECD Connect Marks without the prior written approval of ECD Connect.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`10.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`ECD Connect will wholly and exclusively retain all existing Intellectual Property Rights and become the exclusive and unencumbered owner of all intellectual property right(s) employed in the provision of any of the Services or via the Platform.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`11`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Breach`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex items-center gap-4">
          <Typography type="body" text={`11.1`} color={'textMid'} />
          <div className="flex items-center gap-2">
            <Typography
              text={`Subject to any other provisions set out in these terms and conditions and without prejudice to any of these provisions, should you be in <a href="https://www.ecdconnect.org.za" target="_blank" class='text-quatenaryMain cursor-pointer'>breach</a>
                 of any provision of this Agreement, then ECD Connect shall be entitled, without prejudice to any other rights that it may have and to the extent required or permitted, as the case may be, by law, to forthwith:`}
              type={'markdown'}
              color="textMid"
              className="w-full"
              hasMarkup
            />
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`11.1.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`afford you a reasonable opportunity to remedy the breach, taking into account the nature of the breach in question; or`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`11.1.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`suspend your access to a Service and/or the Platform; or`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`11.1.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`suspend your access to a Service and/or the Platform; or`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`12`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Indemnity`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`12.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`You hereby unconditionally and irrevocably indemnify ECD Connect and agree to indemnify and hold ECD Connect harmless against all loss, damages, claims, liability and/or costs, of whatsoever nature, howsoever and whensoever arising, suffered or incurred by ECD Connect as a result of any claim instituted against ECD Connect by a third party (other than you) as a result of (without limitation):`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`12.1.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`your use of our Platform or Services other than as allowed or prescribed in the Agreement;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`12.1.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`any other cause whatsoever relating to the Agreement or the provision of the Platform or Services to you where you have acted wrongfully or failed to act when you had a duty to so act.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`13`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`No representations, warranties or guarantees and Limitation of liability`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`13.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`Save to the extent otherwise provided for in this Agreement or where you are entitled to rely on or receive, by operation of law, any representations, warranties or guarantees, we do not make or provide any express or implied representations, warranties or guarantees regarding the availability, accuracy,
reliability, timeliness, quality or security of the Platform or any Services.`}
            color={'textMid'}
          />
        </div>{' '}
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`13.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`Without limiting the generality of the provisions of clause 13.2, ECD Connect shall not be liable for and you will have no claim of whatsoever nature against ECD Connect as a result of -`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`13.2.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`the loss of or access to any usernames and passwords which you are required to safeguard and not allow unauthorized access on the understanding that we will be entitled to assume that you are the person so using or gaining access to the Platform or Services where your username and password is used;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`13.2.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`any unavailability of, or interruption in the service due to an Uncontrolled Event;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`13.2.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`any damage, loss, cost or claim which you may suffer or incur arising from any suspension or termination of the service/s for any reason contemplated in the Agreement.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`13.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`In addition to and without prejudice to any other limitations of liability provided for in the Agreement and 00to the fullest extent permitted by applicable law, ECD Connect shall not be liable to you for any direct damages howsoever arising and neither party shall be liable to the other for any special, indirect, incidental, consequential or punitive damages arising out of or relating to this Agreement, whether resulting from negligence, breach or any other cause. To the extent that a competent court or tribunal or other competent dispute resolution body or authority finally determines, notwithstanding the exclusion contained in this clause, that ECD Connect is liable to you for any damages, ECD Connect’s liability to you for any damages howsoever arising shall be limited to.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`14`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Cession and Delegation`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`14.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`You may not sell, cede, assign, delegate or in any other way alienate or dispose of any or all of your rights and obligations under and in terms of this Agreement without the prior written approval of ECD Connect. ECD Connect shall be entitled to sell, cede, assign, delegate, alienate, dispose or transfer any or all of its rights and obligations under and in terms of this Agreement to any of its affiliates or to any third party without your consent and without notice to you provided that you are not unduly prejudiced as a result. “Affiliates” for this purpose includes ECD Connect’s holding company, the holding company(ies) of ECD Connect’s holding company (collectively “its holding companies”), its subsidiaries, subsidiaries of its holding companies and any other companies which are directly or indirectly controlled by ECD Connect or are under common control with ECD Connect.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`15`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Jurisdiction`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`15.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`You hereby consent to the jurisdiction of the Magistrate's Court in the Republic of South Africa in respect of any proceedings that may be initiated by ECD Connect arising out of this Agreement, provided that ECD Connectshall be entitled, in its reasonable discretion, to institute such proceedings in the High Court of South Africa and, in such event, you consent to the jurisdiction of such court. The jurisdiction of the Small Claims Court is specifically excluded, as the parties agreed to follow the arbitration process set out in clause 6 above.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`16`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`Amendment of this agreement`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`16.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`ECD Connect reserves the right to amend this agreement from time to time. Any new version of the Agreement will be displayed on our Platform together with the date on which it will become effective, which will never be less than 30 (thirty) days after the date on which it is first published. ECD Connect will notify you if any amendments have been made.`}
            color={'textMid'}
          />
        </div>
        <div className="flex items-center gap-4">
          <Typography
            type="body"
            text={`17`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
          <Typography
            type="body"
            text={`General`}
            className="mb-4"
            color={'textDark'}
            weight="bold"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`17.1`} color={'textMid'} />
          <Typography
            type="body"
            text={`The parties acknowledge and agree that this Agreement constitutes the whole of the agreement between them and that no other agreements, guarantees, undertakings or representations, either verbal or in writing, relating to the subject matter of this Agreement not incorporated in this Agreement shall be binding on the parties. No variation or addition of this Agreement or the Application Form will be binding on any of the parties unless recorded in writing and signed by both parties.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`17.2`} color={'textMid'} />
          <Typography
            type="body"
            text={`ECD Connect is in terms of section 43 of the ECT Act required to make its contact details, its domicilia citandi et executandi and certain other information available to its Subscribers who enter into electronic transactions with ECD Connect. This information is available on our Legal Notices Website.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`17.3`} color={'textMid'} />
          <Typography
            type="body"
            text={`You agree that any notices we send to you in terms of any agreement concluded between us may be sent via e-mail unless otherwise prescribed by law.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`17.4`} color={'textMid'} />
          <Typography
            type="body"
            text={`No indulgence, leniency or extension of time which ECD Connect may grant or show to you shall in any way prejudice ECD Connect or preclude ECD Connect from exercising any of its rights in the future.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`17.5`} color={'textMid'} />
          <Typography
            type="body"
            text={`You warrant that as at the date of online application and registration, all the details furnished by you to ECD Connect are true and correct and that you will notify ECD Connect in the event of any change to such details.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`17.6`} color={'textMid'} />
          <Typography
            type="body"
            text={`All our terms and conditions can be accessed, stored, and reproduced electronically by you.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`17.7`} color={'textMid'} />
          <Typography
            type="body"
            text={`The physical address where ECD Connect will receive legal service of documents/ domicilium citandi et executandi is the following: 1 Wodin Rd, Claremont, South Africa`}
            color={'textMid'}
          />
        </div>
        <Typography
          type="h2"
          text={`Schedule 1: Organisational User Consent`}
          color={'textDark'}
          className="mt-8 mb-4"
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
          text={`When you are a Subscriber to the Platform and use the Services, we collect and use your personal information. We also collect anonymised data such as online behaviour and usage details. Such anonymised data will not relate to an identifiable data subject and as such is not personal information.`}
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
            • \u00A0\u00A0\u00A0information about behaviour and attendance;
            •\u00A0\u00A0\u00A0 information about health, safety and welfare;
            •\u00A0\u00A0\u00A0 financial information (re fees, scholarships etc); and
            •\u00A0\u00A0\u00A0 other personal information.`}
          color={'textMid'}
          className="my-4"
        />
        <Typography
          text={`<span class='text-textDark font-bold'>NOTE: </span>  If your organisation is not the primary account holder of a customised/white labelled version of the ECD Connect platform but utilises another organisation’s customised/white labelled platform, (e.g. as a franchisor or implementor for another organisation) then that primary organisational user/account holder will also have access to the user information, and online behaviour/platform usage details of practitioners, caregivers and children associated with your organisation.`}
          type={'markdown'}
          color="textMid"
          className="w-full"
          hasMarkup
        />
        <Typography
          type="body"
          text={`Further details of the personal information we collect about you can be found in our Privacy Policy.`}
          color={'textDark'}
          className="my-4"
        />
        <Typography
          type="body"
          text={`Your obligations to share information:`}
          color={'textDark'}
          weight="bold"
          className="my-4"
        />
        <Typography
          type="body"
          text={`If you are an organisation who has customised/white labelled a version of the ECD Connect platform and do not host your version of the platform with ECD Connect you are required to share anonymised user data via email on an annual basis on the anniversary of the commencement of this agreement. That email should be addressed to ecdconnect@dgmt.co.za with the heading in the following format: [Organisation's name): ECD Connect Data).`}
          color={'textMid'}
        />
        <Typography
          type="body"
          text={`How we use your information and the legal basis:`}
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
            • \u00A0\u00A0\u00A0 to provide you with appropriate education and support;
            •\u00A0\u00A0\u00A0 to monitor academic progress;
            •\u00A0\u00A0\u00A0 to help manage applications, fees and fundings;
            •\u00A0\u00A0\u00A0 to help co-ordinate, evaluate, fund and organise ECD educational programmes;;
            • \u00A0\u00A0\u00A0 to comply with our legal obligations as a not for profit social innovator;
            •\u00A0\u00A0\u00A0 to comply with our monitoring and reporting obligations;
            •\u00A0\u00A0\u00A0 to process appeals, resolve disputes, and defend litigation etc.`}
          color={'textMid'}
          className="my-4"
        />
        <Typography
          type="body"
          text={`For further information on what personal information we collect, why we collect it, how we use it, and the legal basis for same, please go to our Privacy Policy.`}
          color={'textMid'}
        />
        <Typography
          type="body"
          text={`How we share your information:`}
          color={'textDark'}
          weight="bold"
          className="my-4"
        />
        <Typography
          type="body"
          text={`•\u00A0\u00A0\u00A0 We share your personal information with third parties, as set out in our Privacy Policy.
            • \u00A0\u00A0\u00A0The level of sharing and the nature of what is shared depend on various factors.
            •\u00A0\u00A0\u00A0 We also share your personal information with our IT service providers`}
          color={'textMid'}
          className="my-4"
        />
        <div className="flex flex-col gap-4">
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
          <Typography
            type="body"
            text={`We do not engage in automated decision making/profiling.`}
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
        <Typography
          type="body"
          text={`•\u00A0\u00A0\u00A0 Right to complain to the Office of the Information Regulator.`}
          color={'textMid'}
          className="my-4"
        />
        <div className="flex flex-col gap-4">
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
          onClick={() => setViewIndividualTerms(false)}
          icon="XIcon"
        />
      </div>
    </BannerWrapper>
  );
};
