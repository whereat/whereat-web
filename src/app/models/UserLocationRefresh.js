import { Record } from 'immutable';
import UserLocation from './UserLocation';
import { USER_ID } from '../constants/Keys';

const UserLocationRefresh = Record({
  lastPing: 0,
  location: UserLocation()
});

export default UserLocationRefresh;
