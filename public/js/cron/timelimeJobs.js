const cron = require('node-cron');
const UtilsEventos = require("../../js/utilsEventos");
const utilsEventos = new UtilsEventos();
const UtilsTimeline = require("../../js/utilsTimeline");
const utilsTimeline = new UtilsTimeline();

async function timelineJobs() {
    console.log("Verificando Jobs do Dia")
   //let eventos = await utilsEventos.getEventos();

  //  eventos.forEach(evento => {
    var data = new Date();
    var jobsDia = await utilsTimeline.chkJobsDia(data, "mm");

    if( jobsDia.length == 0 ){
      utils.gravaMensagem("Não foram localizadas tarefas a fazer");
    } else {
      jobsDia.forEach(jobDia => {
        utilsTimeline.processaJob(jobDia);
      });
    }

  //  });
}

module.exports = cron.schedule('*/1 * * * *', timelineJobs, {
    scheduled:false
})