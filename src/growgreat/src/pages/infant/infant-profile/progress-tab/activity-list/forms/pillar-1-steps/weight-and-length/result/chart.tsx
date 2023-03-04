import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeightOrHeightForAge {
  label: string;
  weight?: number[];
  height?: number[];
  month: number[];
}

interface WeightOrHeightForAgeProps {
  SD3: WeightOrHeightForAge;
  SD2: WeightOrHeightForAge;
  SD1: WeightOrHeightForAge;
  median: WeightOrHeightForAge;
  SD1Negative: WeightOrHeightForAge;
  SD2Negative: WeightOrHeightForAge;
}

const colours = {
  severely: { primary: '#E20000', secondary: 'rgba(226, 0, 0, 0.05)' },
  underweight: { primary: '#FF7A00', secondary: 'rgba(255, 122, 0, 0.15)' },
  normal: { primary: '#83BB26', secondary: 'rgba(131, 187, 38, 0.1)' },
};

export const Chart = ({
  data: chartData,
}: {
  data: WeightOrHeightForAgeProps;
}) => {
  const getLabel = (id: string) => {
    switch (id) {
      case '2 SD':
        return 'Severely underweight';
      case '-2 SD':
        return '+3 line';
      case '1 SD':
        return 'Underweight';
      case '-1 SD':
        return '+2 line';
      default:
        return 'Normal';
    }
  };

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          filter: (item) => item.text !== 'hide',
        },
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  };

  const data = (
    type: WeightOrHeightForAgeProps
  ): ChartData<'line', number[], number> => ({
    labels: type.median.month,
    datasets: [
      {
        label: 'hide',
        data: type.SD2?.weight || type.SD2.height || [],
        fill: 'end',
        borderColor: colours.severely.primary,
        backgroundColor: colours.severely.secondary,
        pointRadius: 0,
        borderWidth: 1,
      },
      {
        label: getLabel(type.SD2.label),
        data: type.SD2?.weight || type.SD2.height || [],
        fill: false,
        backgroundColor: colours.severely.primary,
        pointRadius: 0,
      },
      {
        label: 'hide',
        data: type.SD1?.weight || type.SD1.height || [],
        borderColor: colours.underweight.primary,
        backgroundColor: colours.underweight.secondary,
        pointRadius: 0,
        borderWidth: 1,
        fill: 'stack',
      },
      {
        label: getLabel(type.SD1.label),
        data: type.SD1?.weight || type.SD1.height || [],
        backgroundColor: colours.underweight.primary,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'hide',
        data: type.median?.weight || type.median.height || [],
        borderColor: colours.normal.primary,
        backgroundColor: colours.normal.secondary,
        pointRadius: 0,
        borderWidth: 1,
        fill: 'stack',
      },
      {
        label: getLabel(type.median.label),
        data: type.median?.weight || type.median.height || [],
        backgroundColor: colours.normal.primary,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'hide',
        data: type.SD1Negative?.weight || type.SD1Negative.height || [],
        borderColor: colours.underweight.primary,
        backgroundColor: colours.normal.secondary,
        pointRadius: 0,
        borderWidth: 1,
        fill: 'stack',
      },
      {
        label: getLabel(type.SD1Negative.label),
        data: type.SD1Negative?.weight || type.SD1Negative.height || [],
        backgroundColor: colours.underweight.primary,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'hide',
        data: type.SD2Negative?.weight || type.SD2Negative.height || [],
        borderColor: colours.severely.primary,
        backgroundColor: colours.underweight.secondary,
        pointRadius: 0,
        borderWidth: 1,
        fill: 'stack',
      },
      {
        label: getLabel(type.SD2Negative?.label),
        data: type.SD2Negative?.weight || type.SD2Negative.height || [],
        backgroundColor: colours.severely.primary,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'hide',
        data: type.SD2Negative?.weight || type.SD2Negative.height || [],
        backgroundColor: colours.severely.secondary,
        pointRadius: 0,
        borderWidth: 0,
        fill: 'start',
      },
    ],
  });

  return (
    <Line
      options={options}
      data={data(chartData)}
      className="overflow-hidden rounded-lg"
    />
  );
};
