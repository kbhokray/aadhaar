const moment = require('moment');
const forge = require('node-forge');
const fs = require('fs');
const constants = require('../../utils/constants');

const DATE_FORMAT_ISO8601 = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
const DATE_FORMAT_UNIX = 'x';
const ALGO_AES_GCM = 'AES-GCM';

let UIDAI_CERTIFICATE;

exports.init = () => {
  const pem = fs.readFileSync(constants.UIDAI_STAGE_CERT);
  UIDAI_CERTIFICATE = forge.pki.certificateFromPem(pem);
};

exports.getExpiry = () => {
  const expiry = UIDAI_CERTIFICATE.validity.notAfter;
  return moment(expiry, DATE_FORMAT_ISO8601).format(DATE_FORMAT_UNIX);
};

exports.getSessionKey = () => {
  // TODO finish this
  /* let now = moment();
	if(keyCreated === undefined || keyCreated.isBefore(now.subtract(10, 'minutes'))) {
		key = forge.random.getBytesSync(32);
		keyCreated = now;
		keyId = "1234"
	} */
  const key = forge.random.getBytesSync(32);
  // let key = crypto.randomBytes(32);
  return key;
};

exports.generateSha256Hash = (data) => {
  const hash = forge.md.sha256.create();
  hash.update(data);
  return hash.digest().getBytes();
};

exports.encryptUsingPublicKey = (data) => {
  const { publicKey } = UIDAI_CERTIFICATE;
  // RSAES/PKCS1-V1_5
  const encrypted = publicKey.encrypt(data);
  return encrypted;
};

exports.encryptUsingSessionKey = (data, ts, key, prependTs) => {
  // AES-256/GCM
  const tsLast12Bytes = Buffer.from(ts).slice(-12);
  const tsLast16Bytes = Buffer.from(ts).slice(-16);

  const cipher = forge.cipher.createCipher(ALGO_AES_GCM, key);
  cipher.start({
    iv: tsLast12Bytes,
    additionalData: tsLast16Bytes,
  });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  const encrypted = cipher.output;
  const { tag } = cipher.mode;
  encrypted.putBytes(tag.getBytes());

  const encryptedBytes = encrypted.getBytes();
  if (prependTs) {
    const tsPrependedEncry = Buffer.concat([
      Buffer.from(ts),
      Buffer.from(encryptedBytes, 'binary'),
    ]);
    return tsPrependedEncry.toString('binary');
  }
  return encryptedBytes;
};

exports.encode64 = (bytes) => {
  return forge.util.encode64(bytes);
};

exports.test = () => {
  exports.init();

  const data = 'abcde';
  const rsa = exports.encryptUsingPublicKey(data);
  const rsaEnc = exports.encode64(rsa);

  const sha = exports.generateSha256Hash(data);
  const shaEnc = exports.encode64(sha);

  console.log(`RSA = \n${rsaEnc}`);
  console.log(`SHA = \n${shaEnc}`);
};
