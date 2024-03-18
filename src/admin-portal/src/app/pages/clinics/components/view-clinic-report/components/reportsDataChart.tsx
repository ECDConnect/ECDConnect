import { Divider, RoundIcon, Typography } from '@ecdlink/ui';
import { Chart } from 'react-chartjs-2';
import { ClinicDto } from '@ecdlink/core';
import { FlagIcon } from '@heroicons/react/solid';
import { useMemo } from 'react';

interface ReportsDataCharProps {
  clinic: ClinicDto;
  targetPerc: number;
  targetPercColor: string;
  topTeamPerc: number;
  title: string;
  icon: any;
}

export const ReportsDataChart: React.FC<ReportsDataCharProps> = ({
  clinic,
  targetPerc,
  targetPercColor,
  topTeamPerc,
  icon,
  title,
}) => {
  const renderOpenedFolderText = (title) => {
    switch (title) {
      case 'Pregnant moms':
        if (targetPerc < 50) {
          return `This team is in the bottom ${
            100 - targetPerc
          }% of other GGC teams for pregnant mom folders opened!`;
        }
        return `This team is doing better than ${targetPerc}% of other GGC teams for pregnant mom folders opened!`;
      default:
        if (targetPerc < 50) {
          return `This team is in the bottom ${
            100 - targetPerc
          }%f other GGC teams for child folders opened compared to other GGC teams.`;
        }
        return `This team is in the top ${targetPerc}%f other GGC teams for child folders opened compared to other GGC teams.`;
    }
  };

  const renderGraphColor = (color) => {
    switch (color) {
      case 'Errr':
        return '#ED1414';
      default:
        return '#83BB26';
    }
  };

  const renderGraphBackGgroundColor = (color) => {
    switch (color) {
      case 'Error':
        return '#ED1414';
      default:
        return '#9B96A6';
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '90%',
    plugins: {
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'primary',
        bodyColor: 'primary',
      },
      scale: {
        ticks: {
          display: false,
        },
      },
    },
  };

  const reportsDataSet = {
    datasets: [
      {
        label: `hide`,
        data: [targetPerc, 100 - targetPerc],
        borderColor: [
          renderGraphColor(targetPercColor),
          renderGraphBackGgroundColor(targetPercColor),
        ],
        borderWidth: 4,
        showLine: false,
        pointRadius: 1,
        pointBackgroundColor: 'white',
        backgroundColor: [
          renderGraphColor(targetPercColor),
          renderGraphBackGgroundColor(targetPercColor),
        ],
      },
    ],
  };

  const plugins = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 160).toFixed(2);
        ctx.font = fontSize + 'em sans-serif';
        ctx.textBaseline = 'top';
        ctx.marginTop = '4pxß';

        // Draw "Total" on the first line
        var text1 = `${targetPerc || 0}%`;
        var textX1 = Math.round((width - ctx.measureText(text1).width) / 2);
        var textY1 = height / 2.8;
        ctx.fillText(text1, textX1, textY1);

        // Draw the number on the second line
        var text2 = `of annual points`;
        var textX2 = Math.round((width - ctx.measureText(text2).width) / 2);
        var textY2 = height / 2;
        ctx.fillText(text2, textX2, textY2);

        // Draw the number on the third line
        var text3 = `target`;
        var textX3 = Math.round((width - ctx.measureText(text2).width) / 0.8);
        var textY3 = height / 1.7;
        ctx.fillText(text3, textX3, textY3);

        ctx.save();
      },
      id: 'doughnut',
    },
  ];

  return (
    <div className="mt-8 flex w-6/12 flex-col justify-center rounded-2xl bg-white p-4">
      <div className="mt-4 ml-4 flex items-center gap-2 ">
        <div className="bg-primaryGG flex h-12 w-12 items-center justify-center rounded-full">
          <img src={icon} alt="pregnant" />
        </div>
        <Typography type="h4" color={'textDark'} text={title} />
      </div>
      <div className="flex justify-center">
        <Chart
          type="doughnut"
          data={reportsDataSet}
          options={options}
          className="h-64 w-64 overflow-hidden rounded-lg"
          plugins={plugins}
        />
      </div>
      <Typography
        type="body"
        color={'textMid'}
        text={renderOpenedFolderText(title)}
        className="mt-4"
      />
      <Divider className="p-4" dividerType="dashed" />
      <div className="flex items-center gap-2">
        <FlagIcon className="text-secondary h-6 w-6" />
        <Typography
          type="body"
          color={'textMid'}
          text={`The top team in the league has reached ${topTeamPerc}% of their annual target.`}
          className="mt-4"
        />
      </div>
    </div>
  );
};
