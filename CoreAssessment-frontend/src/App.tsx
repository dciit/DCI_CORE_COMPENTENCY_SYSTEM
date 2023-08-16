import { BrowserRouter, Route, Routes  } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import BackendLayout from "./components/layout/BackendLayout";
import Login from "./Pages/auth/Login";
import ListAssessment from "./Pages/backend/ListAssessment";
import Dashboard from "./Pages/backend/Dashboard";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import CoreAssessmentLayout from "./components/layout/CoreAssessmentLayout";
import CoreAssessment_selectCore from "./Pages/backend/CoreAssessment/CoreAssessment_selectCore";
import CoreAssessment_selectEmployee from "./Pages/backend/CoreAssessment/CoreAssessment_selectEmployee";
import CoreAssessment_selectGroup from "./Pages/backend/CoreAssessment/CoreAssessment_selectGroup";
import CoreAssessment_selectAssess from "./Pages/backend/CoreAssessment/CoreAssessment_selectAssess";
import CoreAssessment_selectSetion from "./Pages/backend/CoreAssessment/CoreAssessment_selectSetion";
import {AssessmentUserRole,NormalUserRole} from "./components/Route/RoleBaseRoute"
import EmployeeDashboard from "./Pages/backend/EmployeeDashboard";

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login/>} />
          </Route>


          <Route element={<ProtectedRoute><BackendLayout /></ProtectedRoute>}>

              <Route path="backend/dashboard" element={<NormalUserRole><Dashboard /></NormalUserRole>} />
              <Route element={<AssessmentUserRole><CoreAssessmentLayout/></AssessmentUserRole>} >    

                  
                  <Route path="backend/core-assessment/:dept" element={<CoreAssessment_selectSetion/>}/> 
                  <Route path="backend/core-assessment/:dept/:section/" element={<CoreAssessment_selectGroup/>}/> 
                  <Route path="backend/core-assessment/:dept/:section/:group" element={<CoreAssessment_selectCore/>}/> 
                  <Route path="backend/core-assessment/:dept/:section/:group/:core_level" element={<CoreAssessment_selectEmployee/>}/> 
                  <Route path="backend/core-assessment/:dept/:section/:group/:core_level/:emp_code" element={<CoreAssessment_selectAssess/>}/> 

              </Route>
            <Route path="backend/core-assessmentList" element={<NormalUserRole><ListAssessment/></NormalUserRole>}/>
            <Route path="backend/core-assessmentList/:empcode" element={<NormalUserRole><EmployeeDashboard/></NormalUserRole>}/>
           
          
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
