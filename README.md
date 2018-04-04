# Aadhaar

Nodejs code for Aadhaar OTP 1.5, 1.6 and Aadhaar Auth 1.6, 2.0 APIs. All test certificates are included, so, it just works :). A part of the project depends on open-ssl. Make sure you have that. Feel free to fork / create PRs. I'll keep updating if it is useful

Quick usage

**Auth:**
```
cd aadhaar
npm install
node lib/auth/xml.js
```

**OTP:**
```
cd aadhaar
npm install
node lib/otp/xml.js
```

Main codes in lib/auth/xml.js and lib/otp/xml.js. Keys in res/. License Keys, Test data in utils/constants.js

###### TODO

- Add service
- Add front-end
- Add other aadhaar apis
- Remove dependency on open-ssl by editing xml-signer 
- Cleanup redundant crypto modules (pem, crypto)
- Add XSD verification
- Update README
