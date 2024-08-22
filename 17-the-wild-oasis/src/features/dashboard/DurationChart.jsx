import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Heading from '../../ui/Heading';
import { useDarkMode } from '../../context/DarkModeContext';

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

// const startDataLight = [
//   {
//     duration: '1 night',
//     value: 0,
//     color: '#ef4444',
//   },
//   {
//     duration: '2 nights',
//     value: 0,
//     color: '#f97316',
//   },
//   {
//     duration: '3 nights',
//     value: 0,
//     color: '#eab308',
//   },
//   {
//     duration: '4-5 nights',
//     value: 0,
//     color: '#84cc16',
//   },
//   {
//     duration: '6-7 nights',
//     value: 0,
//     color: '#22c55e',
//   },
//   {
//     duration: '8-14 nights',
//     value: 0,
//     color: '#14b8a6',
//   },
//   {
//     duration: '15-21 nights',
//     value: 0,
//     color: '#3b82f6',
//   },
//   {
//     duration: '21+ nights',
//     value: 0,
//     color: '#a855f7',
//   },
// ];

// const startDataDark = [
//   {
//     duration: '1 night',
//     value: 0,
//     color: '#b91c1c',
//   },
//   {
//     duration: '2 nights',
//     value: 0,
//     color: '#c2410c',
//   },
//   {
//     duration: '3 nights',
//     value: 0,
//     color: '#a16207',
//   },
//   {
//     duration: '4-5 nights',
//     value: 0,
//     color: '#4d7c0f',
//   },
//   {
//     duration: '6-7 nights',
//     value: 0,
//     color: '#15803d',
//   },
//   {
//     duration: '8-14 nights',
//     value: 0,
//     color: '#0f766e',
//   },
//   {
//     duration: '15-21 nights',
//     value: 0,
//     color: '#1d4ed8',
//   },
//   {
//     duration: '21+ nights',
//     value: 0,
//     color: '#7e22ce',
//   },
// ];

const startData = [
  {
    duration: 1,
    value: 0,
    colorLight: '#ef4444',
    colorDark: '#b91c1c',
  },
  {
    duration: 2,
    value: 0,
    colorLight: '#f97316',
    colorDark: '#c2410c',
  },
  {
    duration: 3,
    value: 0,
    colorLight: '#eab308',
    colorDark: '#a16207',
  },
  {
    duration: 5,
    value: 0,
    colorLight: '#84cc16',
    colorDark: '#4d7c0f',
  },
  {
    duration: 7,
    value: 0,
    colorLight: '#22c55e',
    colorDark: '#15803d',
  },
  {
    duration: 14,
    value: 0,
    colorLight: '#14b8a6',
    colorDark: '#0f766e',
  },
  {
    duration: 21,
    value: 0,
    colorLight: '#3b82f6',
    colorDark: '#1d4ed8',
  },
  {
    duration: Infinity,
    value: 0,
    colorLight: '#a855f7',
    colorDark: '#7e22ce',
  },
];

function prepareData(startData, stays, isDarkMode) {
  /// Assign dataStart to data.
  /// Using {... obj } so it copies the object's content and not the reference to the obj.
  /// This is needed to initiate the data because we will mutate the data.
  const data = startData.map((obj, i, arr) => {
    /// Create duration Label. Using IIFE here :).
    const durationLabel = (() => {
      // 1 night
      if (i === 0) return `${arr[i].duration} night`;
      // 21+ nights
      else if (i === arr.length - 1) return `${arr[i - 1].duration}+ nights`;
      // 2 nights, 3 nights
      else if (arr[i - 1].duration + 1 === arr[i].duration)
        return `${arr[i].duration} nights`;
      // 4-5 nights
      else return `${arr[i - 1].duration + 1}-${arr[i].duration} nights`;
    })();

    /// Set color based on dark mode
    const color = isDarkMode ? arr[i].colorDark : arr[i].colorLight;

    return { ...obj, durationLabel, color };
  });

  /// Calculate value
  stays?.forEach((stay) => {
    const num = stay?.numNights;

    /// Find the first item.duration equal to num
    const matchingItem = data.find((item) => num <= item.duration);

    if (matchingItem) {
      matchingItem.value++;
    }
  });

  /// Remove any data element where value = 0
  return data.filter((item) => item.value > 0);
}

// function prepareData0(startData, stays) {
//   // A bit ugly code, but sometimes this is what it takes when working with real data 😅

//   function incArrayValue(arr, field) {
//     return arr.map((obj) =>
//       obj.duration === field ? { ...obj, value: obj.value + 1 } : obj
//     );
//   }

//   const data = stays
//     ?.reduce((arr, cur) => {
//       const num = cur.numNights;
//       if (num === 1) return incArrayValue(arr, '1 night');
//       if (num === 2) return incArrayValue(arr, '2 nights');
//       if (num === 3) return incArrayValue(arr, '3 nights');
//       if ([4, 5].includes(num)) return incArrayValue(arr, '4-5 nights');
//       if ([6, 7].includes(num)) return incArrayValue(arr, '6-7 nights');
//       if (num >= 8 && num <= 14) return incArrayValue(arr, '8-14 nights');
//       if (num >= 15 && num <= 21) return incArrayValue(arr, '15-21 nights');
//       if (num >= 21) return incArrayValue(arr, '21+ nights');
//       return arr;
//     }, startData)
//     .filter((obj) => obj.value > 0);

//   return data;
// }

DurationChart.propTypes = {
  confirmedStays: PropTypes.array,
};

function DurationChart({ confirmedStays }) {
  const { isDarkMode } = useDarkMode();
  // console.log('Duration Chart', confirmedStays);

  // console.log(
  //   // prepareData0(
  //   //   startDataDark, //isDarkMode ? startDataDark : startDataLight,
  //   //   confirmedStays
  //   // ).map((el) => ({
  //   //   duration: el.duration,
  //   //   value: el.value,
  //   // })),
  //   prepareData(startData, confirmedStays, isDarkMode).map((el) => ({
  //     durationLabel: el.durationLabel,
  //     value: el.value,
  //   }))
  // );

  const data = prepareData(startData, confirmedStays, isDarkMode);
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
    value,
    payload,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    // console.log('renderCustomizedLabel payload', payload);
    return (
      <text
        x={x}
        y={y}
        fontSize="16px"
        fill={payload.color}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${payload.durationLabel}: ${value}`}
      </text>
    );
  };

  return (
    <ChartBox>
      <Heading as="h2">Stays duration summary</Heading>
      <ResponsiveContainer>
        <PieChart width="100%">
          <Pie
            data={data}
            nameKey="duration"
            dataKey="value"
            innerRadius={'40%'}
            outerRadius={'55%'}
            paddingAngle={3}
            cx="50%"
            cy="45%"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data?.map((item) => (
              <Cell key={item.duration} fill={item.color} stroke={item.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                // console.log(`${active}, ${label}`, payload);
                return (
                  <div
                    style={{
                      backgroundColor: 'var(--color-grey-0)',
                      color: 'var(--color-grey-700)',
                      padding: '5px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <p>{`${payload[0].payload.durationLabel}: ${payload[0].payload.value}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default DurationChart;
