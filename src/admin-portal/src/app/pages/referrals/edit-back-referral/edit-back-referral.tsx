import {
  Breadcrumb,
  BreadcrumbProps,
  Button,
  Divider,
  FormInput,
  Typography,
  TypographyProps,
  classNames,
} from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import {
  EditBackReferralRouteParams,
  EditBackReferralRouteState,
} from './types';
import {
  ReferralDetails,
  formatStringWithFirstLetterCapitalized,
} from '@ecdlink/core';
import ROUTES from '../../../routes/app.routes-constants';
import { ViewReferralDetailRouteParams } from '../view-referral-detail/types';
import { useApolloClient } from '@apollo/client';
import { GetReferrals } from '@ecdlink/graphql';
import { format } from 'date-fns';

export const EditBackReferral = () => {
  const { client, referralType } = useParams<
    EditBackReferralRouteParams & ViewReferralDetailRouteParams
  >();

  const { state } = useLocation<EditBackReferralRouteState>();

  const apolloClient = useApolloClient();

  const { referrals } =
    apolloClient.readQuery<{ referrals?: ReferralDetails[] }>({
      query: GetReferrals,
      variables: {
        type: formatStringWithFirstLetterCapitalized(referralType),
        startDate: state?.startDate,
        endDate: state?.endDate,
      },
    }) || {};

  const selectedClient = referrals?.find(
    (referral) => referral.client === client
  );

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

  const details: {
    name: string;
    value: string;
    className?: string;
    type?: TypographyProps['type'];
  }[] = [
    {
      name: 'Client:',
      value: selectedClient?.client ?? '-',
    },
    {
      name: 'CHW:',
      value: selectedClient?.healthCareWorker ?? '-',
    },
    {
      name: 'Referral created on:',
      value: !!selectedClient?.createdDate
        ? format(new Date(selectedClient?.createdDate), 'dd MMMM yyyy')
        : '-',
      className: 'mt-4',
    },
    {
      name: 'Was the referral made?',
      value: selectedClient?.isCompleted ? 'Yes' : 'No',
    },
    {
      name: 'Referral made on:',
      value: !!selectedClient?.completedDate
        ? format(new Date(selectedClient?.completedDate), 'dd MMMM yyyy')
        : '-',
    },
    {
      name: 'Referral text:',
      value: selectedClient?.text ?? '-',
      className: 'flex-col mb-4',
      type: 'markdown',
    },
    {
      name: 'Was a back-referral made?',
      value: selectedClient?.isBackReferralCompleted ? 'Yes' : 'No',
    },
    {
      name: 'CHW back-referral note:',
      value: selectedClient?.healthCareWorkerBackReferralNote ?? '-',
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
          <div className={classNames(detail.className, 'flex  gap-2')}>
            <Typography type="h4" text={detail.name} color="textDark" />
            <Typography
              type={detail?.type ?? 'body'}
              text={detail.value}
              color="textDark"
            />
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
        className="my-8 w-full rounded-xl p-2 shadow-none hover:opacity-80 md:w-72"
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
