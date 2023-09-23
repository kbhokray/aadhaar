exports.CONTENT_TYPE = 'application/xml';
exports.TEST_AUA_LICENSEKEY = 'MAvSQG0jKTW4XxQc2cI-oXZYxYH-zi7IWmsQY1q3JNLlC8VOWOHYGj8';
exports.TEST_ASA_LICENSEKEY = 'MCNYL7FpPgjEhx7HBp9tu59Vdm4FnYGlxuqHctfAeNNaCufVafshqzQ';
exports.TEST_AUTH_CODE = 'public';
exports.TEST_SUBAUA_CODE = exports.TEST_AUTH_CODE;
exports.UIDAI_STAGE_CERT = require('path').join(__dirname, '..', 'res', 'AuthStaging25082025.cer');
exports.STAGING_PRIVKEY_P12 = require('path').join(
  __dirname,
  '..',
  'res',
  'Staging_Signature_PrivateKey.p12',
);

exports.OTP_HOST = 'https://<host>/otp/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>';

exports.OTP = {
  API1_5: {
    API_VERSION: '1.5',
    URL_OTP_HOST: 'auth.uidai.gov.in',
    URL_OTP_PATHTEMPLATE: '/otp/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>',
  },

  API1_6: {
    API_VERSION: '1.6',
    URL_OTP_HOST: 'developer.uidai.gov.in', // 'auth.uidai.gov.in',
    URL_OTP_PATHTEMPLATE: '/otp/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>',
  },
};

exports.TEST_DATA = [
  {
    uid: '999941057058',
    name: 'Shivshankar Choudhury',
    dob: '13-05-1968',
    dobt: 'V',
    gender: 'M',
    phone: '2810806979',
    email: 'sschoudhury@dummyemail.com',
    street: '12 Maulana Azad Marg',
    vtc: 'New Delhi',
    subdist: 'New Delhi',
    district: 'New Delhi',
    state: 'New delhi',
    pincode: '110002',
  },

  {
    uid: '999971658847',
    name: 'Kumar Agarwal',
    dob: '04-05-1978',
    dobt: 'A',
    gender: 'M',
    phone: '2314475929',
    email: 'kma@mailserver.com',
    building: 'IPP, IAP',
    landmark: 'Opp RSEB Window',
    street: '5A Madhuban',
    locality: 'Veera Desai Road',
    vtc: 'Udaipur',
    district: 'Udaipur',
    state: 'Rajasthan',
    pincode: '313001',
  },

  {
    uid: '999933119405',
    name: 'Fatima Bedi',
    dob: '30-07-1943',
    dobt: 'A',
    gender: 'F',
    phone: '2837032088',
    email: 'bedi2020@mailserver.com',
    building: 'K-3A Rampur Garden',
    vtc: 'Bareilly',
    district: 'Bareilly',
    state: 'Uttar Pradesh',
    pincode: '243001',
  },

  {
    uid: '999955183433',
    name: 'Rohit Pandey',
    dob: '08-07-1985',
    dobt: 'A',
    gender: 'M',
    phone: '2821096353',
    email: 'rpandey@mailserver.com',
    building: '603/4 Vindyachal',
    street: '7TH Road Raja Wadi',
    locality: 'Neelkanth Valley',
    poname: 'Ghatkopar (EAST)',
    vtc: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharastra',
    pincode: '243001',
  },

  {
    uid: '999990501894',
    name: 'Anisha Jay Kapoor',
    gender: 'F',
    dob: '01-01-1982',
    dobt: 'V',
    building: '2B 203',
    street: '14 Main Road',
    locality: 'Jayanagar',
    district: 'Bangalore',
    state: 'Karnataka',
    pincode: '560036',
  },
];
