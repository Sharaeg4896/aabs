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


// set up Scans Table in mysql
var Scans = sequelize.define('scans',{
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        cpt: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        }

});

// create all defined tables in the database
sequelize.sync()
    .then(() => {
        return Scans.bulkCreate(
        [{
            type: "MRI",
            cpt: 70551,
            description: "MRI Brain",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 72141,
            description: "MRI Cervial Spine",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 72146,
            description: "MRI Thoracic Spine",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 72148,
            description: "MRI Lumbar Spine",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 74181,
            description: "MRI Abdomen",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 77059,
            description: "MRI Breast",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 71550,
            description: "MRI Chest",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 73718,
            description: "MRI Lower Extremity",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 73720,
            description: "MRI Lower Extremity Joint",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 73218,
            description: "MRI Upper Extremity",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 73221,
            description: "MRI Upper Extremity Joint",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 74183,
            description: "MRI Enterography",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 70540,
            description: "MRI Face",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 72195,
            description: "MRI Pelvis",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "MRI",
            cpt: 70336,
            description: "MRI TMJ",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 74177,  
            description: "CT Abd & Pelvis",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 74160,
            description: "CT Abd",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 71260,
            description: "CT Chest",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 73701,
            description: "CT Lower Extremity",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 73201,
            description: "CT Upper Extremity",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 70450,
            description: "CT Head",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 70487,
            description: "CT Maxial/Facial",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 70490,
            description: "CT Neck",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 70480,
            description: "CT Orbit",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 72192,
            description: "CT Pelvis",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 70486,
            description: "CT Sinus Complete",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 76380,
            description: "CT Sinus Limited",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 72125,
            description: "CT Cervical Spine",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 72131,
            description: "CT Lumbar Sine",
            createdAt: null,
            updatedAt: null
        },
        {
            type: "CT",
            cpt: 72128,
            description: "CT Thoracic Spine",
            createdAt: null,
            updatedAt: null
        }]);

        
    })
        .catch(error => console.log('This error occured', error));


// export Scans module 
module.exports = Scans;

