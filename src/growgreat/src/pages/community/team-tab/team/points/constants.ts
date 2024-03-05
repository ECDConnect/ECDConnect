import { Colours } from '@ecdlink/ui';

import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import P1 from '@/assets/pillar/p1.svg';
import P2 from '@/assets/pillar/p2.svg';
import P3 from '@/assets/pillar/p3.svg';
import P5 from '@/assets/pillar/p5.svg';
import { ActivityId } from '@/constants/Community';

export const activities: {
  id: ActivityId;
  name: string;
  color?: Colours;
  hexColor?: string;
  iconHexBgColor: string;
  iconUrl: string;
}[] = [
  {
    id: ActivityId.ChildFoldersOpened,
    name: 'Child folders opened',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Infant,
  },
  {
    id: ActivityId.PregnantMomFoldersOpened,
    name: 'Pregnant mom folders opened',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Pregnant,
  },
  {
    id: ActivityId.EarlyIdentificationOfPregnancy,
    name: 'Early identification of pregnancy',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Pregnant,
  },
  {
    id: ActivityId.MaternalDistressScreening,
    name: 'Maternal distress screening',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Pregnant,
  },
  {
    id: ActivityId.MaternalMalnutritionScreening,
    name: 'Maternal malnutrition screening',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
  {
    id: ActivityId.AlcoholAbuseScreening,
    name: 'Alcohol abuse screening',
    color: 'uiBg',
    iconHexBgColor: '#FAAB35',
    iconUrl: Pregnant,
  },
  {
    id: ActivityId.ChildSupportGrant,
    name: 'Child support grant',
    hexColor: '#FDE6DD',
    iconHexBgColor: '#FF9D7B',
    iconUrl: P5,
  },
  {
    id: ActivityId.DevelopmentalScreening,
    name: 'Developmental screening',
    hexColor: '#FFF3CF',
    iconHexBgColor: '#FFCE41',
    iconUrl: P2,
  },
  {
    id: ActivityId.GrowthMonitoringWeight,
    name: 'Growth monitoring - weight',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
  {
    id: ActivityId.GrowthMonitoringLength,
    name: 'Growth monitoring - length',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
  {
    id: ActivityId.GrowthMonitoringMUAC,
    name: 'Growth monitoring - MUAC',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
  {
    id: ActivityId.Immunisations,
    name: 'Immunisations',
    hexColor: '#F3EFE8',
    iconHexBgColor: '#D8C498',
    iconUrl: P3,
  },
  {
    id: ActivityId.VitaminA,
    name: 'Vitamin A',
    hexColor: '#F3EFE8',
    iconHexBgColor: '#D8C498',
    iconUrl: P3,
  },
  {
    id: ActivityId.Deworming,
    name: 'Deworming',
    hexColor: '#F3EFE8',
    iconHexBgColor: '#D8C498',
    iconUrl: P3,
  },
  {
    id: ActivityId.BreastfeedingClubs,
    name: 'Breastfeeding clubs',
    hexColor: '#E3F4F5',
    iconHexBgColor: '#8CDBDF',
    iconUrl: P1,
  },
];
