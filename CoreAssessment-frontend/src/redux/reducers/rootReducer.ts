import {combineReducers} from 'redux'
import trackingReducer from './trackingReducer'
import calculateSroceReducer from './calculateSroceReducer'
import scoreEmployeeReducer from './scoreEmployeeReducer'
import userAuthenReducer from './userAuthenReducer'
const rootReducer = combineReducers({
    trackingStateReducer: trackingReducer,
    calculateSroceStateReducer:calculateSroceReducer,
    scoreEmployeeStateReducer:scoreEmployeeReducer,
    authenStateReducer:userAuthenReducer
})

export default rootReducer