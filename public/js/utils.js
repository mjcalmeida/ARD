const getYear = require('date-fns/getYear')
const getMonth = require('date-fns/getMonth')
const getDate = require('date-fns/getDate');
const format = require('date-fns/format');

module.exports = class Utils {
    TDate(UserDate) {
        var TodayDate = new Date();
        UserDate = new Date(UserDate);

        TodayDate = ( getYear(TodayDate)      * 10000) + 
                    ((getMonth(TodayDate) +1) *   100) + 
                    ( getDate(TodayDate));
        
        UserDate  = ( getYear(UserDate)       * 10000) + 
                    ((getMonth(UserDate) +1)  *   100) + 
                    ( getDate(UserDate));
        
    //    console.log(UserDate + " <= " + TodayDate + " = " + (UserDate <= TodayDate));

        if (UserDate < TodayDate) {
            return false;
        }
        return true;
    }

    parseDateBR_ENG(dataBR) {
        var Saida = dataBR == '' ? null : dataBR ;
        
        if (Saida != null){
            if (Saida.length != undefined){
                if (Saida.indexOf('-') >= 0) {
                    Saida = Saida.split('-');
                    Saida = new Date(   Saida[0], 
                                        Saida[1] - 1, 
                                        Saida[2]);

                }
                if (Saida.indexOf('/') >= 0) {
                    Saida = new Date(   Saida.substr(6, 4),
                                        Saida.substr(3, 2) - 1,
                                        Saida.substr(0, 2));
                }
            }
        }
        return Saida;
    };

    parseDateENG_BR(dataENG){
        var Saida = dataENG;
        
        // Data em formato completo
        if (dataENG.length != undefined){
            Saida = getDate(dataENG) + "/" + 
                    getMonth(dataENG) + "/" +  
                    getYear(dataENG);
        
            // Data em formato YYYY-MM-DD
            if (dataENG.indexOf('-') >= 0) {
                dataENG = dataENG.split('-');
                Saida = 
                    dataENG[0] + "/" + 
                    dataENG[1] - 1 + "/" + 
                    dataENG[2];
            }
            if (dataBR.indexOf('/') >= 0) {
                // Data em formato MM/DD/YYYY
                Saida = new Date(   
                    dataENG.substr(6, 4),
                    dataENG.substr(3, 2) - 1,
                    dataENG.substr(0, 2));
            }  
        }
        return format(Saida,'dd/MM/yyyy');
    }
    
    updateOrCreate (model, where, newItem) {
        // First try to find the record
        return model
        .findOne({where: where})
        .then(function (foundItem) {
            if (!foundItem) {
                // Item not found, create a new one
                return model
                    .create(newItem)
                    .then(function (item) { return  {item: item, created: true}; })
            }
             // Found an item, update it
            return model
                .update(newItem, {where: where})
                .then(function (item) { return {item: item, created: false} }) ;
        })
    };

    chkArray(arrayAPesquisar, indice, Palavra){
        var Saida = false;

        if(arrayAPesquisar.length != 0){
            for(var n = 0;  n <= arrayAPesquisar.length-1; n++){
                if(arrayAPesquisar[n][indice] == Palavra)
                { Saida = true; }     
            }
        }

        return Saida;
    }
};