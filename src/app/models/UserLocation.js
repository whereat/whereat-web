import { Record } from 'immutable';
import { USER_ID } from '../constants/Keys';

const UserLocation = Record({ id: USER_ID, lat: -1, lon: -1, time: 1 });

export default UserLocation;
