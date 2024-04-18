import {
  ActionModal,
  Breadcrumb,
  BreadcrumbProps,
  Button,
  DialogPosition,
  Divider,
  FormInput,
  LoadingSpinner,
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
  NOTIFICATION,
  ReferralDetails,
  formatStringWithFirstLetterCapitalized,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import ROUTES from '../../../routes/app.routes-constants';
import {
  ViewReferralDetailRouteParams,
  ViewReferralDetailsRouteState,
} from '../view-referral-detail/types';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  AddVisitBackReferralAdminComment,
  GetReferrals,
} from '@ecdlink/graphql';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export const EditBackReferral = () => {
  const { visitDataStatusId, referralType } = useParams<
    EditBackReferralRouteParams & ViewReferralDetailRouteParams
  >();

  const { state } = useLocation<EditBackReferralRouteState>();

  const [addVisitBackReferralAdminComment, { loading: addingComment }] =
    useMutation(AddVisitBackReferralAdminComment);

  const apolloClient = useApolloClient();

  const referral = state.referral;

  const [comment, setComment] = useState<string>();
  const [isCommentSaved, setIsCommentSaved] = useState(true);

  const history = useHistory();

  const dialog = useDialog();

  const { setNotification } = useNotifications();

  useEffect(() => {
    if (!comment && !!referral?.adminBackReferralNote) {
      setComment(referral?.adminBackReferralNote);
    }
  }, [comment, referral?.adminBackReferralNote]);

  const paths: BreadcrumbProps['paths'] = [
    { name: 'Referrals', url: isCommentSaved ? ROUTES.REFERRALS.ROOT : '' },
    {
      name: 'View referral detail',
      url: isCommentSaved
        ? ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.ROOT.replace(
            ':referralType',
            referralType
          )
        : '',
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
      value: referral?.client ?? '-',
    },
    {
      name: 'CHW:',
      value: referral?.healthCareWorker ?? '-',
    },
    {
      name: 'Referral created on:',
      value: !!referral?.createdDate
        ? format(new Date(referral?.createdDate), 'dd MMMM yyyy')
        : '-',
      className: 'mt-4',
    },
    {
      name: 'Was the referral made?',
      value: referral?.isCompleted ? 'Yes' : 'No',
    },
    {
      name: 'Referral made on:',
      value: !!referral?.completedDate
        ? format(new Date(referral?.completedDate), 'dd MMMM yyyy')
        : '-',
    },
    {
      name: 'Referral text:',
      value: referral?.text ?? '-',
      className: 'flex-col mb-4',
      type: 'markdown',
    },
    {
      name: 'Was a back-referral made?',
      value: referral?.isBackReferralCompleted ? 'Yes' : 'No',
    },
    {
      name: 'CHW back-referral note:',
      value: referral?.healthCareWorkerBackReferralNote ?? '-',
    },
  ];

  const onSave = async () => {
    addVisitBackReferralAdminComment({
      variables: {
        visitDataStatusId,
        comment,
      },
    }).then((res) => {
      if (!!res?.data?.addVisitBackReferralAdminComment) {
        setIsCommentSaved(true);
        setNotification({
          title: 'Back-referral note updated!',
          variant: NOTIFICATION.SUCCESS,
        });
      }
    });
  };

  const onBack = () => {
    history.push(
      ROUTES.REFERRALS.VIEW_REFERRAL_DETAIL.ROOT.replace(
        ':referralType',
        referralType
      ),
      { clinicIds: state.clinicIds } as ViewReferralDetailsRouteState
    );
  };

  const onCancel = () => {
    if (!isCommentSaved) {
      return dialog({
        color: 'bg-white',
        position: DialogPosition.Middle,
        render: (onClose) => (
          <ActionModal
            buttonClass="rounded-xl"
            iconColor="alertMain"
            icon="ExclamationCircleIcon"
            title="Are you sure you want to leave without saving your changes?"
            detailText="If you leave now, you will lose all of your changes."
            actionButtons={[
              {
                leadingIcon: 'TrashIcon',
                text: 'Delete changes',
                type: 'filled',
                colour: 'secondary',
                textColour: 'white',
                onClick: () => {
                  onClose();
                  onBack();
                },
              },
              {
                leadingIcon: 'PencilIcon',
                text: 'Keep editing',
                type: 'outlined',
                colour: 'secondary',
                textColour: 'secondary',
                onClick: onClose,
              },
            ]}
          />
        ),
      });
    }

    onBack();
  };

  return (
    <div className="bg-adminPortalBg h-auto rounded-2xl p-4">
      <Breadcrumb paths={paths} />
      <div className="mt-9 mb-9 flex justify-between">
        <Typography
          type="h1"
          text={`${referral?.client ?? ''} - referral`}
          color="textDark"
        />
        <Button
          type="filled"
          color="errorBg"
          textColor="tertiary"
          text="Cancel"
          icon="XIcon"
          className="rounded-xl p-2 shadow-none hover:opacity-80"
          isLoading={addingComment}
          disabled={addingComment}
          onClick={onCancel}
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
          onChange={(e) => {
            setIsCommentSaved(false);
            setComment(e.target.value);
          }}
        />
      </div>
      <Button
        type="filled"
        color="secondary"
        textColor="white"
        text="Save"
        icon="SaveIcon"
        className="my-8 w-full rounded-xl p-2 shadow-none hover:opacity-80 md:w-72"
        isLoading={addingComment}
        disabled={addingComment || !comment || isCommentSaved}
        onClick={onSave}
      />
    </div>
  );
};
