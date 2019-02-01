var Sequelize = require('sequelize');


const sequelize = new Sequelize('cpt_DB', 'root', 'CodeRae2019!', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});


// set up Scans Table in mysql
var Scans = sequelize.define('scans',{
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        cpt: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        }

});

// create all defined tables in the database
sequelize.sync()
    .then(() => console.log('Scans tables has been successfully created if one does not exist'))
    .catch(error => console.log('This error occured', error));


// export Scans module 
module.exports = Scans;

