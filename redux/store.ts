import reducer from "./reducer";
import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

const middlewares = [];
middlewares.push(thunk);

const reducers = combineReducers({
    reducer
});

export default createStore(reducers, {}, applyMiddleware(...middlewares));
