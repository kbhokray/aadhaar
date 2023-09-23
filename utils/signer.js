const select = require('xml-crypto').xpath;
const dom = require('xmldom').DOMParser;
const { SignedXml } = require('xml-crypto');
const pem = require('pem');
const js2xml = require('js2xmlparser');
const deasync = require('deasync');

const constants = require('./constants');

const SIG_XPATH_ALL = '/*';
// const SIG_ALGO_RSASHA1 = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
const SIG_TRANSFORM_ENVELOPED = 'http://www.w3.org/2000/09/xmldsig#enveloped-signature';
const SIG_CANON_XMLC14N = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
const SIG_DIGEST_SHA1 = 'http://www.w3.org/2001/04/xmlenc#sha256'; // 'http://www.w3.org/2000/09/xmldsig#sha1';

const SIG_XPATH_SIGNATURE =
  "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']";

const SIG_ALGO_RSASHA1 = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
const readP12 = new Promise((resolve, reject) => {
  const password = 'public';
  pem.readPkcs12(constants.STAGING_PRIVKEY_P12, { p12Password: password }, (err, res) => {
    if (err) {
      reject(err);
    }
    resolve(res);
  });
});

let cert;
let certInfo = '';
const extractCertInfo = (ks) => {
  return new Promise((resolve, reject) => {
    cert = ks.cert;
    pem.readCertificateInfo(ks.cert, (err, info) => {
      if (err) {
        reject(err);
      }
      certInfo += `CN=${info.commonName}`;
      certInfo += ',';
      certInfo += `OU=${info.organizationUnit}`;
      certInfo += ',';
      certInfo += `O=${info.organization}`;
      certInfo += ',';
      certInfo += `L=${info.locality}`;
      certInfo += ',';
      certInfo += `ST=${info.state}`;
      certInfo += ',';
      certInfo += `C=${info.country}`;
      const res = Object.assign(ks, { certInfo });

      resolve(res);
    });
  });
};

function X509Data(x509SubjectName, x509Certificate) {
  this.X509SubjectName = x509SubjectName;
  this.X509Certificate = x509Certificate;
}

function X509SubjectName(x509SubjName) {
  this['#'] = x509SubjName;
}

function X509Certificate(x509Certificate) {
  this['#'] = x509Certificate;
}

function generateKeyInfoXml(_cert, _certInfo) {
  const x509SubjName = new X509SubjectName(_certInfo);
  const trimmedCert = _cert
    .replace(/^\s*-----BEGIN CERTIFICATE-----\s*/, '')
    .replace(/\s*-----END CERTIFICATE-----\s*$/, '');
  const x509Cert = new X509Certificate(trimmedCert);

  const x509Data = new X509Data(x509SubjName, x509Cert);
  return js2xml.parse('X509Data', x509Data, { declaration: { include: false } });
}

function KeyInfo() {
  this.getKeyInfo = () => {
    const keyInfoXml = generateKeyInfoXml(cert, certInfo);
    return keyInfoXml;
  };

  this.getKey = (keyInfo) => {
    let certStr = keyInfo['0'].childNodes[0].getElementsByTagName('X509Certificate')[0].textContent;
    certStr = `-----BEGIN CERTIFICATE-----\n${certStr}\n-----END CERTIFICATE-----`;
    let done = false;
    let stagingPublicKey;
    pem.getPublicKey(certStr, function cb(err, res) {
      stagingPublicKey = res.publicKey;
      done = true;
    });
    deasync.loopWhile(() => {
      return !done;
    });
    // you can use the keyInfo parameter to extract the key in any way you want
    return stagingPublicKey;
  };
}

function generateSig(xml, key) {
  const sig = new SignedXml();
  sig.signatureAlgorithm = SIG_ALGO_RSASHA1;
  let empty;
  sig.addReference(
    SIG_XPATH_ALL,
    [SIG_TRANSFORM_ENVELOPED, SIG_CANON_XMLC14N],
    SIG_DIGEST_SHA1,
    SIG_DIGEST_SHA1,
    empty,
    empty,
    true,
  );
  sig.signingKey = key;
  sig.keyInfoProvider = new KeyInfo();
  sig.computeSignature(xml);
  const signedXml = sig.getSignedXml();
  // console.log('SIGNED XML = \n' + signedXml);
  // validateSig(signedXml);
  return signedXml;
}

function validateSig(xml) {
  const doc = new dom().parseFromString(xml);

  const signature = select(doc, SIG_XPATH_SIGNATURE)[0];
  const sig = new SignedXml();
  sig.keyInfoProvider = new KeyInfo();
  sig.loadSignature(signature);
  const res = sig.checkSignature(xml);
  if (!res) {
    console.log(sig.validationErrors);
    return false;
  }
  return true;
}

exports.sign = (xml) => {
  return new Promise((resolve, reject) => {
    readP12
      .then(extractCertInfo)
      .then((res) => {
        const sign = generateSig(xml, res.key, res.cert);
        resolve(sign);
      })
      .catch((err) => {
        console.log(err.stack);
        reject(err);
      });
  });
};

const xml =
  '<upi:RespPay xmlns:upi="http://npci.org/upi/schema/"><Head ver="1.0" ts="2015-01-16T14:15:47+05:30" orgId="npci" msgId="2"/><Txn id="8ENSVVR4QOS7X1UGPY7JGUV444PL9T2C3QM" note="Sending money for your use" ts="2015-01-16T14:15:42+05:30" type="PAY"><RiskScores><Score provider="sp" type="TXNRISK" value=""/><Score provider="npci" type="TXNRISK" value=""/></RiskScores></Txn><Resp reqMsgId="1" result="SUCCESS" approvalNum="3MKBVB"><Ref type="PAYER" seqNum="1" addr="kbhokray@upi" settAmount="5000" approvalNum="AWHWU9" /><Ref type="PAYEE" seqNum="2" addr="manager@upi" settAmount="5000" approvalNum="ESOP61" /></Resp></upi:RespPay>';

// exports.sign(xml);
