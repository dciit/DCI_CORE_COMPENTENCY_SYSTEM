import { Box } from '@mui/material'
import TrackingStatusbar from '../shared/TrackingStatusbar'
import { Outlet } from 'react-router-dom'
import RevRound from '../shared/RevRound';

function CoreAssessmentLayout() {
  return (
   <>
   <Box sx={styles.mainSection}>
            <TrackingStatusbar />
            <RevRound/>

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
      p: 0,
  
      
    },
  };

export default CoreAssessmentLayout