import Breast from '@/assets/pillar/pillar1/breastMilk.jpg';
import Starch from '@/assets/pillar/pillar1/starch.jpg';
import Nuts from '@/assets/pillar/pillar1/nuts.jpg';
import Dairy from '@/assets/pillar/pillar1/dairy.jpg';
import Meat from '@/assets/pillar/pillar1/meat.jpg';
import Egg from '@/assets/pillar/pillar1/egg.jpg';
import Vitamin from '@/assets/pillar/pillar1/vitamin.jpg';
import OtherFruits from '@/assets/pillar/pillar1/otherFruits.jpg';

export const noneOption = 'None of the above';

export const options = (isChild6Months: boolean) => [
  ...(isChild6Months
    ? [
        {
          icon: <img src={Breast} alt="breastMilk" className="rounded-full" />,
          title: 'Breast milk',
          description: '',
        },
      ]
    : []),
  {
    icon: <img src={Starch} alt="starch" className="rounded-full" />,
    title: 'Starch',
    description: 'Examples: mielie meal/pap, rice, potatoes, pasta, bread',
  },
  {
    icon: <img src={Nuts} alt="nuts" className="rounded-full" />,
    title: 'Nuts, beans, peas, lentils',
    description: 'Examples: soya, peanuts, kidney beans',
  },
  {
    icon: <img src={Dairy} alt="dairy" className="rounded-full" />,
    title: 'Dairy',
    description: 'Examples: amasi, yoghurt, cheese, milk',
  },
  {
    icon: <img src={Meat} alt="meat" className="rounded-full" />,
    title: 'Meat',
    description: 'Examples: chicken, minced meat, liver, fish, mopani worms',
  },
  {
    icon: <img src={Egg} alt="egg" className="rounded-full" />,
    title: 'Eggs',
  },
  {
    icon: <img src={Vitamin} alt="vitamin" className="rounded-full" />,
    title: 'Vitamin A rich fruit & vegetables',
    description:
      'Examples: mango, paw paw, peaches, apricots, naartjies, oranges, guava, carrot, pumpkin, sweet potato (orange or dark yellow flesh only), squash (orange or dark yellow flesh only)',
  },
  {
    icon: <img src={OtherFruits} alt="otherFruits" className="rounded-full" />,
    title: 'Other fruits & vegetables',
    description:
      'Examples: broccoli, spinach, morogo, sweet potato leaves, apples, avocado, banana, peach, pear, grapes, watermelon, cabbage, cauliflower, onion, mushroom, tomato',
  },
  {
    title: noneOption,
  },
];
