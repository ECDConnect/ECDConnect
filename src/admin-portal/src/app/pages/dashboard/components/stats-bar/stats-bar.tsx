import { classNames } from '@ecdlink/ui';
import { CogIcon } from '@heroicons/react/solid';

export interface StatsBarProps {
  stats: any[];
  gridClass: string;
  showDialog?: (item) => void;
}

export default function StatsBar({
  stats,
  gridClass,
  showDialog,
}: StatsBarProps) {
  return (
    <div>
      <dl className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:${gridClass}`}>
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-uiBg relative overflow-hidden rounded-lg  px-4 pt-5 sm:px-6 sm:pt-6"
          >
            {item.showDateRange && (
              <CogIcon
                className="text-primary absolute right-2 top-2 h-6 w-6 cursor-pointer"
                onClick={() => showDialog(item)}
              />
            )}
            <dt>
              <div className={`absolute rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p
                className="ml-16 truncate text-sm font-medium text-gray-500"
                title={item.name}
              >
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>
              <p
                className={classNames(
                  item.changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              ></p>
            </dd>
            {item.miniText && (
              <span className="absolute bottom-2 right-2 truncate text-sm font-medium text-gray-500">
                {item.miniText}
              </span>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
