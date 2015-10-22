const nacl = require('../modules/nacl').instance;

const keys = {};

keys.USER_ID = nacl.to_hex(nacl.random_bytes(32));

export default keys;
