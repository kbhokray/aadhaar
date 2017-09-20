const constants = require('../utils/constants.js');
const xml = require('./auth/xml.js');
const encryptor = require('./auth/encryptor.js');

exports.auth = function(version) {
	xml.init();
}