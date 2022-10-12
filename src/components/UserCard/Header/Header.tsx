import { Avatar, CardHeader } from '@mui/material';
import { stringToColor } from '@pv/utils';
import { User } from '@pv/types';

export const Header = ({
  user: {
    fields: { Name: name, avatar, occupation },
  },
}: {
  user: User;
}) => {
  return (
    <CardHeader
      title={name}
      subheader={occupation}
      avatar={
        <Avatar
          alt={name}
          src={avatar}
          sx={{
            bgcolor: stringToColor(name),
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
  );
};
