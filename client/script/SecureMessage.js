if(typeof module != "undefined")
  var forge = require('node-forge');

const symmetricAlgorithm = 'AES-CBC';
const symmetricKeySize   = 16;
const hashAlgorithm      = 'SHA256';

var SecureMessage = function SecureMessage(msg) {
  this.message = msg;
  this.signature = "";
}

SecureMessage.prototype.setID = function (num) {
  this.message.id = (num == -1)?(Math.abs(Math.floor(Math.random() * Math.pow(2,32)))):(num+1);
}

//returns HEX of the encripted SecureMessage
SecureMessage.symmetricEncrypt = function(k, data) {
  var cipher = forge.cipher.createCipher(symmetricAlgorithm, k.key);
  cipher.start({iv: k.iv});
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  var encrypted = cipher.output;
  return encrypted.toHex();
}

SecureMessage.symmetricDecrypt = function(k, data) {
  var decipher = forge.cipher.createDecipher(symmetricAlgorithm, k.key);
  decipher.start({iv: k.iv});
  decipher.update(forge.util.createBuffer(data));
  var result = decipher.finish(); // check 'result' for true/false
  // outputs decrypted hex
  return decipher.output.toString();
}

SecureMessage.prototype.encrypt = function (k) {
  return SecureMessage.symmetricEncrypt(k, this.stringify());
}

SecureMessage.prototype.encryptText = function (k) {
  this.message.text = SecureMessage.symmetricEncrypt(k, this.message.text);
}

//returns decrypted SecureMessage from HEX ciphertext
SecureMessage.decrypt = function (k, ciphertext) {
  var data = forge.util.hexToBytes(ciphertext);
  var decrypted = SecureMessage.symmetricDecrypt(k, data);
  return SecureMessage.parse(decrypted);
}

SecureMessage.prototype.decryptText = function (k) {
  var data = forge.util.hexToBytes(this.message.text);
  var decrypted = SecureMessage.symmetricDecrypt(k, data);
  this.message.text = decrypted;
}

SecureMessage.prototype.sign = function (pem) {
  var privateKey = forge.pki.privateKeyFromPem(pem);
  var md = forge.md.sha256.create();
  md.update(JSON.stringify(this.message));
  this.signature = forge.util.bytesToHex(privateKey.sign(md));
}

SecureMessage.prototype.verify = function (pem) {
  var publicKey = forge.pki.publicKeyFromPem(pem);
  var md = forge.md.sha256.create();
  md.update(JSON.stringify(this.message));
  var signature = forge.util.hexToBytes(this.signature);
  var verified = publicKey.verify(md.digest().bytes(), signature);
  return verified;
}

SecureMessage.prototype.stringify = function () {
  return JSON.stringify(this);
}

SecureMessage.parse = function (json) {
  var m = new SecureMessage();
  var parsed = JSON.parse(json);
  m.message = parsed.message;
  m.signature = parsed.signature;
  return m;
}

SecureMessage.getRandomBytes = function (size) {
  return orge.random.getBytesSync(size);
}

SecureMessage.prototype.extractSessionKey = function (pem) {
  var privateKey = forge.pki.privateKeyFromPem(pem);
  var temp = {
    key: forge.util.hexToBytes(this.message.sessionKey.key),
    iv: forge.util.hexToBytes(this.message.sessionKey.iv)
  }
  temp.key = privateKey.decrypt(temp.key);
  return temp;
}

SecureMessage.prototype.appendSessionKey = function (pem) {
  var publicKey = forge.pki.publicKeyFromPem(pem);
  var temp = {
    key: forge.random.getBytesSync(16),
    iv: forge.random.getBytesSync(16)
  }

  this.message.sessionKey = {
    key: forge.util.bytesToHex(publicKey.encrypt(temp.key)),//crypto.publicEncrypt(key, new Buffer(temp.key, 'hex')).toString('hex'),
    iv: forge.util.bytesToHex(temp.iv)
  };

  return temp;
}

SecureMessage.getSecureMessage = function (data, sessionKey) {
  if(SecureMessage.isClearTxt(data.toString())) {
    var secmsg = SecureMessage.parse(data.toString());
  }
  else {
    var secmsg = SecureMessage.decrypt(sessionKey, data.toString());
  }
}

SecureMessage.isClearTxt = function(msg) {
  try {
    JSON.parse(msg);
  } catch (e) {
    return false;
  }
  return true;
}

if(typeof module != "undefined")
  module.exports = SecureMessage;
