import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
  TooltipItem,
  ScatterController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

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

interface xAxisData {
  y: any;
  x: number;
  name?: string;
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

export const GrowthChart = ({
  data: chartData,
  type,
  suffix,
  result,
  infantName,
  xAxisMapData,
}: {
  infantName: string;
  xAxisMapData: xAxisData[];
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

  // const getData = (
  //   type: WeightOrHeightForAgeProps
  // ): ChartData<'line', (number | undefined)[], number> => ({
  //   labels: type?.date,
  //   datasets: [
  //     {
  //       label: `hide`,
  //       data: result,
  //       borderColor: '#1D67D5',
  //       backgroundColor: '#1D67D5',
  //       borderWidth: 4,
  //       pointRadius: (context) => {
  //         var dIndex = -1;
  //         for (var i = 0; i < xAxisMapData.length; i++) {
  //           if (xAxisMapData[i].x === context.dataIndex) {
  //             dIndex = xAxisMapData[i].x;
  //             break;
  //           }
  //         }
  //         if (context.dataIndex === dIndex) {
  //           return 4; // larger point radius for data available
  //         } else {
  //           return 0; // smaller point radius for all other data points
  //         }
  //       },
  //       pointBackgroundColor: 'white',
  //     },
  //     {
  //       label: `${infantName}'s growth`,
  //       data: result,
  //       backgroundColor: '#1D67D5',
  //       pointRadius: 0,
  //     },
  //     {
  //       label: 'hide',
  //       data: type?.SD2?.weight || type?.SD2.height || [],
  //       fill: 'end',
  //       borderColor: colours.underweight.primary,
  //       backgroundColor: colours.severely.secondary,
  //       pointRadius: 0,
  //       borderWidth: 1,
  //     },
  //     {
  //       label: getLabel(type?.SD2.label),
  //       data: type?.SD2?.weight || type?.SD2.height || [],
  //       fill: false,
  //       backgroundColor: colours.severely.primary,
  //       pointRadius: 0,
  //     },
  //     {
  //       label: 'hide',
  //       data: type?.SD3?.weight || type?.SD3.height || [],
  //       borderColor: colours.severely.primary,
  //       backgroundColor: colours.severely.secondary,
  //       pointRadius: 0,
  //       borderWidth: 1,
  //       fill: 'stack',
  //     },
  //     {
  //       label: getLabel(type?.SD3.label),
  //       data: type?.SD3?.weight || type?.SD3.height || [],
  //       backgroundColor: colours.underweight.primary,
  //       pointRadius: 0,
  //       fill: false,
  //     },
  //     {
  //       label: 'hide',
  //       data: type?.median?.weight || type?.median?.height || [],
  //       borderColor: colours.normal.primary,
  //       backgroundColor: colours.normal.secondary,
  //       pointRadius: 0,
  //       borderWidth: 1,
  //       fill: 'stack',
  //     },
  //     {
  //       label: getLabel(type?.median.label),
  //       data: type?.median?.weight || type?.median?.height || [],
  //       backgroundColor: colours.normal.primary,
  //       pointRadius: 0,
  //       fill: false,
  //     },
  //     {
  //       label: 'hide',
  //       data: type?.SD2neg?.weight || type?.SD2neg.height || [],
  //       borderColor: colours.underweight.primary,
  //       backgroundColor: colours.normal.secondary,
  //       pointRadius: 0,
  //       borderWidth: 1,
  //       fill: 'stack',
  //     },
  //     {
  //       label: getLabel(type?.SD2neg.label),
  //       data: type?.SD2neg?.weight || type?.SD2neg?.height || [],
  //       backgroundColor: colours.underweight.primary,
  //       pointRadius: 0,
  //       fill: false,
  //     },
  //     {
  //       label: 'hide',
  //       data: type?.SD3neg?.weight || type?.SD3neg?.height || [],
  //       borderColor: colours.severely.primary,
  //       backgroundColor: colours.underweight.secondary,
  //       pointRadius: 0,
  //       borderWidth: 1,
  //       fill: 'stack',
  //     },
  //     {
  //       label: getLabel(type?.SD3neg?.label),
  //       data: type?.SD3neg?.weight || type?.SD3neg?.height || [],
  //       backgroundColor: colours.severely.primary,
  //       pointRadius: 0,
  //       fill: false,
  //     },
  //     {
  //       label: 'hide',
  //       data: type?.SD3neg?.weight || type?.SD3neg?.height || [],
  //       backgroundColor: colours.severely.secondary,
  //       pointRadius: 0,
  //       borderWidth: 0,
  //       fill: 'start',
  //     },
  //   ],
  // });

  // const options: ChartOptions = {
  //   responsive: true,
  //   scales: {
  //     x: {
  //       ticks: {
  //         callback: function (_, index) {
  //           if (index === 0) {
  //             return '';
  //           }
  //           return chartData.date[index] + suffix;
  //         },
  //       },
  //     },
  //   },
  //   plugins: {
  //     tooltip: {
  //       backgroundColor: 'white',
  //       titleColor: 'black',
  //       bodyColor: 'black',
  //       callbacks: {
  //         title: function (tooltipItem: TooltipItem<'line'>[]) {
  //           const label = Number(tooltipItem[0].label);
  //           switch (suffix) {
  //             case 'w':
  //               return `${label} ${label > 1 ? 'weeks' : 'week'}`;
  //             case 'm':
  //               return `${label} ${label > 1 ? 'months' : 'month'}`;
  //             case 'y':
  //               return `${label} ${label > 1 ? 'years' : 'year'}`;
  //             default:
  //               return `${label} ${label > 1 ? 'days' : 'day'}`;
  //           }
  //         },
  //         label: function (tooltipItem: TooltipItem<'line'>) {
  //           if (tooltipItem.datasetIndex === 0) {
  //             // display tooltip only for first dataset
  //             var dIndex = -1;
  //             var dObj;
  //             for (var i = 0; i < xAxisMapData.length; i++) {
  //               if (xAxisMapData[i].x === tooltipItem.dataIndex) {
  //                 dIndex = xAxisMapData[i].x;
  //                 dObj = xAxisMapData[i];
  //                 break;
  //               }
  //             }

  //             if (tooltipItem.dataIndex === dIndex) {
  //               return `${dObj?.y.toString()} ${
  //                 type === 'weight' ? 'kg' : 'cm'
  //               }`;
  //             } else {
  //               return `${tooltipItem.formattedValue.toString()} ${
  //                 type === 'weight' ? 'kg' : 'cm'
  //               }`;
  //             }

  //           } else {
  //             return '';
  //           }
  //         },
  //       },
  //     },
  //     legend: {
  //       labels: {
  //         usePointStyle: true,
  //         filter: (item) => item.text !== 'hide',
  //       },
  //       position: 'bottom' as const,
  //     },
  //     title: {
  //       display: false,
  //     },
  //   },
  // };

  // Scatter chart code -----------------------------------------------
  var SD2Data: xAxisData[] = [];
  var SD3Data: xAxisData[] = [];
  var SD2negData: xAxisData[] = [];
  var SD3negData: xAxisData[] = [];
  var medianData: xAxisData[] = [];
  var i;
  if (chartData) {
    const SD2 = chartData.SD2.weight || chartData?.SD2.height || [];
    if (SD2) {
      for (i = 0; i < SD2.length; i++) {
        SD2Data.push({ x: i, y: SD2[i], name: '' });
      }
    }
    const SD3 = chartData.SD3.weight || chartData?.SD3.height || [];
    if (SD3) {
      for (i = 0; i < SD3.length; i++) {
        SD3Data.push({ x: i, y: SD3[i], name: '' });
      }
    }
    const SD2neg = chartData.SD2neg.weight || chartData?.SD2neg.height || [];
    if (SD2neg) {
      for (i = 0; i < SD2neg.length; i++) {
        SD2negData.push({ x: i, y: SD2neg[i], name: '' });
      }
    }
    const SD3neg = chartData.SD3neg.weight || chartData?.SD3neg.height || [];
    if (SD3neg) {
      for (i = 0; i < SD3neg.length; i++) {
        SD3negData.push({ x: i, y: SD3neg[i], name: '' });
      }
    }
    const median = chartData.median.weight || chartData?.median.height || [];
    if (median) {
      for (i = 0; i < median.length; i++) {
        medianData.push({ x: i, y: median[i], name: '' });
      }
    }

    // to prevent a white space on the right
    if (
      xAxisMapData[xAxisMapData.length - 1].x -
        Math.round(SD2Data[SD2Data.length - 1].y) >=
      2
    ) {
      SD2Data.push({
        x: SD2Data.length,
        y: SD2Data[SD2Data.length - 1].y,
        name: '',
      });
      SD3Data.push({
        x: SD3Data.length,
        y: SD3Data[SD3Data.length - 1].y,
        name: '',
      });
      SD2negData.push({
        x: SD2negData.length,
        y: SD2negData[SD2negData.length - 1].y,
        name: '',
      });
      SD3negData.push({
        x: SD3negData.length,
        y: SD3negData[SD3negData.length - 1].y,
        name: '',
      });
      medianData.push({
        x: medianData.length,
        y: medianData[medianData.length - 1].y,
        name: '',
      });
    }
  }

  const scatterOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (_, index) {
            return _ + suffix;
          },
        },
      },
      y: {
        // beginAtZero: true
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        callbacks: {
          title: function (tooltipItem: TooltipItem<'scatter'>[]) {
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
          label: function (tooltipItem: TooltipItem<'scatter'>) {
            if (tooltipItem.datasetIndex === 1) {
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

  const scatterData = {
    datasets: [
      {
        label: `hide`,
        data: xAxisMapData,
        borderColor: '#1D67D5',
        borderWidth: 4,
        showLine: true,
        pointRadius: 4,
        pointBackgroundColor: 'white',
      },
      {
        label: `${infantName}'s growth`,
        data: xAxisMapData,
        showLine: true,
        borderColor: '#1D67D5',
        backgroundColor: '#1D67D5',
        pointRadius: 4,
      },
      {
        label: 'hide',
        data: SD2Data,
        fill: 'end',
        borderColor: colours.underweight.primary,
        backgroundColor: colours.severely.secondary,
        pointRadius: 0,
        borderWidth: 2,
        showLine: true,
      },
      {
        label: getLabel(chartData?.SD2.label),
        data: SD2Data,
        fill: false,
        backgroundColor: colours.severely.primary,
        pointRadius: 0,
        borderWidth: 2,
        showLine: true,
      },
      {
        label: 'hide',
        data: SD3Data,
        borderColor: colours.severely.primary,
        backgroundColor: colours.severely.secondary,
        pointRadius: 0,
        borderWidth: 2,
        fill: '-2',
        showLine: true,
      },
      {
        label: getLabel(chartData?.SD3.label),
        data: SD3Data,
        backgroundColor: colours.underweight.primary,
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'hide',
        data: medianData,
        borderColor: colours.normal.primary,
        backgroundColor: colours.normal.secondary,
        pointRadius: 0,
        borderWidth: 2,
        fill: '-2',
        showLine: true,
      },
      {
        label: getLabel(chartData?.median.label),
        data: medianData,
        backgroundColor: colours.normal.primary,
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'hide',
        data: SD2negData,
        borderColor: colours.underweight.primary,
        backgroundColor: colours.normal.secondary,
        pointRadius: 0,
        borderWidth: 2,
        fill: '-2',
        showLine: true,
      },
      {
        label: getLabel(chartData?.SD2neg.label),
        data: SD2negData,
        backgroundColor: colours.underweight.primary,
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'hide',
        data: SD3negData,
        borderColor: colours.severely.primary,
        backgroundColor: colours.underweight.secondary,
        pointRadius: 0,
        borderWidth: 2,
        fill: '-2',
        showLine: true,
      },
      {
        label: getLabel(chartData?.SD3neg?.label),
        data: SD3negData,
        backgroundColor: colours.severely.primary,
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
      {
        label: 'hide',
        data: SD3negData,
        backgroundColor: colours.severely.secondary,
        pointRadius: 0,
        borderWidth: 2,
        fill: 'start',
        showLine: true,
      },
    ],
  };

  return (
    <Chart
      type="scatter"
      data={scatterData}
      options={scatterOptions}
      className="overflow-hidden rounded-lg"
    />
  );
};
