import { LineChart, Line } from 'recharts';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { Metrics, User } from '@pv/types';
import { sortConversions } from '@pv/utils';

export const LineGraph = ({
  user: {
    fields: { Id: userId },
  },
  metrics: { minDay, maxDay, userMetrics },
}: {
  user: User;
  metrics: Metrics;
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));

  return (
    <Stack flex={isSm ? '130px' : '200px'} alignItems="center" fontSize={14}>
      <LineChart
        data={sortConversions(userMetrics.get(userId)?.conversionDates)}
        width={isSm ? 130 : 200}
        height={100}
      >
        <Line
          dataKey="value"
          stroke="black"
          isAnimationActive={false}
          dot={false}
        />
      </LineChart>
      Conversions {isSm && <br />} {minDay} - {maxDay}
    </Stack>
  );
};
