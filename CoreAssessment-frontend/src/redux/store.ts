/* eslint-disable no-mixed-operators */
import {createStore, applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'
import { persistStore,persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// Save state to localstorage auto  

const persistConfig = {
    key:'coreAssessment-root',
    storage,
    // whitelist:['cartReducer']
}

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
  }

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const middleware = [thunk]
// const composeEnhancers =  typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// let store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)))
// let persistor = persistStore(store);
// export { store}


const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk]
const composeEnhancers =  typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middleware)))
let persistor = persistStore(store);
export { store,persistor}