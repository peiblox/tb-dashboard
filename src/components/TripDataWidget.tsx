"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import TripDataService from '@/services/tripdata';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import LocalTaxiTwoToneIcon from '@mui/icons-material/LocalTaxiTwoTone'
import MoneyTwoToneIcon from '@mui/icons-material/MoneyTwoTone';
import TourTwoToneIcon from '@mui/icons-material/TourTwoTone';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import DatesAlert from './DatesAlert';

import Loading from './Loading';
import DataCard from './DataCard';
import AmountChart from './charts/AmountChart';
import PaymentTypeChart from './charts/PaymentTypeChart';
import ShareButton from './ShareButton';

import getNumber from '@/utils/numberFormatter';
import getCurrency from '@/utils/currencyFormatter';

export default function TripDataWidget({
  startDate = dayjs() as Dayjs | null,
  setStartDate = (startDate: Dayjs | null) => {},
  endDate = dayjs() as Dayjs | null,
  setEndDate = (startDate: Dayjs | null) => {},
  setMinDate = (startDate: Dayjs | null) => {},
  setMaxDate = (startDate: Dayjs | null) => {}
}) {
  const tripDataService = useMemo(() => (new TripDataService()), [])
  const [tripData, setTripData] = useState<any | object>(null)

  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const getURLParams = () => {
      const start = searchParams.get('start')
      const end = searchParams.get('end')
      return { start, end }
    }

    async function fetchData() {
      const {min_date, max_date} = await tripDataService.getMinMaxDates()

      let firstDate = dayjs()
      let lastDate = dayjs()
      let minDate = dayjs()
      let maxDate = dayjs().add(30, 'days')
      const { start, end } = getURLParams()

      if (start && end) {
        firstDate = dayjs(start, 'YYYY-MM-DD')
        lastDate = dayjs(end, 'YYYY-MM-DD')
        if (lastDate.isBefore(firstDate)) {
          lastDate = firstDate
        }
      }

      if (min_date && max_date) {
        minDate = dayjs(min_date, 'YYYY-MM-DD')
        maxDate = dayjs(max_date, 'YYYY-MM-DD')

        if (firstDate.isBefore(minDate) || firstDate.isAfter(maxDate)) {
          firstDate = minDate
        }
        if (lastDate.isBefore(minDate) || lastDate.isAfter(maxDate)) {
          lastDate = maxDate
        }
      }

      setMinDate(minDate)
      setStartDate(firstDate)
      setMaxDate(maxDate)
      setEndDate(lastDate)
    }

    fetchData()
  }, [tripDataService, setStartDate, setEndDate, setMinDate, setMaxDate, searchParams])

  useEffect(() => {
    const updateTripData = async (startDate: Dayjs | null, endDate: Dayjs | null) => {
      setIsLoading(true)
      const data = await tripDataService.getData(startDate, endDate)
      setTripData(data)
      setIsLoading(false)
    }

    const updateURLParams = (startDate: Dayjs, endDate: Dayjs) => {
      const start = startDate.format('YYYY-MM-DD')
      const end = endDate.format('YYYY-MM-DD')

      router.push(pathname + `?start=${start}&end=${end}`)
    }

    if (startDate && endDate) {
      updateTripData(startDate, endDate)
      updateURLParams(startDate, endDate)
    }
  }, [startDate, endDate, tripDataService, router, pathname])

  let tripDataWidget = (<Loading />)
  if (!isLoading) {
    const totalTrips = getNumber(tripData.totalTrips || 0)

    const minutes = Math.floor(tripData.avgTripDuration / 60)
    const seconds = Math.floor(tripData.avgTripDuration - minutes * 60)

    tripDataWidget = (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DatesAlert startDate={startDate} endDate={endDate} />
        </Grid>
        <Grid item xs={3}>
          <DataCard title="Total trips" value={totalTrips} icon={<LocalTaxiTwoToneIcon />} />
        </Grid>
        <Grid item xs={3}>
          <DataCard title="AVG trip price" value={getCurrency(tripData.avgTripAmount)} icon={<MoneyTwoToneIcon />} />
        </Grid>
        <Grid item xs={3}>
          <DataCard title="AVG trip distance" value={`${tripData.avgTripDistance.toFixed(2)} miles`} icon={<TourTwoToneIcon />} />
        </Grid>
        <Grid item xs={3}>
          <DataCard title="AVG trip duration" value={`${minutes}:${seconds} min`} icon={<TimerTwoToneIcon />} />
        </Grid>
        <Grid item xs={6}>
          <AmountChart amountData={tripData.amountData} />
        </Grid>
        <Grid item xs={6}>
          <PaymentTypeChart tripsByPaymentType={tripData.tripsByPaymentType} />
        </Grid>
        <Grid item xs={12}>
          <ShareButton />
        </Grid>
      </Grid>
    )
  }

  return (
    <Container sx={{ padding: '20px' }}>
      { tripDataWidget }
    </Container>
  )
}
