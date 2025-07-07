import { Colours } from '../../models/Colours';
import { SpinnerSizeType } from './models/LoadingSpinner';

export const spinnerContainer = 'flex justify-center items-center px-1';
export const spinnerBase = 'animate-spinner rounded-full border-2 border-t-2';

export const getSpinnerClass = (
  sizeType: SpinnerSizeType,
  spinnerColor: Colours,
  backgroundColor: Colours
) => {
  switch (sizeType) {
    case 'big':
      return (
        'h-8 w-8 ' +
        spinnerBase +
        (' border-t-' + spinnerColor.toString()) +
        (' border-' + backgroundColor.toString())
      );
    case 'medium':
      return (
        'h-6 w-6 ' +
        spinnerBase +
        (' border-t-' + spinnerColor.toString()) +
        (' border-' + backgroundColor.toString())
      );
    case 'small':
      return (
        'h-4 w-4 ' +
        spinnerBase +
        (' border-t-' + spinnerColor.toString()) +
        (' border-' + backgroundColor.toString())
      );
    default:
      return (
        'h-3 w-3 ' +
        spinnerBase +
        (' border-t-' + spinnerColor.toString()) +
        (' border-' + backgroundColor.toString())
      );
  }
};
