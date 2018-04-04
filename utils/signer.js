const select = require('xml-crypto').xpath;
const dom = require('xmldom').DOMParser;
const SignedXml = require('xml-crypto').SignedXml;
const pem = require('pem');
const fs = require('fs');
const js2xml = require('js2xmlparser');

const constants = require('./constants.js');

const SIG_XPATH_ALL = '/*';
// const SIG_ALGO_RSASHA1 = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
const SIG_TRANSFORM_ENVELOPED = 'http://www.w3.org/2000/09/xmldsig#enveloped-signature';
const SIG_CANON_XMLC14N = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
const SIG_DIGEST_SHA1 = 'http://www.w3.org/2001/04/xmlenc#sha256'; //'http://www.w3.org/2000/09/xmldsig#sha1';

const SIG_XPATH_SIGNATURE = "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']";

const SIG_ALGO_RSASHA1 = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
var readP12 = new Promise(
    function(resolve, reject) {
        let password = 'public';
        pem.readPkcs12(constants.STAGING_PRIVKEY_P12, {p12Password : password}, function(err, res) {
            if(err) {
                reject(err);
            }
            resolve(res); 
        });
        //    let p12 = fs.readFileSync(constants.STAGING_PRIVKEY_P12, 'binary');
        //    let p12Asn1 = forge.asn1.fromDer(p12, false);
        //    let password = 'public';
        //    let pkcs12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
        //
        //    let certBags = pkcs12.getBags({bagType: forge.pki.oids.certBag});
        //    let certBag = certBags[forge.pki.oids.certBag][0];
        //    console.log(certBag.cert.subject.attributes);
        //    console.log('\n');
        //
        //    let pkBags = pkcs12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
        //    let pkBag = pkBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
        //    let pkP12 = pkBag.key;
        //    let pkPem = forge.pki.privateKeyToPem(pkP12);
        //    console.log(pkPem);
    }
);

let cert;
let certInfo = '';
var extractCertInfo = function(ks) {
    return new Promise (
        function(resolve, reject) {
            cert = ks.cert;
            pem.readCertificateInfo(ks.cert, function(err, info) {
                if(err) {
                    reject(err);
                }
                certInfo += 'CN=' + info.commonName;
                certInfo += ',';
                certInfo += 'OU=' + info.organizationUnit;
                certInfo += ',';
                certInfo += 'O=' + info.organization;
                certInfo += ',';
                certInfo += 'L=' + info.locality;
                certInfo += ',';
                certInfo += 'ST=' + info.state;
                certInfo += ',';
                certInfo += 'C=' + info.country;
                let res = Object.assign(ks, {certInfo:certInfo});

                resolve(res);
            })
        }
        );
}

function generateSig(xml, key, cert) {
    let sig = new SignedXml();
    sig.signatureAlgorithm = SIG_ALGO_RSASHA1;
    let empty;
    sig.addReference(SIG_XPATH_ALL, [SIG_TRANSFORM_ENVELOPED, SIG_CANON_XMLC14N], SIG_DIGEST_SHA1, SIG_DIGEST_SHA1, empty, empty, true);    
    sig.signingKey = key;
    sig.keyInfoProvider = new KeyInfo();
    sig.computeSignature(xml);
    let signedXml = sig.getSignedXml();
    // console.log('SIGNED XML = \n' + signedXml);
    // validateSig(signedXml);
    return signedXml;
}

function KeyInfo() {
    this.getKeyInfo = function(key, prefix) {
        prefix = prefix || '';
        prefix = prefix ? prefix + ':' : prefix;
        let keyInfoXml = generateKeyInfoXml(cert, certInfo);
        return keyInfoXml;
    }

    this.getKey = function(keyInfo) {
        let certStr = keyInfo['0'].childNodes[0].getElementsByTagName('X509Certificate')[0].textContent;
        certStr = '-----BEGIN CERTIFICATE-----\n' + certStr + '\n-----END CERTIFICATE-----';
        var done = false;
        var stagingPublicKey;
        pem.getPublicKey(certStr,function cb(err, res){
            stagingPublicKey = res.publicKey;
            done = true;
        });
        require('deasync').loopWhile(function(){return !done;});
        //you can use the keyInfo parameter to extract the key in any way you want      
        return stagingPublicKey;
    }
}

function validateSig(xml) {
    let doc = new dom().parseFromString(xml)    

    let signature = select(doc, SIG_XPATH_SIGNATURE)[0]
    let sig = new SignedXml();
    sig.keyInfoProvider = new KeyInfo();
    sig.loadSignature(signature);
    let res = sig.checkSignature(xml);
    if (!res) {
        console.log(sig.validationErrors);
        return false;
    } else {
        return true;
    }; 
}

function generateKeyInfoXml(cert, certInfo) {
    var x509SubjName = new X509SubjectName(certInfo);
    let trimmedCert = cert.replace(/^\s*-----BEGIN CERTIFICATE-----\s*/, '').replace(/\s*-----END CERTIFICATE-----\s*$/, '');
    var x509Cert = new X509Certificate(trimmedCert);

    var x509Data = new X509Data(x509SubjName, x509Cert);
    return js2xml.parse("X509Data", x509Data, {declaration: {include: false}});
}

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

exports.sign = function(xml) {
    return new Promise( function(resolve, reject) {
        readP12
        .then(extractCertInfo)
        .then(function(res) {
            let sign = generateSig(xml, res.key, res.cert);
            resolve(sign);
        })
        .catch(function(err) {
            console.log(err.stack);
        });
    })
}

var xml = '<upi:RespPay xmlns:upi="http://npci.org/upi/schema/"><Head ver="1.0" ts="2015-01-16T14:15:47+05:30" orgId="npci" msgId="2"/><Txn id="8ENSVVR4QOS7X1UGPY7JGUV444PL9T2C3QM" note="Sending money for your use" ts="2015-01-16T14:15:42+05:30" type="PAY"><RiskScores><Score provider="sp" type="TXNRISK" value=""/><Score provider="npci" type="TXNRISK" value=""/></RiskScores></Txn><Resp reqMsgId="1" result="SUCCESS" approvalNum="3MKBVB"><Ref type="PAYER" seqNum="1" addr="kbhokray@upi" settAmount="5000" approvalNum="AWHWU9" /><Ref type="PAYEE" seqNum="2" addr="manager@upi" settAmount="5000" approvalNum="ESOP61" /></Resp></upi:RespPay>';

// sign(xml);