import { XCircleIcon } from '@heroicons/react/solid';

export interface AlertProps {
  alertMessage: string;
  errors: string[];
}

export default function AlertError(props: AlertProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {props.alertMessage}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {props.errors.map((error) => {
                return <li key={error}>{error}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
