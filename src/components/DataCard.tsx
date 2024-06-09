import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import RoundedIcon from './RoundedIcon';


export default function DataCard({ title = '' as string, value = '' as any, icon = '' as React.ReactNode }) {
  return (
    <Card>
      <CardHeader
        avatar={<RoundedIcon icon={icon} />}
        title={<Typography variant="h6">{title}</Typography>} />
      <Divider />
      <CardContent>
        <Typography variant="h4" align="center">{value}</Typography>
      </CardContent>
    </Card>
  )
}
