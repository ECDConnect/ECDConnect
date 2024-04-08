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
import {
  ViewReferralDetailRouteParams,
  ViewReferralDetailsRouteState,
} from '../view-referral-detail/types';
import { useApolloClient, useMutation } from '@apollo/client';
import {
  AddVisitBackReferralAdminComment,
  GetReferrals,
} from '@ecdlink/graphql';
import { format } from 'date-fns';
import { useState } from 'react';

export const EditBackReferral = () => {
  const { visitId, referralType } = useParams<
    EditBackReferralRouteParams & ViewReferralDetailRouteParams
  >();

  const { state } = useLocation<EditBackReferralRouteState>();

  const [addVisitBackReferralAdminComment, { loading }] = useMutation(
    AddVisitBackReferralAdminComment
  );

  const apolloClient = useApolloClient();

  const { referrals } =
    apolloClient.readQuery<{ referrals?: ReferralDetails[] }>({
      query: GetReferrals,
      variables: {
        type: formatStringWithFirstLetterCapitalized(referralType),
        startDate: state?.startDate,
        endDate: state?.endDate,
        clinicIds: state?.clinicIds,
      },
    }) || {};

  const selectedReferral = referrals?.find(
    (referral) => referral.visitId === visitId
  );

  const [comment, setComment] = useState(
    selectedReferral?.adminBackReferralNote ?? ''
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
      state,
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
      value: selectedReferral?.client ?? '-',
    },
    {
      name: 'CHW:',
      value: selectedReferral?.healthCareWorker ?? '-',
    },
    {
      name: 'Referral created on:',
      value: !!selectedReferral?.createdDate
        ? format(new Date(selectedReferral?.createdDate), 'dd MMMM yyyy')
        : '-',
      className: 'mt-4',
    },
    {
      name: 'Was the referral made?',
      value: selectedReferral?.isCompleted ? 'Yes' : 'No',
    },
    {
      name: 'Referral made on:',
      value: !!selectedReferral?.completedDate
        ? format(new Date(selectedReferral?.completedDate), 'dd MMMM yyyy')
        : '-',
    },
    {
      name: 'Referral text:',
      value: selectedReferral?.text ?? '-',
      className: 'flex-col mb-4',
      type: 'markdown',
    },
    {
      name: 'Was a back-referral made?',
      value: selectedReferral?.isBackReferralCompleted ? 'Yes' : 'No',
    },
    {
      name: 'CHW back-referral note:',
      value: selectedReferral?.healthCareWorkerBackReferralNote ?? '-',
    },
  ];

  const onSave = async () => {
    addVisitBackReferralAdminComment({
      variables: {
        visitBackReferralId: visitId,
        comment,
      },
    });

    // TODO: add green snackbar
  };

  return (
    <div className="bg-adminPortalBg h-full rounded-2xl p-4">
      <Breadcrumb paths={paths} />
      <div className="mt-9 mb-9 flex justify-between">
        <Typography
          type="h1"
          text={`${selectedReferral?.client ?? ''} - referral`}
          color="textDark"
        />
        <Button
          type="filled"
          color="errorBg"
          textColor="tertiary"
          text="Cancel"
          icon="XIcon"
          className="rounded-xl p-2 shadow-none hover:opacity-80"
          isLoading={loading}
          disabled={loading}
          onClick={() =>
            history.push(
              ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.ROOT.replace(
                ':referralType',
                referralType
              ),
              { clinicIds: state.clinicIds } as ViewReferralDetailsRouteState
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
          <div
            key={detail.name + detail.value}
            className={classNames(detail.className, 'flex  gap-2')}
          >
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <Button
        type="filled"
        color="secondary"
        textColor="white"
        text="Save"
        icon="SaveIcon"
        className="my-8 w-full rounded-xl p-2 shadow-none hover:opacity-80 md:w-72"
        isLoading={loading}
        disabled={loading || !comment}
        onClick={onSave}
      />
    </div>
  );
};
