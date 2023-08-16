import { Box } from '@mui/material'
import TrackingStatusbar from '../shared/TrackingStatusbar'
import { Outlet } from 'react-router-dom'

function CoreAssessmentLayout() {
  return (
   <>
   <Box sx={styles.mainSection}>
            <TrackingStatusbar />
            <Outlet/>

   </Box>
   </>
  )
}

const styles = {
    container: {
      display: "flex",
      bgcolor: "neutral.light",
    },
    mainSection: {
      p: 4,
  
      
    },
  };

export default CoreAssessmentLayout