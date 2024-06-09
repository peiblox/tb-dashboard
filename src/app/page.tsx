'use client'

import { useState } from 'react';
import Image from 'next/image';

import { ThemeProvider } from '@mui/material';
import { darkTheme } from '@/styles/theme';

import { Dayjs } from 'dayjs';
import 'dayjs/locale/es'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import TripDataWidget from '@/components/TripDataWidget';

export default function Dashboard() {
  const [minDate, setMinDate] = useState<Dayjs | null>(null)
  const [maxDate, setMaxDate] = useState<Dayjs | null>(null)
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)

  const changeStartDate = (newDate: Dayjs | null) => {
    if (!newDate) return
    if (newDate.isAfter(endDate)) {
      newDate = endDate
    }
    setStartDate(newDate)
  }
  const changeEndDate = (newDate: Dayjs | null) => {
    if (!newDate) return
    if (newDate.isBefore(startDate)) {
      newDate = startDate
    }
    setEndDate(newDate)
  }

  return (
    <main>
      <Box>
        <AppBar position="static" color="bars" sx={{
          padding: '4px 0px'
        }}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Toolbar>
              <Image src="/bird.svg" alt="logo" width={32} height={32} />
              <Typography variant="h6" component="h1">Yellow cabs trips data in January 2017</Typography>
            </Toolbar>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
              <ThemeProvider theme={darkTheme}>
                <Toolbar>
                  <Grid container columnSpacing={2}>
                    <Grid item>
                      <p>Filter by dates:</p>
                    </Grid>
                    <Grid item>
                      <DatePicker
                        label="Start date"
                        value={startDate}
                        minDate={minDate || undefined}
                        maxDate={endDate || undefined}
                        onChange={(newDate) => changeStartDate(newDate)}
                      />
                    </Grid>
                    <Grid item>
                      <DatePicker
                        label="End date"
                        value={endDate}
                        minDate={startDate || undefined}
                        maxDate={maxDate || undefined}
                        onChange={(newDate) => changeEndDate(newDate)}
                      />
                    </Grid>
                  </Grid>
                </Toolbar>
              </ThemeProvider>
            </LocalizationProvider>
          </Grid>
        </AppBar>
      </Box>
      <TripDataWidget
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setMinDate={setMinDate}
        setMaxDate={setMaxDate}
      />
    </main>
  );
}
