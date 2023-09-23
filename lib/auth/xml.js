const moment = require('moment');
const js2xml = require('js2xmlparser');

const https = require('http');
const encryptor = require('./encryptor');
const signer = require('../../utils/signer');
const constants = require('../../utils/constants');

// Function to get all values in an object
Object.values = Object.values || ((obj) => Object.keys(obj).map((key) => obj[key]));
Object.isEmpty = Object.isEmpty || ((obj) => !(obj && Object.keys(obj).length > 0));

const AUTH_XMLNS_API2_0 = 'http://www.uidai.gov.in/authentication/uid-auth-request/2.0';
const PID_XMLNS_API2_0 = 'http://www.uidai.gov.in/authentication/uid-auth-request-data/2.0';

const API_VERSION = '2.5';
const URL_AUTH_HOST = 'auth.uidai.gov.in';
const URL_AUTH_PATHTEMPLATE = '<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>';

const AUTH_DEFAULT_TID_API2_5 = '';

// AUTH
let PID_XMLNS;
const AUTH_DEFAULT_RC = 'Y';
let AUTH_DEFAULT_TID;
const AUTH_AUA_CODE = constants.TEST_AUTH_CODE;
const AUTH_SUBAUA_CODE = constants.TEST_SUBAUA_CODE;
const AUTH_DEFAULT_VER = 2.5;
const AUTH_AUA_LICENSEKEY = constants.TEST_AUA_LICENSEKEY;
// USES
const USES_PI = { YES: 'y', NO: 'n' };
const USES_PA = { YES: 'y', NO: 'n' };
const USES_PFA = { YES: 'y', NO: 'n' };
const USES_BIO = { YES: 'y', NO: 'n' };
const USES_BT = {
  FINGER_MINUTIAE: 'FMR',
  FINGER_IMAGE: 'FIR',
  IRIS_IMAGE: 'IIR',
  FACE_IMAGE_DATA: 'FID',
};
const USES_PIN = { YES: 'y', NO: 'n' };
const USES_OTP = { YES: 'y', NO: 'n' };

const USES_DEFAULT_PI = USES_PI.YES;
const USES_DEFAULT_PA = USES_PA.NO;
const USES_DEFAULT_PFA = USES_PFA.NO;
const USES_DEFAULT_BIO = USES_BIO.NO;
const USES_DEFAULT_PIN = USES_PIN.NO;
const USES_DEFAULT_OTP = USES_OTP.NO;
// META
const META_DEFAULT_UDC = 'UIDAI:SampleClient';
// SKEY
const CERT_EXPRY_FORMAT = 'YYYYMMDD';
const TEST_CERT_CI = () => encryptor.getExpiry();
const DATE_FORMAT_UNIX = 'x';
// DATA
const DATA_TYPE = { XML: 'X', PROTOBUF: 'P' };
const DATA_DEFAULT_TYPE = DATA_TYPE.XML;
// PID
const PID_DEFAULT_VER = '2.0';
const PID_TS_ISO8601 = 'YYYY-MM-DDThh:mm:ss';
// DEMO
const LANGUAGE_CODE = {
  Assamese: '01',
  Bengali: '02',
  Gujarati: '05',
  Hindi: '06',
  Kannada: '07',
  Malayalam: '11',
  Manipuri: '12',
  Marathi: '13',
  Oriya: '15',
  Punjabi: '16',
  Tamil: '20',
  Telugu: '21',
  Urdu: '22',
};
// PI
const PI_MATCHING_STGY = { EXACT: 'E', PARTIAL: 'P' };
const PI_MATCH_VALUE = [...Array(100).keys()].map((x) => x + 1);
const PI_LMATCH_VALUE = [...Array(100).keys()].map((x) => x + 1);
const PI_GENDER = {
  MALE: 'M',
  FEMALE: 'F',
  TRANSGENDER: 'T',
};
const PI_DOB_FORMAT = 'YYYY-MM-DD';
const PI_DOB_YEAR_FORMAT = 'YYYY';
const PI_DOB_TYPE = { VERIFIED: 'V', DECLARED: 'D', APPROXIMATE: 'A' };

const PI_DEFAULT_MTCH_STGY = PI_MATCHING_STGY.EXACT;
const PI_DEFAULT_MATCH_VALUE = 100;
// Not specified in specs
const PI_DEFAULT_LMATCH_VALUE = 100;
// PA
const PA_MATCHING_STGY = { EXACT: 'E' };
const PA_DEFAULT_MTCH_STGY = PA_MATCHING_STGY.EXACT;
// PFA
const PFA_MATCHING_STGY = { EXACT: 'E', PARTIAL: 'P' };
const PFA_MATCH_VALUE = [...Array(100).keys()].map((x) => x + 1);
const PFA_LMATCH_VALUE = [...Array(100).keys()].map((x) => x + 1);

const PFA_DEFAULT_MTCH_STGY = PFA_MATCHING_STGY.EXACT;
const PFA_DEFAULT_MATCH_VALUE = 100;
// Not specified in specs
const PFA_DEFAULT_LMATCH_VALUE = 100;
// BIO
const BIO_TYPE = {
  FINGER_MINUTIAE: 'FMR',
  FINGER_IMAGE: 'FIR',
  IRIS_IMAGE: 'IIR',
  FACE_IMAGE_DATA: 'FID',
};
const BIO_POSH = {
  LEFT_IRIS: 'LEFT_IRIS',
  RIGHT_IRIS: 'RIGHT_IRIS',
  LEFT_INDEX: 'LEFT_INDEX',
  LEFT_LITTLE: 'LEFT_LITTLE',
  LEFT_MIDDLE: 'LEFT_MIDDLE',
  LEFT_RING: 'LEFT_RING',
  LEFT_THUMB: 'LEFT_THUMB',
  RIGHT_INDEX: 'RIGHT_INDEX',
  RIGHT_LITTLE: 'RIGHT_LITTLE',
  RIGHT_MIDDLE: 'RIGHT_MIDDLE',
  RIGHT_RING: 'RIGHT_RING',
  RIGHT_THUMB: 'RIGHT_THUMB',
  FACE: 'FACE',
  UNKNOWN: 'UNKNOWN',
};
// PV
const IS_UIDAI = false;

function Auth(_Uses, _Device, _Skey, _Data, _Hmac, attrs) {
  this['@'] = {
    // xmlns: AUTH_XMLNS,
    uid: attrs.uid,
    tid: attrs.tid ? attrs.tid : AUTH_DEFAULT_TID,
    ac: attrs.ac ? attrs.ac : AUTH_AUA_CODE,
    sa: attrs.sa ? attrs.sa : AUTH_SUBAUA_CODE,
    ver: attrs.ver ? attrs.ver : AUTH_DEFAULT_VER,
    txn: attrs.txn,
    lk: attrs.lk ? attrs.lk : AUTH_AUA_LICENSEKEY,
    rc: attrs.rc ? attrs.rc : AUTH_DEFAULT_RC,
  };
  this.Uses = _Uses;
  this.Device = _Device;
  this.Skey = _Skey;
  this.Data = _Data;
  this.Hmac = _Hmac;
}

function Uses(attrs) {
  this['@'] = {
    pi: Object.values(USES_PI).includes(attrs.pi) ? attrs.pi : USES_DEFAULT_PI,
    pa: Object.values(USES_PA).includes(attrs.pa) ? attrs.pa : USES_DEFAULT_PA,
    pfa: Object.values(USES_PFA).includes(attrs.pfa) ? attrs.pfa : USES_DEFAULT_PFA,
    bio: Object.values(USES_BIO).includes(attrs.bio) ? attrs.bio : USES_DEFAULT_BIO,
    pin: Object.values(USES_PIN).includes(attrs.pin) ? attrs.pin : USES_DEFAULT_PIN,
    otp: Object.values(USES_OTP).includes(attrs.otp) ? attrs.otp : USES_DEFAULT_OTP,
    // TODO if make bt mandatory if bio = y
    ...(attrs.bio === USES_BIO.YES &&
      Object.values(USES_BT).includes(attrs.bt) && { bt: attrs.bt }),
  };
}

function Device(attrs) {
  this['@'] = {
    udc: attrs.udc ? attrs.udc : META_DEFAULT_UDC,
    // TODO do bioauth check
    ...(attrs.rdsId &&
      attrs.rdsVer &&
      attrs.dpId &&
      attrs.dc &&
      attrs.mi &&
      attrs.mc && {
        rdsId: attrs.rdsId,
        rdsVer: attrs.rdsVer,
        dpId: attrs.dpId,
        dc: attrs.dc,
        mi: attrs.mi,
        mc: attrs.mc,
      }),
  };
}

function Skey(encEncrySKey, attrs) {
  this['@'] = {
    ci: moment(attrs.ci, CERT_EXPRY_FORMAT, true).isValid() ? attrs.ci : TEST_CERT_CI(),
  };
  this['#'] = encEncrySKey;
}

function Data(data, attrs) {
  this['@'] = {
    type: Object.values(DATA_TYPE).indexOf(attrs.type) > -1 ? attrs.type : DATA_DEFAULT_TYPE,
  };
  this['#'] = data;
}

function Hmac(hmac) {
  this['#'] = hmac;
}

function Pi(attrs) {
  this['@'] = Object.assign(
    attrs.name && {
      ms: Object.values(PI_MATCHING_STGY).includes(attrs.ms) ? attrs.ms : PI_DEFAULT_MTCH_STGY,
      mv: Object.values(PI_MATCH_VALUE).includes(attrs.mv) ? attrs.mv : PI_DEFAULT_MATCH_VALUE,
      name: attrs.name,
    },
    // TODO add lang check
    attrs.lname && {
      lname: attrs.lname,
      lmv: Object.values(PI_LMATCH_VALUE).includes(attrs.lmv) ? attrs.lmv : PI_DEFAULT_LMATCH_VALUE,
    },
    Object.values(PI_GENDER).includes(attrs.gender) && { gender: attrs.gender },
    (moment(attrs.dob, PI_DOB_FORMAT, true).isValid() ||
      moment(attrs.dob, PI_DOB_YEAR_FORMAT, true).isValid()) && { dob: attrs.dob },
    Object.values(PI_DOB_TYPE).includes(attrs.dobt) && { dobt: attrs.dobt },
    attrs.age && { age: attrs.age },
    attrs.phone && { phone: attrs.phone },
    attrs.email && { email: attrs.email },
  );
}

function Pa(attrs) {
  this['@'] = Object.assign(
    (attrs.co ||
      attrs.house ||
      attrs.street ||
      attrs.lm ||
      attrs.loc ||
      attrs.vtc ||
      attrs.subdist ||
      attrs.dist ||
      attrs.state ||
      attrs.country ||
      attrs.pc ||
      attrs.po) && {
      ms: Object.values(PA_MATCHING_STGY).indexOf(attrs.ms) > -1 ? attrs.ms : PA_DEFAULT_MTCH_STGY,
    },
    attrs.co && { co: attrs.co },
    attrs.house && { house: attrs.house },
    attrs.street && { street: attrs.street },
    attrs.lm && { lm: attrs.lm },
    attrs.loc && { loc: attrs.loc },
    attrs.vtc && { vtc: attrs.vtc },
    attrs.subdist && { subdist: attrs.subdist },
    attrs.dist && { dist: attrs.dist },
    attrs.state && { state: attrs.state },
    attrs.country && { country: attrs.country },
    attrs.pc && { pc: attrs.pc },
    attrs.po && { po: attrs.po },
  );
}

function Pfa(attrs) {
  this['@'] = Object.assign(
    attrs.av && {
      ms: Object.values(PFA_MATCHING_STGY).includes(attrs.ms) ? attrs.ms : PFA_DEFAULT_MTCH_STGY,
      mv: Object.values(PFA_MATCH_VALUE).includes(attrs.mv) ? attrs.mv : PFA_DEFAULT_MATCH_VALUE,
      av: attrs.av,
    },
    // TODO add lang check
    attrs.lav && {
      lav: attrs.lav,
      lmv: Object.values(PFA_LMATCH_VALUE).includes(attrs.lmv)
        ? attrs.lmv
        : PFA_DEFAULT_LMATCH_VALUE,
    },
  );
}

function Bios(attrs, bio) {
  if (
    Object.values(BIO_TYPE).indexOf(attrs.type) < 0 ||
    Object.values(BIO_POSH).indexOf(attrs.posh) < 0 ||
    !attrs.bs ||
    attrs.bio
  ) {
    return;
  }

  this['@'] = {
    dih: attrs.dih,
  };
  this.Bio = {
    '@': {
      type: attrs.type,
      posh: attrs.posh,
      bs: attrs.bs,
    },
    '#': bio,
  };
}

function Pv(attrs) {
  if ((IS_UIDAI && !attrs.otp && !attrs.pin) || (!IS_UIDAI && !attrs.otp)) {
    return;
  }
  this['@'] = { otp: attrs.otp, ...(IS_UIDAI && { pin: attrs.pin }) };
}

function Demo(_Pi, _Pa, _Pfa, attrs) {
  this['@'] = {
    ...(attrs && Object.values(LANGUAGE_CODE).includes(attrs.lang) && { lang: attrs.lang }),
  };
  if (_Pi || !Object.isEmpty(_Pi)) {
    this.Pi = _Pi;
  }
  if (_Pa || !Object.isEmpty(_Pa)) {
    this.Pa = _Pa;
  }
  if (_Pfa || !Object.isEmpty(_Pfa)) {
    this.Pfa = _Pfa;
  }
}

function Pid(_Demo, _Bios, _Pv, attrs) {
  this['@'] = {
    'xmlns:ns2': PID_XMLNS,
    ts: moment(attrs.ts, PID_TS_ISO8601, true).isValid()
      ? attrs.ts
      : moment().format(PID_TS_ISO8601),
    ver: attrs.ver ? attrs.ver : PID_DEFAULT_VER,
    ...(false && { wadh: attrs.wadh }),
  };
  if (_Demo || !Object.isEmpty(_Demo)) {
    this.Demo = _Demo;
  }
  if (_Bios || !Object.isEmpty(_Bios)) {
    this.Bios = _Bios;
  }
  if (_Pv || !Object.isEmpty(_Pv)) {
    this.Pv = _Pv;
  }
}

function init() {
  const AUTH_XMLNS = AUTH_XMLNS_API2_0;
  PID_XMLNS = PID_XMLNS_API2_0;
  AUTH_DEFAULT_TID = AUTH_DEFAULT_TID_API2_5;

  encryptor.init();
}

function buildUrlPath(uid, pathTemplate) {
  const ver = API_VERSION;
  const ac = constants.TEST_AUTH_CODE;
  const uid0 = uid[0];
  const uid1 = uid[1];
  const asalk = constants.TEST_ASA_LICENSEKEY;

  const path = pathTemplate
    .replace('<ver>', ver)
    .replace('<ac>', ac)
    .replace('<uid[0]>', uid0)
    .replace('<uid[1]>', uid1)
    .replace('<asalk>', asalk);

  return path;
}

function testReq(uid, reqXml) {
  const options = {
    hostname: URL_AUTH_HOST,
    path: buildUrlPath(uid, URL_AUTH_PATHTEMPLATE),
    method: 'POST',
    headers: {
      'Content-Type': constants.CONTENT_TYPE,
      'Content-Length': Buffer.byteLength(reqXml),
      // REMOTE_ADDR: '127.0.1.1',
    },
  };

  const req = https.request(options, (res) => {
    // console.log(res.statusCode);
    let buffer = '';
    res.on('data', (data) => {
      buffer += data;
      // console.log(buffer);
    });
    res.on('end', () => {
      console.log('\nResponse: ');
      console.log(buffer);
      process.exit();
    });
  });

  req.on('error', (err) => {
    console.log(err.message);
  });

  console.log('\nURL: ');
  console.log(`${URL_AUTH_HOST}/${buildUrlPath(uid, URL_AUTH_PATHTEMPLATE)}`);

  // reqXml = fs.readFileSync(require('path').join(__dirname, '..', '..', 'res', 'example_request_auth1_6.xml'),'utf8');
  console.log('\nSending XML: ');
  console.log(reqXml);
  req.write(reqXml);
  req.end();
}

const buildXml = () => {
  init();

  const TEST_PERSON = constants.TEST_DATA[2];

  const uses = new Uses({
    pi: USES_DEFAULT_PI,
    pa: USES_DEFAULT_PA,
    pfa: USES_DEFAULT_PFA,
    bio: USES_DEFAULT_BIO,
    pin: USES_DEFAULT_PIN,
    otp: USES_DEFAULT_OTP,
  });

  const device = new Device({ udc: META_DEFAULT_UDC });

  const ci = moment(encryptor.getExpiry(), DATE_FORMAT_UNIX).format(CERT_EXPRY_FORMAT);
  const sKey = encryptor.getSessionKey();
  const encrySKey = encryptor.encryptUsingPublicKey(sKey.toString('binary'));
  const encEncrySKey = encryptor.encode64(encrySKey);

  const skey = new Skey(encEncrySKey, { ci });

  const pi = new Pi({
    ms: PI_DEFAULT_MTCH_STGY,
    mv: PI_DEFAULT_MATCH_VALUE,
    name: TEST_PERSON.name,
    /*
    lname: TEST_PERSON.name,    
    gender: TEST_PERSON.gender,
    dob: TEST_PERSON.dob,
    dobt: TEST_PERSON.dobt,
    age: TEST_PERSON.dobt,
    phone: TEST_PERSON.phone,
    email: TEST_PERSON.email, */
  });
  /* const pa = new Pa({
    ms: PA_DEFAULT_MTCH_STGY,
    street: TEST_PERSON.street,
    vtc: TEST_PERSON.vtc,
    subdist: TEST_PERSON.subdist,
    dist: TEST_PERSON.district,
    state: TEST_PERSON.state,
    pc: TEST_PERSON.pincode,
  }); */

  const demo = new Demo(pi);

  let empty;
  const ts = moment().subtract(1, 'hour').format(PID_TS_ISO8601);
  const ver = PID_DEFAULT_VER;
  const pid = new Pid(demo, empty, empty, { ts, ver });

  const pidXml = js2xml.parse('ns2:Pid', pid /* , {declaration: {include: false}} */);
  console.log(`PID:\n${pidXml}`);

  const encryPidXml = encryptor.encryptUsingSessionKey(pidXml, ts, sKey, true);
  const encEncryPidXml = encryptor.encode64(encryPidXml);
  const data = new Data(encEncryPidXml, { type: DATA_DEFAULT_TYPE });

  const pidXmlHash = encryptor.generateSha256Hash(pidXml);
  const encryPidXmlHash = encryptor.encryptUsingSessionKey(pidXmlHash, ts, sKey);
  const encEncryPidXmlHash = encryptor.encode64(encryPidXmlHash);
  const hmac = new Hmac(encEncryPidXmlHash);

  const auth = new Auth(uses, device, skey, data, hmac, {
    uid: TEST_PERSON.uid,
    rc: AUTH_DEFAULT_RC,
    tid: AUTH_DEFAULT_TID,
    ac: AUTH_AUA_CODE,
    sa: AUTH_SUBAUA_CODE,
    ver: AUTH_DEFAULT_VER,
    txn: 'testTxn',
    lk: AUTH_AUA_LICENSEKEY,
  });

  const authXml = js2xml.parse('Auth', auth /* , {declaration: {include: false}} */);
  // console.log("AUTH: \n" + authXml);

  signer.sign(authXml).then((sign) => {
    testReq(TEST_PERSON.uid, sign);
  });
};

buildXml();
// encryptor.test();
