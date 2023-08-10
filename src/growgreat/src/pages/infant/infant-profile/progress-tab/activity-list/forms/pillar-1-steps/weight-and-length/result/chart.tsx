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
  TooltipItem,
  ScatterController,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  ScatterController,
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
}

export interface WeightOrHeightForAgeProps {
  date: number[];
  SD3: WeightOrHeightForAge;
  SD2: WeightOrHeightForAge;
  median: WeightOrHeightForAge;
  SD3neg: WeightOrHeightForAge;
  SD2neg: WeightOrHeightForAge;
}

export type DataSetType = keyof WeightOrHeightForAgeProps;

const colours = {
  severely: { primary: '#E20000', secondary: 'rgba(226, 0, 0, 0.05)' },
  underweight: { primary: '#FF7A00', secondary: 'rgba(255, 122, 0, 0.15)' },
  normal: { primary: '#83BB26', secondary: 'rgba(131, 187, 38, 0.1)' },
};

export const Chart = ({
  data: chartData,
  type,
  suffix,
  result,
  infantName,
}: {
  infantName: string;
  data: WeightOrHeightForAgeProps;
  type: 'weight' | 'length';
  suffix: string;
  result: (number | undefined)[];
}) => {
  const getLabel = (id: string) => {
    switch (id) {
      case '2 SD':
        return type === 'weight' ? 'Severely underweight' : 'Severely stunted';
      case '-2 SD':
        return '+2 line';
      case '3 SD':
        return type === 'weight' ? 'Underweight' : 'Stunted';
      case '-3 SD':
        return '+3 line';
      default:
        return 'Normal';
    }
  };

  const getData = (
    type: WeightOrHeightForAgeProps
  ): ChartData<'line', (number | undefined)[], number> => ({
    labels: type?.date,
    datasets: [
      {
        label: `hide`,
        data: result,
        borderColor: '#1D67D5',
        backgroundColor: '#1D67D5',
        borderWidth: 4,
        pointRadius: (context) => {
          const lastIndex = result.reduce((lastIndex, element, index) => {
            if (typeof element !== 'undefined') {
              return index;
            }
            return lastIndex;
          }, -1);

          if (context.dataIndex === lastIndex) {
            return 6; // larger point radius for last data point
          } else {
            return 0; // smaller point radius for all other data points
          }
        },
        pointBackgroundColor: 'white',
      },
      {
        label: `${infantName}'s growth`,
        data: result,
        backgroundColor: '#1D67D5',
        pointRadius: 0,
      },
      {
        label: 'hide',
        data: type?.SD2?.weight || type?.SD2.height || [],
        fill: 'end',
        borderColor: colours.underweight.primary,
        backgroundColor: colours.severely.secondary,
        pointRadius: 0,
        borderWidth: 1,
      },
      {
        label: getLabel(type?.SD2.label),
        data: type?.SD2?.weight || type?.SD2.height || [],
        fill: false,
        backgroundColor: colours.severely.primary,
        pointRadius: 0,
      },
      {
        label: 'hide',
        data: type?.SD3?.weight || type?.SD3.height || [],
        borderColor: colours.severely.primary,
        backgroundColor: colours.severely.secondary,
        pointRadius: 0,
        borderWidth: 1,
        fill: 'stack',
      },
      {
        label: getLabel(type?.SD3.label),
        data: type?.SD3?.weight || type?.SD3.height || [],
        backgroundColor: colours.underweight.primary,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'hide',
        data: type?.median?.weight || type?.median?.height || [],
        borderColor: colours.normal.primary,
        backgroundColor: colours.normal.secondary,
        pointRadius: 0,
        borderWidth: 1,
        fill: 'stack',
      },
      {
        label: getLabel(type?.median.label),
        data: type?.median?.weight || type?.median?.height || [],
        backgroundColor: colours.normal.primary,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'hide',
        data: type?.SD2neg?.weight || type?.SD2neg.height || [],
        borderColor: colours.underweight.primary,
        backgroundColor: colours.normal.secondary,
        pointRadius: 0,
        borderWidth: 1,
        fill: 'stack',
      },
      {
        label: getLabel(type?.SD2neg.label),
        data: type?.SD2neg?.weight || type?.SD2neg?.height || [],
        backgroundColor: colours.underweight.primary,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'hide',
        data: type?.SD3neg?.weight || type?.SD3neg?.height || [],
        borderColor: colours.severely.primary,
        backgroundColor: colours.underweight.secondary,
        pointRadius: 0,
        borderWidth: 1,
        fill: 'stack',
      },
      {
        label: getLabel(type?.SD3neg?.label),
        data: type?.SD3neg?.weight || type?.SD3neg?.height || [],
        backgroundColor: colours.severely.primary,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'hide',
        data: type?.SD3neg?.weight || type?.SD3neg?.height || [],
        backgroundColor: colours.severely.secondary,
        pointRadius: 0,
        borderWidth: 0,
        fill: 'start',
      },
    ],
  });

  const options: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          callback: function (_, index) {
            if (index === 0) {
              return '';
            }
            return chartData.date[index] + suffix;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        callbacks: {
          title: function (tooltipItem: TooltipItem<'line'>[]) {
            const label = Number(tooltipItem[0].label);

            switch (suffix) {
              case 'w':
                return `${label} ${label > 1 ? 'weeks' : 'week'}`;
              case 'm':
                return `${label} ${label > 1 ? 'months' : 'month'}`;
              case 'y':
                return `${label} ${label > 1 ? 'years' : 'year'}`;
              default:
                return `${label} ${label > 1 ? 'days' : 'day'}`;
            }
          },
          label: function (tooltipItem: TooltipItem<'line'>) {
            if (tooltipItem.datasetIndex === 0) {
              // display tooltip only for first dataset
              return `${tooltipItem.formattedValue.toString()} ${
                type === 'weight' ? 'kg' : 'cm'
              }`;
            } else {
              return '';
            }
          },
        },
      },
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

  return (
    <Line
      // @ts-ignore
      options={options}
      data={getData(chartData)}
      className="overflow-hidden rounded-lg"
    />
  );
};
