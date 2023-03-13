import { ActionModal, DialogPosition, Typography } from '@ecdlink/ui';
import { DialogModalOptions } from '@ecdlink/core';

export const showDialog =
  (dialog: (options: DialogModalOptions) => void) => () => {
    return dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            icon="QuestionMarkCircleIcon"
            iconColor="infoMain"
            iconClassName="h-10 w-10"
            title="Child support grant requirements"
            customDetailText={
              <div className="flex flex-col items-start">
                <Typography
                  type="h4"
                  text="To qualify for CSG:"
                  className="mb-4"
                />
                <Typography type="body" text="The primary caregiver must:" />
                {[
                  'Be a South African citizen or permanent resident',
                  'Live in South Africa',
                  'Not be paid to care for the child',
                  'Earn less than R48,000 a year (R4,000 a month) if single OR',
                  'Earn less than R96,000 a year (R8,000 a month) as a couple if married',
                ].map((item) => (
                  <li key={item} className="text-textMid">
                    {item}
                  </li>
                ))}
                <Typography
                  type="body"
                  text="And the child must:"
                  className="mt-4"
                />
                {[
                  'Live in South Africa',
                  'Live with the primary caregiver',
                  'Be under 18 years old',
                  'Not be in the care of a state institution',
                ].map((item) => (
                  <li key={item} className="text-textMid">
                    {item}
                  </li>
                ))}
              </div>
            }
            actionButtons={[
              {
                colour: 'primary',
                text: 'Close',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  };
