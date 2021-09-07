'use strict';

(function (global) {
  var crypt = {
    secret: function (pass = null) {
      if (pass) {
        return pass;
      }

      pass = prompt('Password?');

      if (!pass) {
        throw new Error('No password!');
      }

      if (
        this.decrypt('U2FsdGVkX1/kvSQuxlThWchlyGSMOwi8JrgTqp8U8WQ=', pass)
        ===
        this.decrypt(this.encrypt('test-string-key', pass), pass)
      ) {
        return pass;
      }

      throw new Error('INVALID PASSWORD');
    },

    encrypt: function (clear, pass = null) {
      try {
        var cipher = CryptoJS.AES.encrypt(clear, crypt.secret(pass));
        cipher = cipher.toString();
        return cipher;
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    },

    decrypt: function (cipher, pass = null) {
      try {
        var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret(pass));
        decipher = decipher.toString(CryptoJS.enc.Utf8);
        return decipher;
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  };

  function openDrive() {
    var url = crypt.decrypt('U2FsdGVkX18i0dSp8kZzgz9wAWiGdEjbVyM7Jtq8426QT1nSduDcCsfHifz9gnYPmKDb9R1sYvI7qm9pr6Uy+DPGb/L53AAU3JjNUydXqfP1fMaAhwpviBiGj/oRKBnPRuBnHZqa2gJxNyX8h+ohM8qTeq8kt8aAEBp5CQbjLnc=');

    window.open(url);
  }

  global.openDrive = openDrive;
})(window);
