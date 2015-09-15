// const uuid = require('node-uuid');
const sodium = require('libsodium-wrappers');
const keys = {};

// keys.USER_ID = uuid.v4();
keys.USER_ID = sodium.to_hex(sodium.randombytes_buf(sodium.crypto_shorthash_KEYBYTES));
module.exports = keys;
