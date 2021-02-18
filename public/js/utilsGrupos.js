const sequelize = require('sequelize');
const Grupos = require('../../models/Grupos');

module.exports = class UtilsGrupos {
    //   ---> Lista Grupos
    getGrupos(){
        return new Promise(resolve => {
            Grupos
            .findAll({
                attributes: [
                    'id',
                    'nmGrupo'
                ], 
                where: { Ativo: 1 },
                raw: true,
                order: [['nmGrupo', 'ASC']]
                })
            .then(grupos => {
                return resolve(grupos);
            })
            .catch(erro => {
                console.log(erro);
            });
        });
    }
};