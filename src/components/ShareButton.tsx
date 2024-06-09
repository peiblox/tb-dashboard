import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';

export default function ShareButton() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('Share this report')
  const [icon, setIcon] = useState(<ShareTwoToneIcon />)
  const [disabled, setDisabled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClose = () => {
    setOpen(false)
  }

  const handleShare = () => {
    const url = `${window.location.origin}${pathname}?${searchParams.toString()}`
    navigator.clipboard.writeText(url)

    setTitle('Copied to clipboard!')
    setIcon(<ContentCopyTwoToneIcon />)
    setDisabled(true)
    setOpen(true)
    setUrl(url)

    setTimeout(() => {
      setTitle('Share this report')
      setIcon(<ShareTwoToneIcon />)
      setDisabled(false)
      setUrl('')
      setOpen(false)
    }, 4000)
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={icon}
        onClick={handleShare}
        disabled={disabled}
        sx={{ marginBottom: '20px' }}
      >
        { title }
      </Button>
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info">
          URL copied: <strong>{url}</strong>
        </Alert>
      </Snackbar>
    </>
  )
}
