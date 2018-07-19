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
  this.message.id = (num == -1)?(SecureMessage.getRandomInteger()):(num+1);
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
  var newK = {
    key: k.key,
    iv: forge.random.getBytesSync(symmetricKeySize)
  };

  var encrypted = {
    ciphertext: SecureMessage.symmetricEncrypt(newK, this.stringify()),
    iv: newK.iv
  };

  return JSON.stringify(encrypted);
}

SecureMessage.prototype.encryptText = function (k) {
  var newK = {
    key: k.key,
    iv: forge.random.getBytesSync(symmetricKeySize)
  };

  var text = forge.util.encodeUtf8(this.message.text);
  this.message.text = SecureMessage.symmetricEncrypt(newK, text);
  this.message.iv = forge.util.bytesToHex(newK.iv);
}

//returns decrypted SecureMessage from HEX ciphertext
SecureMessage.decrypt = function (k, message) {
  message = JSON.parse(message);

  var newK = {
    key: k.key,
    iv: message.iv
  };


  var data = forge.util.hexToBytes(message.ciphertext);
  var decrypted = SecureMessage.symmetricDecrypt(newK, data);
  return SecureMessage.parse(decrypted);
}

SecureMessage.prototype.decryptText = function (k) {
  var newK = {
    key: k.key,
    iv: forge.util.hexToBytes(this.message.iv)
  };

  var data = forge.util.hexToBytes(this.message.text);
  var decrypted = SecureMessage.symmetricDecrypt(newK, data);
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
  return forge.random.getBytesSync(size);
}

SecureMessage.getRandomInteger = function () {
  return parseInt(forge.util.bytesToHex(forge.random.getBytesSync(4)), 16);
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
    key: forge.random.getBytesSync(symmetricKeySize),
    iv: forge.random.getBytesSync(symmetricKeySize)
  }

  this.message.sessionKey = {
    key: forge.util.bytesToHex(publicKey.encrypt(temp.key)),
    iv: forge.util.bytesToHex(temp.iv)
  };

  return temp;
}

SecureMessage.prototype.appendNonce = function() {
  this.message.nonce = SecureMessage.getRandomInteger();
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
    var m = JSON.parse(msg);
    return (typeof(m.ciphertext) === 'undefined')
}

if(typeof module != "undefined")
  module.exports = SecureMessage;
