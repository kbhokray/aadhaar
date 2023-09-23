const HOST = 'auth.uidai.gov.in';
const VER = 2.5;
const AC = 'public';
const ASALK = 'MCNYL7FpPgjEhx7HBp9tu59Vdm4FnYGlxuqHctfAeNNaCufVafshqzQ';
const AUALK = 'MAvSQG0jKTW4XxQc2cI-oXZYxYH-zi7IWmsQY1q3JNLlC8VOWOHYGj8';
const URL = `https://${HOST}/otp/${VER}/${AC}/9/9/${ASALK}`;

const xml2js = require('xml2js');

const obj = {
  OTP: {
    $: {
      uid: '999941057058',
      ac: 'public',
      sa: 'ac',
      ver: '2.5',
      txn: `${Date.now()}`,
      ts: new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\.\d+Z$/, ''),
      lk: AUALK,
      type: 'A',
    },
    Otps: {
      $: {
        ch: '00',
      },
    },
    Signature: {
      $: {
        ch: 'ch',
      },
    },
  },
};

const builder = new xml2js.Builder();
const xml = builder.buildObject(obj);

console.log(xml);
