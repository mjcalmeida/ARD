const Utils = require("../js/utils");
const utils = new Utils();

module.exports = class UtilsEmail {
    enviarEmails(body, emailId, destinatarios ){
        destinatarios.forEach(destinatario => {
            utils.gravaMensagem("Enviando email (" + emailId + " para " + destinatario + ")");
        })
    }
}