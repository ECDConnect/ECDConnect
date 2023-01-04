import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline';
import { classNames } from '@ecdlink/ui';
import { Fragment, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

export interface FormSelectorFieldProps {
  label: string;
  options: any[]; // KEY / VALUE
  nameProp: string;
  setValue: UseFormSetValue<any>;
}

const FormThemeColorSelectorField: React.FC<FormSelectorFieldProps> = ({
  label,
  nameProp,
  options,
  setValue,
}) => {
  const [selected, setSelected] = useState({
    value: `Please select a ${nameProp}`,
  });

  const handleSelection = (option: any) => {
    setSelected(option);
    setValue(nameProp as string, option.value);
  };

  return (
    <Listbox value={selected} onChange={handleSelection}>
      <Listbox.Label className="block text-sm font-medium text-gray-700">
        {label}
      </Listbox.Label>
      <div className="relative mt-1">
        <Listbox.Button className="focus:outline-none focus:ring-primary focus:border-primary relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:ring-1 sm:text-sm">
          <div className="flex items-center">
            <span
              style={{ backgroundColor: selected?.value }}
              className={'inline-block h-2 w-2 flex-shrink-0 rounded-full'}
            />
            <span className="ml-3 block truncate">{selected?.value}</span>
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="focus:outline-none absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.key}
                className={({ active }) =>
                  classNames(
                    active ? 'bg-primary text-white' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9'
                  )
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <div className="flex items-center">
                      <span
                        style={{ backgroundColor: option.value }}
                        className={
                          'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                        }
                        aria-hidden="true"
                      />

                      <span
                        className={classNames(
                          selected ? 'font-semibold' : 'font-normal',
                          'ml-3 block truncate'
                        )}
                      >
                        {option.value}
                      </span>
                    </div>

                    {selected ? (
                      <span
                        className={classNames(
                          active ? 'text-white' : 'text-primary',
                          'absolute inset-y-0 right-0 flex items-center pr-4'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default FormThemeColorSelectorField;
