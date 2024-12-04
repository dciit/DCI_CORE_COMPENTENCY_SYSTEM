import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import ApproveStatusbar from '../shared/ApproveStatusbar';


function ApproveListLayout() {
    return (
        <>
        <Box sx={styles.mainSection}>
                <ApproveStatusbar/>
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


export default ApproveListLayout