import { Card, Grid } from '@mui/material';
import { Metrics, User } from '@pv/types';

import { Header } from './Header';
import { Content } from './Content';

export const UserCard = ({
  user,
  metrics,
}: {
  user: User;
  metrics: Metrics;
}) => {
  return (
    <Grid item xs={12} sm={6} lg={4} xl={3}>
      <Card
        sx={{
          border: '0.3rem solid black',
          borderRadius: '10px',
          padding: 2,
        }}
      >
        <Header user={user} />
        <Content user={user} metrics={metrics} />
      </Card>
    </Grid>
  );
};
