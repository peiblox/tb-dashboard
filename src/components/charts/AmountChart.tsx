import { BarChart } from "@mui/x-charts";
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import RoundedIcon from "../RoundedIcon";
import AttachMoneyTwoToneIcon from '@mui/icons-material/AttachMoneyTwoTone';

import theme from "@/styles/theme";

import getNumber from "@/utils/numberFormatter";

export default function AmountChart({ amountData = [] }) {
  const yAxis: any = {
    scaleType: 'band',
    label: 'Trip cost interval ($)',
    data: amountData.map((data: any) => data.amount_interval),
    colorMap: {
      type: 'ordinal',
      colors: [theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark],
    },
    valueFormatter: (value: string, context: any) => {
      let interval = `$${value}`
      if (value.charAt(0) === '>') {
        interval = `> $${value.split(' ')[1]}`
      }
      return context.location === 'tick'
        ? value
        : interval
    }
  }
  const xAxis: any = {
    label: 'Trips',
  }
  const series: any = {
    data: amountData.map((data: any) => data.trips),
    type: 'bar',
    valueFormatter: (value: number) => `${getNumber(value)} trips` ,
  }

  return (
    <Card>
      <CardHeader
        avatar={<RoundedIcon icon={<AttachMoneyTwoToneIcon />} />}
        title={<Typography variant="h6">Distribution of trip costs</Typography>}
      />
      <Divider />
      <CardContent>
        <BarChart
          xAxis={[xAxis]}
          yAxis={[yAxis]}
          series={[series]}
          height={300}
          layout="horizontal"
          grid={{ vertical: true }}
          margin={{ left: 80 }}
          sx={{
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-30px)',
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
