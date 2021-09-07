'use strict';

(function (global) {
  var crypt = {
    secret: function (pass = null) {
      if (pass) {
        return pass;
      }

      pass = prompt('Password?');

      if (
        this.decrypt('U2FsdGVkX1/kvSQuxlThWchlyGSMOwi8JrgTqp8U8WQ=', pass)
        ===
        this.decrypt(this.encrypt('test-string-key', pass), pass)
      ) {
        return pass;
      }

      alert('INVALID PASSWORD!');
      throw new Error('INVALID PASSWORD');
    },

    encrypt: function (clear, pass = null) {
      var cipher = CryptoJS.AES.encrypt(clear, crypt.secret(pass));
      cipher = cipher.toString();
      return cipher;
    },

    decrypt: function (cipher, pass = null) {
      var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret(pass));
      decipher = decipher.toString(CryptoJS.enc.Utf8);
      return decipher;
    }
  };

  function openDrive() {
    var url = crypt.decrypt('U2FsdGVkX18i0dSp8kZzgz9wAWiGdEjbVyM7Jtq8426QT1nSduDcCsfHifz9gnYPmKDb9R1sYvI7qm9pr6Uy+DPGb/L53AAU3JjNUydXqfP1fMaAhwpviBiGj/oRKBnPRuBnHZqa2gJxNyX8h+ohM8qTeq8kt8aAEBp5CQbjLnc=');

    window.open(url);
  }

  global.openDrive = openDrive;
})(window);
