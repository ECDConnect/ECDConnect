import { Colours } from '../../../models/Colours';

export enum ChipStatus {
  Available = 1,
  ComingSoon = 2,
}

export interface ChipColourPalette {
  borderColour: Colours;
  textColour: Colours;
  backgroundColour: Colours;
}

export interface ChipConfig {
  text: string;
  colorPalette: ChipColourPalette;
}
