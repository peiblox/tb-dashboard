import { PieChart, pieArcLabelClasses } from "@mui/x-charts";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";;

import RoundedIcon from "../RoundedIcon";
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';

import getNumber from "@/utils/numberFormatter";
import theme from "@/styles/theme";

import PaymentTypes from "@/utils/enums/paymentTypes";

export default function PaymentTypeChart({ tripsByPaymentType = [] }) {
  const getPaymentTypeLabel = (paymentId: string) => {
    const key: keyof typeof PaymentTypes = `TYPE_${paymentId}`
    return PaymentTypes[key]
  }

  return (
    <Card>
      <CardHeader
        avatar={<RoundedIcon icon={<CreditCardTwoToneIcon />} />}
        title={<Typography variant="h6">Trips by payment type</Typography>}
      />
      <Divider />
      <CardContent>
        <PieChart
          series={[
            {
              arcLabel: (item) => getPaymentTypeLabel(item.id),
              arcLabelMinAngle: 45,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 20, additionalRadius: -20, color: 'gray' },
              data: tripsByPaymentType.map(paymentType => {
                return {
                  id: paymentType.payment_type,
                  value: paymentType.trips,
                  label: getPaymentTypeLabel(paymentType.payment_type) + '\n' + getNumber(paymentType.trips) + ' trips',
                }
              }),
              valueFormatter: ({value}) => `${getNumber(value)} trips`,
              paddingAngle: 5,
              cornerRadius: 5,
              innerRadius: 5,
              cx: 150
            },
          ]}
          colors={[theme.palette.primary.dark, theme.palette.secondary.dark, theme.palette.primary.main, theme.palette.secondary.main]}
          height={300}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
