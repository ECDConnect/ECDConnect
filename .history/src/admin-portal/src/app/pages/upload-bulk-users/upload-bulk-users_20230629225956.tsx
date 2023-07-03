import FormField from '../../components/form-field/form-field';
import { Alert, Button, DialogPosition, Typography, SA_CELL_REGEX, SA_ID_REGEX } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleIcon, TrashIcon, StarIcon, SaveIcon, ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/solid';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  initialPasswordValue,
  initialUserDetailsValues,
  NOTIFICATION,
  passwordSchema,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
  UserDto,
} from '@ecdlink/core';
import AlertModal from '../../components/dialog-alert/dialog-alert';
import {
  DeleteUser,
  GetHealthCareWorkerByUserId,
  CreateHealthCareWorker,
  UpdateHealthCareWorker,
  GetHealthCareWorkerHighlights,
  GetTenantContext,
  GetUserById,
  ResetUserPassword,
  UpdateUser,
  UserModelInput,
  healthCareWorkerVisitStatus
} from '@ecdlink/graphql';
import UserDetailsForm from '../users/components/user-details-form/user-details-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '../../hooks/useUser';
import * as yup from 'yup';

import zxcvbn from 'zxcvbn-typescript';

const userSchema = yup.object().shape({
  email: yup.string().email().required('email address is required'),
  idNumber: yup.string().matches(SA_ID_REGEX, 'Id number is not valid').required('ID number is required'),
  phoneNumber: yup.string().matches(SA_CELL_REGEX, 'Phone number is not valid').required('Cellphone number is required'),
});

const adminUserschema = yup.object().shape({
  email: yup.string().email().required('email address is required')
});


export function UploadBulkUser(props: any) {
 
  return (
    <div className="bg-red flex min-w-0 flex-col xl:flex">
      <h1>BULK UPLOAD</h1>
    </div >

  );
}

export default UploadBulkUser;
