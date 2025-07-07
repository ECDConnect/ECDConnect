import { ChipConfig, Colours } from '@ecdlink/ui';
import { SearchDropDownOption } from './SearchDropDownOption';

export interface SearchChipItem {
  count: number;
  config: ChipConfig;
}

export interface SearchSortOptions {
  columns: SearchDropDownOption<string>[];
  defaultSort?: SortItem;
  colour?: Colours;
}

export interface SearchFilterOptions {
  options: SearchDropDownOption<any>[];
  filterInfo?: FilterInfo;
  mutliple?: boolean;
  colour?: Colours;
}

type SortDir = 'asc' | 'desc';

export interface FilterInfo {
  filterName: string;
  filterHint: string;
}

export interface SortItem {
  column: string;
  dir: SortDir;
}
