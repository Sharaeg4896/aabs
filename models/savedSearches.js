var Sequelize = require('sequelize');


const sequelize = new Sequelize('cpt_DB', 'root', 'Austral01', {
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


// set up Saved Searches Table in mysql
var SavedSearches = sequelize.define('savedSearches',{
    cpt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    providerName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    providerAddress: {
        type: Sequelize.STRING,
        allowNull: true
    },
    providerCharged: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
    },
    medicareAllowed: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
    },
    medicarePaid: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
    },
    nationalAverage: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
    }
});

// create all defined tables in the database
sequelize.sync()
    .then(() => console.log('Saved Searches tables has been successfully created if one does not exist'))
    .catch(error => console.log('This error occured', error));


// export SavedSearches module 
module.exports = SavedSearches;

