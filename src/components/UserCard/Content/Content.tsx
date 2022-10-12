import { CardContent, Stack, Box } from '@mui/material';
import { LineGraph } from '@pv/components';
import { Metrics, User } from '@pv/types';

export const Content = ({
  user,
  metrics,
}: {
  user: User;
  metrics: Metrics;
}) => {
  const {
    fields: { Id: userId },
  } = user;
  const { userMetrics } = metrics;

  return (
    <CardContent
      sx={{
        paddingTop: 1,
        paddingBottom: 0,
        paddingX: 0,
        '&:last-child': {
          paddingTop: 1,
          paddingBottom: 0,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <LineGraph user={user} metrics={metrics} />
        <Stack spacing={1} textAlign="right" flex={1}>
          <Box color="#e88b3b" fontWeight={700}>
            {userMetrics.get(userId)?.impressions || 0}
            <Box color="#808080c2" fontSize={14} fontWeight={400}>
              impressions
            </Box>
          </Box>
          <Box color="#4b92c3" fontSize={18} fontWeight={700}>
            {userMetrics.get(userId)?.conversions || 0}
            <Box color="#808080c2" fontSize={14} fontWeight={400}>
              conversions
            </Box>
          </Box>
          <Box color="#2faf64" fontSize={24} fontWeight={700}>
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(userMetrics.get(userId)?.revenue || 0)}
          </Box>
        </Stack>
      </Stack>
    </CardContent>
  );
};
