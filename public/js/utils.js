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
        var Saida = dataBR;
        
        if (dataBR.length != undefined){
            if (dataBR.indexOf('-') >= 0) {
                dataBR = dataBR.split('-');
                Saida = new Date(   dataBR[0], 
                                    dataBR[1] - 1, 
                                    dataBR[2]);

            }
            if (dataBR.indexOf('/') >= 0) {
                Saida = new Date(   dataBR.substr(6, 4),
                                    dataBR.substr(3, 2) - 1,
                                    dataBR.substr(0, 2));
            }
        }
        return Saida;
    };
    
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
};