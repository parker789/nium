import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line } from 'recharts';
import {
  Box,
  Avatar,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logsData from './assets/logs.json';

enum LogTypes {
  IMPRESSION = 'impression',
  CONVERSION = 'conversion',
}
interface User {
  id: string;
  createdTime: string;
  fields: {
    Id: number;
    Name: string;
    avatar: string;
    occupation: string;
  };
}

interface UserResponse {
  records: User[];
  offset?: string;
}

interface Log {
  revenue: number;
  time: string;
  type: string;
  user_id: number;
}
interface UserMetrics {
  impressions: number;
  conversions: number;
  revenue: number;
  conversionDates: Map<string, number>;
}

interface Metrics {
  minDay: string | null;
  maxDay: string | null;
  metrics: Map<number, UserMetrics>;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));

  const { minDay, maxDay, metrics } = useMemo<Metrics>(() => {
    const metrics = new Map<number, UserMetrics>();
    let minDay: string | null = null;
    let maxDay: string | null = null;

    for (const log of logsData as Log[]) {
      if (!metrics.has(log.user_id)) {
        metrics.set(log.user_id, {
          impressions: log.type === LogTypes.IMPRESSION ? 1 : 0,
          conversions: log.type === LogTypes.CONVERSION ? 1 : 0,
          revenue: log.revenue,
          conversionDates: new Map(),
        });
        continue;
      }

      const currentUser = metrics.get(log.user_id) as UserMetrics;

      // update impression / conversion count
      if (log.type === LogTypes.IMPRESSION) {
        currentUser.impressions += 1;
      } else if (log.type === LogTypes.CONVERSION) {
        currentUser.conversions += 1;

        // track conversions by date
        const dayKey = log.time.replace(/\s.*/, '');
        currentUser.conversionDates.set(
          dayKey,
          (currentUser.conversionDates.get(dayKey) || 0) + 1
        );

        // update min/max days
        if (!minDay || dayKey < minDay) minDay = dayKey;
        else if (!maxDay || dayKey > maxDay) maxDay = dayKey;
      }

      // update revenue
      currentUser.revenue += log.revenue;
    }

    return {
      minDay: new Date(minDay as string).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'numeric',
      }),
      maxDay: new Date(maxDay as string).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'numeric',
      }),
      metrics,
    };
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch(
        'https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?sort%5B0%5D%5Bfield%5D=Name&sort%5B0%5D%5Bdirection%5D=asc',
        {
          method: 'GET',
          headers: {
            authorization: 'Bearer key4v56MUqVr9sNJv',
          },
        }
      );

      const { records } = (await res.json()) as UserResponse;

      if (records?.length) setUsers(records);
      setLoading(false);
    };

    getUsers();
  }, []);

  const sortConversions = (
    conversionDates?: Map<string, number>
  ): Array<{ value: number }> => {
    if (!conversionDates) {
      return [];
    }

    return [...conversionDates.entries()]
      .sort()
      .map(([_, v]) => ({ value: v }));
  };

  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  return (
    <Box mx={5} my={4}>
      <Box textAlign="center" color="white" typography="h4" mb={4}>
        Parker Vaughn
        <br />
        Nium Interview
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {!loading &&
          users.map((user) => {
            return (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={user.id}>
                <Card
                  sx={{
                    border: '0.3rem solid black',
                    borderRadius: '10px',
                    padding: 2,
                  }}
                >
                  <CardHeader
                    title={user.fields.Name}
                    subheader={user.fields.occupation}
                    avatar={
                      <Avatar
                        alt={user.fields.Name}
                        src={user.fields.avatar}
                        sx={{
                          bgcolor: stringToColor(user.fields.Name),
                          alignSelf: 'start',
                          width: 60,
                          height: 60,
                        }}
                      />
                    }
                    titleTypographyProps={{
                      fontSize: 24,
                      fontWeight: 700,
                      maxWidth: '95%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    subheaderTypographyProps={{
                      color: '#808080c2',
                      fontSize: 16,
                      fontWeight: 700,
                      maxWidth: '85%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    sx={{
                      padding: 0,
                    }}
                  />
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
                      <Stack
                        flex={isSm ? '130px' : '200px'}
                        alignItems="center"
                        fontSize={14}
                      >
                        <LineChart
                          data={sortConversions(
                            metrics.get(user.fields.Id)?.conversionDates
                          )}
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
                      <Stack spacing={1} textAlign="right" flex={1}>
                        <Box color="#e88b3b" fontWeight={700}>
                          {metrics.get(user.fields.Id)?.impressions || 0}
                          <Box color="#808080c2" fontSize={14} fontWeight={400}>
                            impressions
                          </Box>
                        </Box>
                        <Box color="#4b92c3" fontSize={18} fontWeight={700}>
                          {metrics.get(user.fields.Id)?.conversions || 0}
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
                          }).format(metrics.get(user.fields.Id)?.revenue || 0)}
                        </Box>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
}

export default App;
