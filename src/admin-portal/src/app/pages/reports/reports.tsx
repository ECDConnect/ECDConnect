import { usePanel } from '@ecdlink/core';
import { ClipboardListIcon, ClockIcon } from '@heroicons/react/outline';
import TrackingAttendanceReport from './components/tracking-attendance-report/tracking-attendance-report';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const actions = [
  {
    title: 'Tracking Attendance',
    description:
      'A report consisting of Practitioner attendance records filtered by a date range',
    disabled: false,
    icon: ClockIcon,
    iconForeground: 'text-white',
    iconBackground: 'bg-primary',
    report: <TrackingAttendanceReport />,
  },
  {
    title: 'Audit log',
    description: 'Coming soon',
    disabled: true,
    icon: ClipboardListIcon,
    iconForeground: 'text-white',
    iconBackground: 'bg-secondary',
    report: null,
  },
];

export function Reports() {
  const panel = usePanel();

  const displayPanel = (action: any) => {
    panel({
      noPadding: true,
      title: action.title,
      render: (onSubmit: any) => action.report,
    });
  };

  return (
    <div className="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
      {actions.map((action, actionIdx) => (
        <div
          onClick={() => {
            displayPanel(action);
          }}
          key={action.title}
          className={classNames(
            actionIdx === 0
              ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none'
              : '',
            actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
            actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
            actionIdx === actions.length - 1
              ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
              : '',
            'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
          )}
        >
          <div>
            <span
              className={classNames(
                action.iconBackground,
                action.iconForeground,
                'rounded-lg inline-flex p-3 ring-4 ring-white'
              )}
            >
              <action.icon className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium">
              <div className="focus:outline-none">
                {/* Extend touch target to entire panel */}
                <span className="absolute inset-0" aria-hidden="true" />
                {action.title}
              </div>
            </h3>
            <p className="mt-2 text-sm text-gray-500">{action.description}</p>
          </div>
          {!action.disabled ? (
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default Reports;
