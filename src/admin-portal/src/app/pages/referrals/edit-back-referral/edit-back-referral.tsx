import {
  Breadcrumb,
  BreadcrumbProps,
  Button,
  Divider,
  FormInput,
  Typography,
  classNames,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { EditBackReferralRouteParams } from './types';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import ROUTES from '../../../routes/app.routes-constants';
import { ViewReferralDetailRouteParams } from '../view-referral-detail/types';

export const EditBackReferral = () => {
  const { client, referralType } = useParams<
    EditBackReferralRouteParams & ViewReferralDetailRouteParams
  >();

  const history = useHistory();

  const paths: BreadcrumbProps['paths'] = [
    { name: 'Referrals', url: ROUTES.REFERRALS.ROOT },
    {
      name: 'View referral detail',
      url: ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.ROOT.replace(
        ':referralType',
        referralType
      ),
    },
    { name: 'Edit back-referral', url: '' },
  ];

  // TODO: replace with real data
  const details = [
    {
      name: 'Client:',
      value: 'Amahle & Ted Khumalo',
    },
    {
      name: 'CHW:',
      value: 'Bulelwa Mahlangu',
    },
    {
      name: 'Referral created on:',
      value: '26 September 2023',
      className: 'mt-4',
    },
  ];

  return (
    <div className="bg-adminPortalBg h-full rounded-2xl p-4">
      <Breadcrumb paths={paths} />
      <div className="mt-9 mb-9 flex justify-between">
        <Typography
          type="h1"
          text={`${formatStringWithFirstLetterCapitalized(client)} - referral`}
          color="textDark"
        />
        <Button
          type="filled"
          color="errorBg"
          textColor="tertiary"
          text="Cancel"
          icon="XIcon"
          className="rounded-xl p-2 shadow-none hover:opacity-80"
          onClick={() =>
            history.push(
              ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.ROOT.replace(
                ':referralType',
                referralType
              )
            )
          }
        />
      </div>
      <div className="gap-2 rounded-xl bg-white p-12">
        <Typography
          type="h2"
          text="Details"
          color="textDark"
          className="mb-4"
        />
        {details.map((detail) => (
          <div className={classNames(detail.className, 'flex gap-2')}>
            <Typography type="h4" text={detail.name} color="textDark" />
            <Typography type="body" text={detail.value} color="textDark" />
          </div>
        ))}
        <Divider className="my-8" dividerType="dashed" />
        <Typography
          type="h2"
          text="Add a note to this back-referral"
          color="textDark"
        />
        <FormInput
          textInputType="textarea"
          className="mt-4"
          label="Add note *"
          hint="Add more information about the referral."
        />
      </div>
      <Button
        type="filled"
        color="secondary"
        textColor="white"
        text="Save"
        icon="SaveIcon"
        className="mt-8 w-full rounded-xl p-2 shadow-none hover:opacity-80 md:w-72"
        onClick={() =>
          history.push(
            ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.ROOT.replace(
              ':referralType',
              referralType
            )
          )
        }
      />
    </div>
  );
};
