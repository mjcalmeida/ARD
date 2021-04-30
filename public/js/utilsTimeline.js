const dbKnex = require("../../models/database/db_Knex");
const Timeline = require("../../models/Timeline");
const Utils = require("../js/utils");
const utils = new Utils();
const UtilsEmail = require("../js/utilsEmail");
const utilsEmail = new UtilsEmail();

module.exports = class UtilsTimeline {
    getAgenda(dataPesquisa, periodo) {
        return new Promise(resolve => {
            var wDia = dataPesquisa.getDate();
            var wMes = parseInt(dataPesquisa.getMonth())+1;
            var wAno = dataPesquisa.getFullYear();

            var Query = 
            `Select * from 
                (Select 
                tl.eventoId, 
                dataProximoEvento Data,
                acao Acao,
                titulo email,
                emailId,
                body,
                if(tl.unidade = "Dias", 
                    if(tl.antesDepois = "-",
                        date_sub(ev.dataProximoEvento, interval tl.quantidade day),
                        date_add(ev.dataProximoEvento, interval tl.quantidade day)),
                if(tl.unidade = "Meses", 
                    if(tl.antesDepois = "-",
                        date_sub(ev.dataProximoEvento, interval tl.quantidade month),
                        date_add(ev.dataProximoEvento, interval tl.quantidade month)),
                if(tl.unidade = "Anos", 
                    if(tl.antesDepois = "-",
                        date_sub(ev.dataProximoEvento, interval tl.quantidade day),
                        date_add(ev.dataProximoEvento, interval tl.quantidade day)), 
                "Erro")
                )) dataAcao
            from eventos ev
            inner join Timeline tl on ev.id = tl.eventoId
            inner join emails   em on em.id = tl.emailId) as Q1
            where `

            if(periodo =="dd") { 
                Query += `day(dataAcao)   = ` + wDia + ` and `;
                Query += `month(dataAcao) = ` + wMes + ` and `
            } 
            if(periodo =="mm") { 
                Query += `month(dataAcao) = ` + wMes + ` and `;
            }
            
            Query += `year(dataAcao) = ` + wAno;
            Query += ` order by dataAcao`

            dbKnex.raw( Query )
            .then(result => {
                var Saida = result[0];
                resolve(Saida);
            })
            .catch(erro => {
                console.log(erro);
            });
        })
    }

    async chkJobsDia(dataPesquisa, periodo){
        return await this.getAgenda(dataPesquisa, periodo);
    }

    async processaJob(jobDia){
        switch (jobDia.Acao) {
            case 'Email':
                var destinatarios = await this.getDestinatarios(jobDia.emailId, jobDia.eventoId)
                console.log(destinatarios);
                utilsEmail.enviarEmails(jobDia.body, jobDia.emailId, destinatarios)
                break;
                case 'Caixa Postal':
                    break;
                    case 'Relatorio':
                        break;
                        default:
                            utils.gravaMensagem('Job não cadastrado: ' + jobDia.Acao )
        }
    }

    getDestinatarios(emailId, eventoId){
        return new Promise(resolve => {
            var Saida=[];

            var Query = 
            `Select pessoaId, grupoId 
            From TimeLineDestinatarios
            where eventoId = ` + eventoId
            Query += ` and emailId  = ` + emailId

            dbKnex.raw( Query )
            .then(result => {
                var Destinatarios = result[0];
                var n = 0;

                Destinatarios.forEach(destinatario => {
                    //  Email por grupo
                    Query = `
                        Select emailPessoa
                        from pessoas
                        where Ativo = 1
                        and receberEmails = 1
                        and emailPessoa <> ''
                    `

                    if( destinatario.pessoaId == 1){
                       if( destinatario.grupoId != 99){
                           Query += ` and grupoId = ` + destinatario.grupoId
                       }
                    } else {
                        Query += ` and id = ` + destinatario.pessoaId
                    }

                    dbKnex.raw( Query )
                    .then(result => {
                    n++; 
                    resolve(Saida);
                })
                });

            })
            .catch(erro => {
                console.log(erro);
            });
        })
    }
}