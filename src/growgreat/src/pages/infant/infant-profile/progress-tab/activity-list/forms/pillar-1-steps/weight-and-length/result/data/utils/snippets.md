# Snippet to get data from visitGrowthDataDay file

```js
  const girls = newData.VisitGrowthDataDay.filter(item => item.Section === 'length-height-for-age-girls')

  const date = girls.map(item => item.Day).sort((a, b) => a -b)
  const median = girls.map(item => item.Median).sort((a, b) => a -b)
  const SD2 = girls.map(item => item.SD2).sort((a, b) => a -b)
  const SD2neg = girls.map(item => item.SD2neg).sort((a, b) => a -b)
  const SD3 = girls.map(item => item.SD3).sort((a, b) => a -b)
  const SD3neg = girls.map(item => item.SD3neg).sort((a, b) => a -b)

  const newObject = {
    date,
    median: {
      label: 'median',
      weight: median // getDataPerMonth(median),
    },
    SD2: {
      label: '2 SD',
      weight: SD2
    },
    SD3: {
      label: '3 SD',
      weight: SD3
    },
    SD3neg: {
      label: '-3 SD',
      weight: SD3neg
    },
    SD2neg: {
      label: '-2 SD',
      weight: SD2neg
    }
  }

  function downloadTextFile(text: any, name: string) {
    const a = document.createElement('a');
    const type = name.split(".").pop();
    a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) );
    a.download = name;
    a.click();
  }

  downloadTextFile(JSON.stringify(newObject), 'length-height-for-age-girls.json')
```