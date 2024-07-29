import { useTheme } from '@ecdlink/core';
import { BannerWrapper, Typography } from '@ecdlink/ui';

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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
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
            color={'textDark'}
          />
          <Typography
            type="body"
            text={`"Juristic Person" means a company or close corporation and includes a body corporate, partnership, association or trust;`}
            className="mb-4"
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex items-center gap-4">
          <Typography type="body" text={`1.13`} color={'textDark'} />
          <div className="flex items-center gap-2">
            <Typography
              type="body"
              text={`“Legal Notices Website” means`}
              color={'textMid'}
            />
            <Typography
              text={`<a href="https://www.ecdconnect.org.za" target="_blank" class='text-quatenaryMain cursor-pointer'>www.ecdconnect.org.za</>`}
              type={'markdown'}
              color="textDark"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.14`} color={'textDark'} />
          <Typography
            type="body"
            text={`“Organisational User” means an affiliated organisation or franchisor registered to use the Platform and Services;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex items-center items-center gap-4">
          <Typography type="body" text={`1.15`} color={'textDark'} />
          <div className="flex items-center gap-2">
            <Typography
              type="body"
              text={`“Platform” means the ECD Connect platform available at`}
              color={'textMid'}
            />
            <Typography
              text={`<a href="https://www.ecdconnect.org.za" target="_blank" class='text-quatenaryMain cursor-pointer'>www.ecdconnect.org.za</>`}
              type={'markdown'}
              color="textDark"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.16`} color={'textDark'} />
          <Typography
            type="body"
            text={`“POPIA” means the Protection of Personal Information Act of 2013 as amended or replaced from time to time;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.17`} color={'textDark'} />
          <Typography
            type="body"
            text={`“Privacy Policy” means our privacy policy available here [www.myecdconnect.co.za] which will govern how we process personal information obtained by us via the Platform or your use of the Services in terms of POPIA;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.18`} color={'textDark'} />
          <Typography
            type="body"
            text={`“Third Party Service Provider” means a third party who provides services to you via the Platform;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.19`} color={'textDark'} />
          <Typography
            type="body"
            text={`“Service” means the content, tools or services available you on the Platform;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.20`} color={'textDark'} />
          <Typography
            type="body"
            text={`“Subscriber”, “you” means an Organisational User, an Individual User of any of the Platform or Service;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.21`} color={'textDark'} />
          <Typography
            type="body"
            text={`“Uncontrollable Event” means (including without limitation) any fire, flood, earthquake, elements of nature or acts of God, pandemics, acts of governmental authority, riots, civil disorders, rebellions or revolutions in any country or any other cause beyond the reasonable control of ECD Connect including the termination or suspension of a service or product provided by a third party, that may result in a delay or a failure to provide any Services or the Platform; and`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`1.22`} color={'textDark'} />
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
          <Typography type="body" text={`3.1`} color={'textDark'} />
          <Typography
            text={`The consumer protection provisions of the ECT Act, apply to transactions and communications that are executed electronically by a <a href="" target="_blank" class='text-quatenaryMain cursor-pointer'>natural person</a> . It also does not apply to paper-based
            transactions, e.g. where you apply for a service or product by
            completing an agreement in writing.`}
            type={'markdown'}
            color="textDark"
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
          <Typography type="body" text={`4.1`} color={'textDark'} />
          <Typography
            type="body"
            text={`ECD Connect will make the Platform available to you on the Activation Date.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.2`} color={'textDark'} />
          <Typography
            type="body"
            text={`ECD Connect will, where relevant, issue a user name to you prior to the Activation Date in order to enable you to gain access to and/or use the Platform. In such instance, you will not be able to access and/or use the Platform without a user name and password.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3`} color={'textDark'} />
          <Typography type="body" text={`You agree that:`} color={'textMid'} />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.1`} color={'textDark'} />
          <Typography
            type="body"
            text={`you will use your user name and password for your own personal use only;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.2`} color={'textDark'} />
          <Typography
            type="body"
            text={`you will not disclose your user name and password to any other person for any reason whatsoever and that you will maintain the confidentiality thereof;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.3`} color={'textDark'} />
          <Typography
            type="body"
            text={`in the event that your password is compromised, you will immediately notify ECD Connect and change your password;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.4`} color={'textDark'} />
          <Typography
            type="body"
            text={`you, as the holder of the user name and activity linked to your ECD Connect account, irrespective of whether the Platform has been utilized or is being utilized by you or not and accordingly the activity on your ECD Connect account will be deemed to have arisen from (or relate to) your access to and/or use of a Service on the Platform;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.5`} color={'textDark'} />
          <Typography
            type="body"
            text={`you will not, at any time, permit and/or initiate a simultaneous network log-in; and`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.6`} color={'textDark'} />
          <Typography
            text={`you will not attempt to circumvent ECD Connect's user <a href="" target="_blank" class='text-quatenaryMain cursor-pointer'>authentication</a> .  processes or engage in attempts to access ECD Connect's network where not expressly authorised to do so.`}
            type={'markdown'}
            color="textDark"
            className="w-full"
            hasMarkup
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.7`} color={'textDark'} />
          <Typography
            type="body"
            text={`Please Note: You may not obtain any certification by using the Platform or the Services. It is provided to enhance your personal development, understanding of early childhood development and understanding the running of a business and of your finances.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`4.3.7`} color={'textDark'} />
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
          <Typography type="body" text={`5.1`} color={'textDark'} />
          <Typography
            text={`ECD Connect will use reasonable endeavors to make its Platform available to its users, and to maintain the availability thereof for use by its users. However, we provide the Platform “as is” and “as available” and do not warrant or guarantee that the services will at  <a href="" target="_blank" class='text-quatenaryMain cursor-pointer'>all times be free of errors or interruptions, be always</a> available, fit for any purpose, not infringe any third party rights, be secure and reliable, or will conform to your delivery timeline requirements.`}
            type={'markdown'}
            color="textDark"
            className="w-full"
            hasMarkup
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`5.2`} color={'textDark'} />
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
          <Typography type="body" text={`6.1`} color={'textDark'} />
          <Typography
            type="body"
            text={`All communications will abide by our Privacy Policy and applicable law. You will always be entitled to notify us in writing that you do not wish to receive or continue to receive such communications, to pre-emptively block the receipt of such communications.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.2`} color={'textDark'} />
          <Typography
            type="body"
            text={`Complaints must be submitted to ECD Connect and will be dealt with by ECD Connect in accordance with the provisions of this clause 6.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.3`} color={'textDark'} />
          <Typography
            type="body"
            text={`Without prejudice to your rights in law, you are required, to first approach us with any complaint or dispute and afford us an opportunity to resolve a complaint before you approach any other relevant authority, court or other dispute resolution body or refer the matter to Arbitration as contemplated in clause 6.7 below.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.4`} color={'textDark'} />
          <Typography
            text={`Please direct all complaints to <a href="" target="_blank" class='text-quatenaryMain cursor-pointer'>security@dgmt.co.za</a>. Your complaint should include the following:`}
            type={'markdown'}
            color="textDark"
            className="w-full"
            hasMarkup
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.4.1`} color={'textDark'} />
          <Typography
            type="body"
            text={`your name and surname;`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.4.2`} color={'textDark'} />
          <Typography
            type="body"
            text={`the date on which the complaint arose; and`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.4.3`} color={'textDark'} />
          <Typography
            type="body"
            text={`a brief description of what gave rise to the complaint.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.5`} color={'textDark'} />
          <Typography
            type="body"
            text={`You may approach any other relevant authority, court or dispute resolution body or refer the matter to Arbitration as set out in clause 6.7 below, for resolution of the dispute, should you not be satisfied with the proposed resolution of the dispute by ECD Connect.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.6`} color={'textDark'} />
          <Typography
            type="body"
            text={`Any dispute between the parties may be referred to arbitration and finally resolved in accordance with the rules of the Arbitration Foundation of Southern Africa. Such arbitration shall be held either in Cape Town, and conducted in the English language before one arbitrator appointed in accordance with the said rules. Any award will be final and not subject to appeal. This agreement to arbitrate shall be enforceable in, and judgement upon any award may be entered in any court of any country having appropriate jurisdiction. A dispute shall be deemed to have arisen when either party notifies the other party in writing to that effect.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.7`} color={'textDark'} />
          <Typography
            type="body"
            text={`The arbitrator shall have the power to give default judgement if any party fails to make submissions on due date and/or fails to appear at the arbitration.`}
            color={'textMid'}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <Typography type="body" text={`6.8`} color={'textDark'} />
          <Typography
            type="body"
            text={`The provisions set out above shall not prevent either party from approaching any court of competent jurisdiction to obtain interim or other relief in cases of urgency.`}
            color={'textMid'}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
