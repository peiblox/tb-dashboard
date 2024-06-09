import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export default function Loading() {
  return (
    <Backdrop
      open={true}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Stack
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="inherit" />
        <Typography variant="subtitle2">
          Fetching data...
        </Typography>
      </Stack>
    </Backdrop>
  )
}
