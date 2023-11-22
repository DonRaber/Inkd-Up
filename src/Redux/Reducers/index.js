import { combineReducers } from 'redux';
import clientReducer from './ClientReducer';
import artistReducer from './ArtistReducer';
import loginReducer from './LoginReducer';
import shopReducer from './ShopReducer';
import userReducer from './UserReducer';

const rootReducer = combineReducers({
    clients: clientReducer,
    artists: artistReducer,
    shops: shopReducer,
    users: userReducer,
    logins: loginReducer,
});

export default rootReducer;