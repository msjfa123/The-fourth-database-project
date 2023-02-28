const database = require('./database');
const {DataTypes} = require('sequelize');

let member = database.define("member",{
    
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
})



database.sync().then(() => {
    console.log('member table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });   


module.exports = member