import dayjs, { Dayjs } from 'dayjs';

import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import BarChartTwoToneIcon from '@mui/icons-material/BarChartTwoTone';

import theme from '@/styles/theme';

export default function DatesAlert({startDate = dayjs() as Dayjs | null, endDate = dayjs() as Dayjs | null}) {
  let text = `Showing data between ${startDate?.format('DD/MM/YYYY')} and ${endDate?.format('DD/MM/YYYY')}.`
  if (startDate?.isSame(endDate)) {
    text = `Showing data for ${startDate?.format('DD/MM/YYYY')}.`
  }

  return (
    <Paper>
      <Alert
        severity="info"
        color='primary'
        icon={<BarChartTwoToneIcon />}
      >
        { text }
      </Alert>
    </Paper>
  )
}
