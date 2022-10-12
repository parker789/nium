import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box, CircularProgress, Grid, Skeleton, Stack } from '@mui/material';
import { UserCard } from '@pv/components';
import { getUsers } from '@pv/services';
import { Log, Metrics, User } from '@pv/types';
import { aggregateData } from '@pv/utils';
import logsData from '../../assets/logs.json';

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const { ref, inView } = useInView();

  const metrics = useMemo<Metrics>(() => aggregateData(logsData as Log[]), []);

  useEffect(() => {
    const init = async () => {
      const { offset, records } = await getUsers(nextPage);

      if (records?.length)
        setUsers((users) => {
          if (users.length) {
            return users.concat(records);
          }
          return records;
        });

      if (offset) setNextPage(offset);
      else setNextPage(null);

      setIsLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <Box mx={5} my={4}>
      <Box textAlign="center" color="white" typography="h4" mb={4}>
        Parker Vaughn
        <br />
        Nium Interview
      </Box>

      <Grid container spacing={3} justifyContent="start">
        {!isLoading
          ? users.map((user) => {
              return <UserCard user={user} metrics={metrics} key={user.id} />;
            })
          : Array.from({ length: 16 }, (_, i) => i + 1).map((i) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={i}>
                <Stack spacing={1} flex={1}>
                  <Skeleton variant="circular" width={60} height={60} />
                  <Skeleton variant="rectangular" width="100%" height={60} />
                  <Skeleton variant="rounded" width="100%" height={60} />
                </Stack>
              </Grid>
            ))}
      </Grid>

      {!isLoading && !!nextPage && !!users?.length && (
        <Stack ref={ref} direction="row" my={10} justifyContent="center">
          <CircularProgress thickness={5} color="secondary" size={64} />
        </Stack>
      )}
    </Box>
  );
};
