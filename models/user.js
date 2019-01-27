var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

const sequelize = new Sequelize('cpt_DB', 'root', '', {
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

// set up User Table in mysql
var User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// encrypts password
User.beforeCreate((user, options) => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
});

// compares provided password to encrypted password in db
User.prototype.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

// create all defined tables in the database
sequelize.sync()
    .then(() => console.log('User tables has been successfully created if one does not exist'))
    .catch(error => console.log('This error occured', error));

// export User module 
module.exports = User;