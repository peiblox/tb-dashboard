'use client';
import { Inter } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    bars: Palette['primary'];
  }

  interface PaletteOptions {
    bars?: PaletteOptions['primary'];
  }
}

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const pallete = {
  primary: {
    light: '#B0FCD9',
    main: '#27F795',
    dark: '#06b161',
    contrastText: '#3f4154',
  },
  secondary: {
    light: '#FFDEAE',
    main: '#FEA827',
    dark: '#DF8601',
    contrastText: '#3f4154',
  },
  bars: {
    light: '#3f4154',
    main: '#3f4154',
    dark: '#3f4154',
    contrastText: '#FFFFFF',
  },
};

const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  palette: {
    ...pallete,
    mode: 'light',
  },
  components: {
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          borderRadius: '2px',
          borderWidth: '1px',
          borderColor: '#27F795',
          border: '1px solid',
          backgroundColor: '#3f4154',
        }
      }
    }
  }
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...pallete,
    mode: 'dark',
  }
});

export default theme;
