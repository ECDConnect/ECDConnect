import { ColorPicker, useColor } from 'react-color-palette';

export interface ColorPickerProps {
  currentColor: string;
  onSave: (value: string) => void;
  closeDialog: () => void;
}

export default function ColorPickerComponent({
  currentColor,
  closeDialog,
  onSave,
}: ColorPickerProps) {
  const [color, setColor] = useColor('hex', currentColor);

  const emitCloseDialog = () => {
    closeDialog();
  };

  const action = () => {
    onSave(color.hex);
  };

  return (
    <div className="bg-black">
      <ColorPicker
        width={384}
        height={228}
        color={color}
        onChange={setColor}
        hideHSV
        hideRGB
        dark
      />

      <div className="flex">
        <button
          onClick={() => emitCloseDialog()}
          type="submit"
          className="w-full disabled:opacity-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium  text-gray-700 bg-white hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
        >
          Cancel
        </button>

        <button
          onClick={() => action()}
          type="submit"
          className="w-full disabled:opacity-50 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium  text-white bg-primary hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
        >
          Save
        </button>
      </div>
    </div>
  );
}
