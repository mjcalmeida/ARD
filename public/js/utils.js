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
        var Saida = new Date();
        
        if (dataBR.length == 10) {
            Saida = new Date(dataBR.substr(6, 4),
            dataBR.substr(3, 2) - 1,
            dataBR.substr(0, 2));
        }
        return Saida;
    };    
};