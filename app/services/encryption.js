const CryptoJS = require("crypto-js");
const Encrypt_Decrypt_Key = process.env.Encrypt_Decrypt_Key;
const Encrypt_Decrypt_Initialize_Vector = process.env.Encrypt_Decrypt_Initialize_Vector;
const KEY = CryptoJS.enc.Utf8.parse(Encrypt_Decrypt_Key);
const INITIALIZE_VECTOR = CryptoJS.enc.Utf8.parse(Encrypt_Decrypt_Initialize_Vector);

function encryptWithAES256(object) {
    try {
        const encryptedValue = CryptoJS.AES.encrypt(JSON.stringify(object), KEY, {
          iv: INITIALIZE_VECTOR,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
          keySize: 16
        }).toString();
     
        return encryptedValue;
    } catch (error) {
        throw error;
    }
}
 
function  decryptWithAES256(cipherText) {
    try {
        const decryptedValue = CryptoJS.AES.decrypt(cipherText, KEY, {
          iv: INITIALIZE_VECTOR,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
          keySize: 16
        }).toString(CryptoJS.enc.Utf8);
     
        return decryptedValue;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    encryptWithAES256,
    decryptWithAES256
};
