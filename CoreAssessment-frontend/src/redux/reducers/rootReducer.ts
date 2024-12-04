import {combineReducers} from 'redux'
import trackingReducer from './trackingReducer'
import calculateSroceReducer from './calculateSroceReducer'
import scoreEmployeeReducer from './scoreEmployeeReducer'
import userAuthenReducer from './userAuthenReducer'
import counterBadgeReducer from './counterBadgeReducer'
import evalutedEmployeeReducer from './evalutedEmployeeReducer'
import timeoutCounterReducer from './timeoutCounterReducer'
import approveTrackingReducer from './approveTrackingReducer'
import ccAttendanceRecordReducer from './complianceTrainingRecord/ccAttendanceRecordReducer'
const rootReducer = combineReducers({
    trackingStateReducer: trackingReducer,
    calculateSroceStateReducer:calculateSroceReducer,
    scoreEmployeeStateReducer:scoreEmployeeReducer,
    authenStateReducer:userAuthenReducer,
    counterBagdeStateReducer : counterBadgeReducer,
    employeeEvalutedListStateReducer : evalutedEmployeeReducer,
    timeoutCounterStateReducer: timeoutCounterReducer,
    approveTrackingStateReducer: approveTrackingReducer,
    ccAttendanceRecordStateReducer:ccAttendanceRecordReducer

})

export default rootReducer