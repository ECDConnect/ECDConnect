import { Colours } from '@ecdlink/ui';

import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import P1 from '@/assets/pillar/p1.svg';
import P2 from '@/assets/pillar/p2.svg';
import P3 from '@/assets/pillar/p3.svg';
import P5 from '@/assets/pillar/p5.svg';

export const activities: {
  name: string;
  color?: Colours;
  hexColor?: string;
  iconHexBgColor: string;
  iconUrl: string;
}[] = [
  {
    name: 'Child folders opened',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Infant,
  },
  {
    name: 'Pregnant mom folders opened',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Pregnant,
  },
  {
    name: 'Early identification of pregnancy',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Pregnant,
  },
  {
    name: 'Maternal distress screening',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Pregnant,
  },
  {
    name: 'Maternal malnutrition screening',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
  {
    name: 'Alcohol abuse screening',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Pregnant,
  },
  {
    name: 'Child support grant',
    hexColor: '#FDE6DD',
    iconHexBgColor: '#FF9D7B',
    iconUrl: P5,
  },
  {
    name: 'Developmental screening',
    hexColor: '#FFF3CF',
    iconHexBgColor: '#FFCE41',
    iconUrl: P2,
  },
  {
    name: 'Growth monitoring - weight',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
  {
    name: 'Growth monitoring - length',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
  {
    name: 'Growth monitoring - MUAC',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
  {
    name: 'Immunisations',
    hexColor: '#F3EFE8',
    iconHexBgColor: '#D8C498',
    iconUrl: P3,
  },
  {
    name: 'Vitamin A',
    hexColor: '#F3EFE8',
    iconHexBgColor: '#D8C498',
    iconUrl: P3,
  },
  {
    name: 'Deworming',
    hexColor: '#F3EFE8',
    iconHexBgColor: '#D8C498',
    iconUrl: P3,
  },
  {
    name: 'Breastfeeding clubs',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
];
