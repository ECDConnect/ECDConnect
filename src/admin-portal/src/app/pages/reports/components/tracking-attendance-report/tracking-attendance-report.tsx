/* This example requires Tailwind CSS v2.0+ */
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  b64toBlob,
  getArrayRange,
  PermissionEnum,
  PractitionerDto,
} from '@ecdlink/core';
import {
  GetAllPractitioner,
  MonthlyAttendanceRecordCSV,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';
import { useUser } from '../../../../hooks/useUser';

export default function TrackingAttendanceReport() {
  const { hasPermission } = useUser();
  const { data } = useQuery(GetAllPractitioner, {
    fetchPolicy: 'cache-and-network',
  });

  const [getMonthlyAttendanceRecordCSV, { data: reportData }] = useLazyQuery(
    MonthlyAttendanceRecordCSV,
    {
      variables: {
        startMonth: '',
        endMonth: '',
        ownerId: '',
      },
      fetchPolicy: 'cache-and-network',
    }
  );
  const [reportDownloaded, setReportDownloaded] = useState<boolean>(false);
  const monthsInYear = getArrayRange(1, 12);
  const years = getArrayRange(
    new Date().getFullYear() - 10,
    new Date().getFullYear()
  );

  useEffect(() => {
    if (
      reportData &&
      reportData.monthlyAttendanceRecordCSV &&
      !reportDownloaded
    ) {
      const b64Data = reportData.monthlyAttendanceRecordCSV.base64File;
      const contentType = reportData.monthlyAttendanceRecordCSV.fileType;
      const fileName = reportData.monthlyAttendanceRecordCSV.fileName;
      const extension = reportData.monthlyAttendanceRecordCSV.extension;
      const blob = b64toBlob(b64Data, contentType);

      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}${extension}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setReportDownloaded(true);
    }
  }, [reportData, reportDownloaded]);

  const [monthDropDownList, setMonthDropDownList] = useState<any[]>([]);
  const [yearDropDownList, setYearDropDownList] = useState<any[]>([]);

  useEffect(() => {
    const monthDropDownListToAdd: any[] = [];
    const yearDropDownListToAdd: any[] = [];

    monthsInYear.forEach((month) => {
      const date = new Date();
      const dateFill = new Date(date.getFullYear(), month - 1, date.getDay());
      const monthName = format(dateFill, 'LLL');
      monthDropDownListToAdd.push({ key: month, value: monthName });
    });
    setMonthDropDownList(monthDropDownListToAdd);

    years.forEach((year) => {
      yearDropDownListToAdd.push({ key: year, value: year.toString() });
    });

    setYearDropDownList(yearDropDownListToAdd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schema = Yup.object().shape({
    startMonth: Yup.string().required(),
    endMonth: Yup.string().required(),
  });

  const initialValues = {
    startMonth: new Date(),
    endMonth: new Date(),
    ownerId: '',
  };

  const { register, getValues, handleSubmit, setValue, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });
  const { errors, isValid } = formState;

  useEffect(() => {
    if (yearDropDownList && monthDropDownList && data) {
      setValue('startMonth', startOfMonth(new Date()), {
        shouldValidate: true,
      });

      setValue('endMonth', endOfMonth(new Date()), {
        shouldValidate: true,
      });

      if (data.GetAllPractitioner) {
        setValue('ownerId', data.GetAllPractitioner[0]?.userId, {
          shouldValidate: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDropDownList, monthDropDownList, data]);

  const onSubmit = async () => {
    if (isValid) {
      const formValues = getValues();
      await getMonthlyAttendanceRecordCSV({
        variables: {
          startMonth: formValues.startMonth.toISOString(),
          endMonth: formValues.endMonth.toISOString(),
          ownerId: formValues.ownerId,
        },
      });

      setReportDownloaded(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="pt-8">
          <div className="grid grid-cols-2">
            <span className="text-lg leading-6 font-medium text-gray-900"></span>
            <div className="flex justify-end">
              {hasPermission(PermissionEnum.view_report) && (
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Download Report
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <FormSelectorField
                label="Practitioner"
                nameProp={'ownerId'}
                register={register}
                options={
                  data &&
                  data.GetAllPractitioner &&
                  data.GetAllPractitioner.map((x: PractitionerDto) => {
                    return {
                      key: x.userId,
                      value: `${x.user?.firstName} ${x.user?.surname}`,
                    };
                  })
                }
                error={errors.ownerId?.message}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                From
              </label>
              <DatePicker
                placeholderText={'Please select a date'}
                className="mt-1 w-full border-gray-300 rounded-md text-sm focus:border-primary focus:ring-primary shadow-sm"
                selected={getValues() ? getValues().startMonth : undefined}
                onChange={(date: Date) => setValue('startMonth', date)}
                dateFormat="EEE, dd MMM yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={80}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                To
              </label>
              <DatePicker
                placeholderText={'Please select a date'}
                className="mt-1 w-full border-gray-300 rounded-md text-sm focus:border-primary focus:ring-primary shadow-sm"
                selected={getValues() ? getValues().endMonth : undefined}
                onChange={(date: Date) => setValue('endMonth', date)}
                dateFormat="EEE, dd MMM yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={80}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
