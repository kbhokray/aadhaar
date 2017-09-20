// https://<host>/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>
exports.CONTENT_TYPE = 'application/xml';
exports.TEST_AUA_LICENSEKEY = 'MEaMX8fkRa6PqsqK6wGMrEXcXFl_oXHA-YuknI2uf0gKgZ80HaZgG3A';
exports.TEST_ASA_LICENSEKEY = 'MG41KIrkk5moCkcO8w-2fc01-P7I5S-6X2-X7luVcDgZyOa2LXs3ELI';
exports.TEST_AUTH_CODE = 'public';
exports.TEST_SUBAUA_CODE = exports.TEST_AUTH_CODE;
exports.UIDAI_STAGE_CERT = require('path').join(__dirname, '..', 'res', 'uidai_auth_stage.cer');
exports.STAGING_PRIVKEY_P12 = require('path').join(__dirname,  '..', 'res', 'Staging_Signature_PrivateKey.p12');

exports.OTP_HOST = 'https://<host>/otp/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>';

exports.AUTH = {
	API1_6: {
		API_VERSION: '1.6',
		URL_AUTH_HOST: 'auth.uidai.gov.in',
		URL_AUTH_PATHTEMPLATE: '/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>'
	},

	API2_0: {
		API_VERSION: '2.0',
		URL_AUTH_HOST: 'developer.uidai.gov.in', //'auth.uidai.gov.in',
		URL_AUTH_PATHTEMPLATE: '/auth/<ac>/<uid[0]>/<uid[1]>/<asalk>'//'<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>'
	}
}


exports.OTP = {
	API1_5: {
		API_VERSION: '1.5',
		URL_OTP_HOST: 'auth.uidai.gov.in',
		URL_OTP_PATHTEMPLATE: '/otp/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>'
	},

	API1_6: {
		API_VERSION: '1.6',
		URL_OTP_HOST: 'developer.uidai.gov.in', //'auth.uidai.gov.in',
		URL_OTP_PATHTEMPLATE: '/otp/<ver>/<ac>/<uid[0]>/<uid[1]>/<asalk>'
	}
}

exports.TEST_DATA = [{
	uid : '999999990019',
	name : 'Shivshankar Choudhury',
	dob : '13-05-1968',
	dobt : 'V',
	gender : 'M',
	phone : '2810806979',
	email : 'sschoudhury@dummyemail.com',
	street : '12 Maulana Azad Marg',
	vtc : 'New Delhi',
	subdist : 'New Delhi',
	district : 'New Delhi',
	state : 'New delhi',
	pincode : '110002'
},

{
	uid : '999999990026',
	name : 'Kumar Agarwal',
	dob : '04-05-1978',
	dobt : 'A',
	gender : 'M',
	phone : '2314475929',
	email : 'kma@mailserver.com',
	building : 'IPP, IAP',
	landmark : 'Opp RSEB Window',
	street : '5A Madhuban',
	locality : 'Veera Desai Road',
	vtc : 'Udaipur',
	district : 'Udaipur',
	state : 'Rajasthan',
	pincode : '313001'
},

{
	uid : '999999990042',
	name : 'Fatima Bedi',
	dob : '30-07-1943',
	dobt : 'A',
	gender : 'F',
	phone : '2837032088',
	email : 'bedi2020@mailserver.com',
	building : 'K-3A Rampur Garden',
	vtc : 'Bareilly',
	district : 'Bareilly',
	state : 'Uttar Pradesh',
	pincode : '243001'
},

{
	uid : '999999990057',
	name : 'Rohit Pandey',
	dob : '08-07-1985',
	dobt : 'A',
	gender : 'M',
	phone : '2821096353',
	email : 'rpandey@mailserver.com',
	building : '603/4 Vindyachal',
	street : '7TH Road Raja Wadi',
	locality : 'Neelkanth Valley',
	poname : 'Ghatkopar (EAST)',
	vtc : 'Mumbai',
	district : 'Mumbai',
	state : 'Maharastra',
	pincode : '243001'
},

{
	uid : '999922220032',
	name : 'Anisha Jay Kapoor',
	gender : 'F',
	dob : '01-01-1982',
	dobt : 'V',
	building : '2B 203',
	street : '14 Main Road',
	locality : 'Jayanagar',
	district : 'Bangalore',
	state : 'Karnataka',
	pincode : '560036'
},

{
	uid : '999922220013',
	name : 'Nitin Kumar Dixit',
	gender : 'M',
	dob : '02-03-1972',
	dobt : 'V',
	building : '1190/4',
	street : '5th Cross, 26th Main',
	locality : 'JP Nagar, phase 1',
	district : 'Bangalore',
	state : 'Karnataka',
	pincode : '560078'
},

{
	uid : '999922220021',
	name : 'Swamynathan Srini',
	gender : 'M',
	dob : '23-01-1947',
	dobt : 'V',
	building : '34-2',
	street : 'K G Lane',
	locality : 'Sarjapur Area',
	district : 'Bangalore',
	state : 'Karnataka',
	pincode : '560035'
},

{
	uid : '999922220045',
	name : 'John Alex Doe',
	gender : 'M',
	dob : '12-09-1973',
	dobt : 'V',
	building : '78 Block D',
	street : 'Sarjapura Road',
	locality : 'Sarjapura',
	district : 'Bangalore',
	state : 'Karnataka',
	pincode : '560081'
},

{
	uid : '999922220050',
	name : 'Ali Akbar',
	gender : 'M',
	dob : '14-10-1962',
	dobt : 'V',
	building : '34',
	street : 'Raj Main Street',
	locality : 'K R puram',
	district : 'Bangalore',
	state : 'Karnataka',
	pincode : '560078'
},

{
	uid : '999922220066',
	name : 'Amy John',
	gender : 'F',
	dob : '11-07-1987',
	dobt : 'V',
	building : 'A303',
	street : '14th Cross',
	locality : 'BTM II Layout',
	district : 'Bangalore',
	state : 'Karnataka',
	pincode : '560035'
},

{
	uid : '999922220078',
	name : 'Kishore Shah',
	gender : 'M',
	dob : '21-05-1987',
	dobt : 'V',
	building : '23 Level 1',
	street : 'Church Street',
	locality : 'Central Area',
	district : 'Bangalore',
	state : 'Karnataka',
	pincode : '560076'
}];