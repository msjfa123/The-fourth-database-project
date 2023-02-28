const database = require('./database');
const {DataTypes} = require('sequelize');
const member = require('./members');

let inventory = database.define("inventory",{
    
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    cash:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

inventory.belongsTo(member)
member.hasOne(inventory)

database.sync().then(() => {
    console.log('inventory table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });   


 module.exports = inventory 