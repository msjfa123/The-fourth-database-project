const database = require('./database');
const {DataTypes} = require('sequelize');

let groups = database.define("groups",{

    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    groups:{
        type:DataTypes.STRING,
        allowNull:false
    },
    details:{
        type:DataTypes.STRING,
        allowNull:false
    }
})


database.sync().then(() => {
    console.log('groups table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });   


module.exports= groups