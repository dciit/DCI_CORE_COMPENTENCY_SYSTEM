import { BrowserRouter, Route, Routes  } from "react-router-dom";
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
import {AdminRole,ApproveUserRole,AssessmentUserRole} from "./components/Route/RoleBaseRoute"
import CoreAssessment_selectDept from "./Pages/backend/CoreAssessment/CoreAssessment_selectDept";
import ManageCompentencyRound from "./Pages/backend/ADMIN/ManageCompentencyRound";
import ElearningReport from "./Pages/backend/E-Learning/ElearningReport";
import GasSaving from "./Pages/backend/E-Learning/GasSaving";
import ComplianceTrainningRecored from "./Pages/backend/ComplianceReport/ComplianceTrainningRecored";
import FactoryMain from "./Pages/backend/E-Learning/FactoryMain";
import ComplianceTrainingAttendance from "./Pages/backend/ComplianceReport/ComplianceTrainingAttendance";
import SelectSections from "./Pages/backend/ApproveByGM/SelectSections";
import ApproveListLayout from "./components/layout/ApproveListLayout";
import SelectGroup from "./Pages/backend/ApproveByGM/SelectGroup";
import SelectApprove from "./Pages/backend/ApproveByGM/SelectApprove";
import ListApprove from "./Pages/backend/ListApprove";
import EmployeeHistoryAssessDisplay from "./Pages/backend/ApproveByGM/EmployeeHistoryAssessDisplay";
import DisplayEmployee from "./Pages/backend/DisplayEmployee";
import SelectDept from "./Pages/backend/ApproveByGM/SelectDept";
import AdminDashboard from "./Pages/backend/ADMIN/Dashboard";
import CoreAttendanceLV5 from "./Pages/backend/ADMIN/CoreAttendanceLV5";
import ManageRoleAssessment from "./Pages/backend/ADMIN/ManageRoleAssessment";
import EmployeeTrainingRecord from "./Pages/backend/ADMIN/EmployeeTrainingRecord";
import CoreAttendance from "./Pages/backend/ADMIN/CoreAttendance";
import TisExportHistory from "./Pages/TIS/TisExportHistory";
import TisSchedule from "./Pages/TIS/TisSchedule";
import TisTrainee from "./Pages/TIS/TisTrainee";
import Organization from "./Pages/backend/ADMIN/Organization";
import 'preline/preline';
import AuthLayout from "./components/layout/AuthLayout";
// import SelectLabels from "./Pages/backend/ComplianceReport/SelectLabels";

function App() {
    
    let BASE = import.meta.env.VITE_PATH;

  return (


    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path={`${BASE}`} element={<Login/>} />
            <Route path={`${BASE}/*`} element={<Login/>} />
              </Route>
          <Route element={<ProtectedRoute><BackendLayout /></ProtectedRoute>}>
              <Route path={`/${BASE}/backend/dashboard`} element={<AssessmentUserRole><Dashboard /></AssessmentUserRole>} />
              <Route element={<AssessmentUserRole><CoreAssessmentLayout/></AssessmentUserRole>} >    
                  <Route path={`/${BASE}/backend/core-assessment/`} element={<CoreAssessment_selectDept/>}/> 
                  <Route path={`/${BASE}/backend/core-assessment/:dept`} element={<CoreAssessment_selectSetion/>}/> 
                  <Route path={`/${BASE}/backend/core-assessment/:dept/:section`} element={<CoreAssessment_selectGroup/>}/> 
                  <Route path={`/${BASE}/backend/core-assessment/:dept/:section/:group`} element={<CoreAssessment_selectCore/>}/> 
                  <Route path={`/${BASE}/backend/core-assessment/:dept/:section/:group/:core_level`} element={<CoreAssessment_selectEmployee/>}/> 
                  <Route path={`/${BASE}/backend/core-assessment/:dept/:section/:group/:core_level/:emp_code`} element={<CoreAssessment_selectAssess/>}/> 
              </Route>
         
            <Route element={<ApproveUserRole><ApproveListLayout/></ApproveUserRole>} > 
                <Route path={`/${BASE}/backend/core-assessmentListApprove-gm`} element={<ApproveUserRole><SelectDept/></ApproveUserRole>}/>
                <Route path={`/${BASE}/backend/core-assessmentListApprove-gm/:dept`} element={<ApproveUserRole><SelectSections/></ApproveUserRole>}/>
                <Route path={`/${BASE}/backend/core-assessmentListApprove-gm/:dept/:section`} element={<ApproveUserRole><SelectGroup/></ApproveUserRole>}/>
                <Route path={`/${BASE}/backend/core-assessmentListApprove-gm/:dept/:section/:group`} element={<ApproveUserRole><SelectApprove/></ApproveUserRole>}/>
                <Route path={`/${BASE}/backend/core-assessmentListApprove-gm/:dept/:section/:group/viewAssessment`} element={<AssessmentUserRole><EmployeeHistoryAssessDisplay/></AssessmentUserRole>}/>                   

            </Route>
            <Route path={`/${BASE}/backend/core-assessmentList`} element={<AssessmentUserRole><ListAssessment/></AssessmentUserRole>}/>
            <Route path={`/${BASE}/backend/core-assessmentListApprove`} element={<AssessmentUserRole><ListApprove/></AssessmentUserRole>}/>
            

            {/* ADMIN */}
            <Route path={`/${BASE}/backend/admin/dashboard`} element={<AssessmentUserRole><AdminDashboard/></AssessmentUserRole>}/>                   
            <Route path={`/${BASE}/backend/core-assessmentList-report/:empcode`} element={<AssessmentUserRole><DisplayEmployee/></AssessmentUserRole>}/>                   
            <Route path={`/${BASE}/backend/admin/setAssessmentRound`} element={<AdminRole><ManageCompentencyRound/></AdminRole>}/>
            <Route path={`/${BASE}/backend/admin/ManageRoleAssessment`} element={<AdminRole><Organization/></AdminRole>}/>                   
            <Route path={`/${BASE}/backend/admin/employeeTrainingRecord`} element={<AdminRole><EmployeeTrainingRecord/></AdminRole>}/>
            <Route path={`/${BASE}/backend/admin/AssessmentRoundReport`} element={<AdminRole><CoreAttendance/></AdminRole>}/>                   
            <Route path={`/${BASE}/backend/admin/AssessmentRoundReportManager`} element={<AdminRole><CoreAttendanceLV5/></AdminRole>}/>   
            <Route path={`/${BASE}/backend/admin/organization`} element={<AdminRole><Organization/></AdminRole>}/>                   
                

        
          </Route>

          {/* TIS */}
          <Route path={`${BASE}/TIS`} element={<TisExportHistory/>} />
          <Route path={`${BASE}/DailyTrainingSchedule`} element={<TisSchedule/>} />
          <Route path={`${BASE}/DailyTrainingSchedule/viewTrainee`} element={<TisTrainee/>} />


          <Route path={`${BASE}/complianceCourseTrainingRecord`} element={<ComplianceTrainningRecored/>} />
          <Route path={`${BASE}/complianceCourseTrainingRecord-report`} element={<ElearningReport/>} />
          <Route path={`${BASE}/complianceCourseTrainingRecord-report/attendance/:section`} element={<ComplianceTrainingAttendance/>} />



          <Route path={`${BASE}/teambuilding`} element={<GasSaving/>} />
          <Route path={`${BASE}/teambuilding-main`} element={<FactoryMain/>} />


        </Routes>
      </BrowserRouter>


  
    </>
  );
}

export default App;
