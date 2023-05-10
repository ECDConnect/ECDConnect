import pregnantHealthCare from '@/assets/healthcare.svg';
import Pregnant from '@/assets/pregnant.svg';
import P1 from '@/assets/pillar/p1.svg';
import IconCircleDanger from '@/assets/danger.svg';

export const activitiesTypes = {
  healthCare: 'Healthcare',
  nutrition: 'Nutrition',
  pregnancyCare: 'Pregnancy care',
  dangerSigns: 'Danger signs',
  followUp: 'Follow up',
};

export const activitiesSectionTypes = {
  healthCare: 'Clinic visits',
  nutrition: 'Mother growth monitoring (Mid-upper arm circumference)',
  pregnancyCare: 'ID document',
  dangerSigns: 'Danger signs',
  followUp: 'Follow up',
};

export const printMotherSectionTypes = {
  antenatalCare: 'Antenatal care',
  pregnancyCare: 'Pregnancy care',
  nutrition: 'Nutrition',
  dangerSigns: 'Danger signs',
  idDocument: 'ID document',
};

export const activitiesColours = {
  pillar1: {
    primaryColor: '#8CDBDF',
    secondaryColor: '#a2dadd4d',
  },
  pillar2: {
    primaryColor: '#FFCE41',
    secondaryColor: '#FFF3CF',
  },
  pillar3: {
    primaryColor: '#D8C498',
    secondaryColor: '#F3EFE8',
  },
  pillar4: {
    primaryColor: '#EE83B3',
    secondaryColor: '#FADAE8',
  },
  pillar5: {
    primaryColor: '#FF9D7B',
    secondaryColor: '#FDE6DD',
  },
  other: {
    primaryColor: '#FAAB35',
    secondaryColor: '#FEF1E8',
  },
};

const activitiesListClassname = 'text-textDark text-lg font-bold';

export const activitiesList = [
  {
    id: activitiesTypes.healthCare,
    menuIconUrl: pregnantHealthCare,
    title: activitiesTypes.healthCare,
    hexBackgroundColor: '#FEF1E8',
    iconBackgroundColor: 'tertiary',
    className: activitiesListClassname,
  },
  {
    id: activitiesTypes.nutrition,
    menuIconUrl: P1,
    title: activitiesTypes.nutrition,
    hexBackgroundColor: '#FEF1E8',
    iconBackgroundColor: 'tertiary',
    className: activitiesListClassname,
  },
  {
    id: activitiesTypes.pregnancyCare,
    menuIconUrl: Pregnant,
    title: activitiesTypes.pregnancyCare,
    hexBackgroundColor: '#FEF1E8',
    iconBackgroundColor: 'tertiary',
    className: activitiesListClassname,
  },
  {
    id: activitiesTypes.dangerSigns,
    menuIconUrl: IconCircleDanger,
    title: activitiesTypes.dangerSigns,
    hexBackgroundColor: '#FEF1E8',
    iconBackgroundColor: 'tertiary',
    className: activitiesListClassname,
  },
];
