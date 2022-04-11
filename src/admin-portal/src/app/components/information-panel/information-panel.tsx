import { NavigationDto } from '@ecdlink/core';
import { Typography } from '@ecdlink/ui';

/* eslint-disable-next-line */
export interface InformationPanelProps {
  siteInformation?: NavigationDto;
}

export default function InformationPanel(props: InformationPanelProps) {
  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="pt-8">
        <div className="grid grid-cols-2">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {props.siteInformation?.name}
          </h3>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-12">
            <Typography
              type={'markdown'}
              text={props.siteInformation?.description}
            />{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
