const database = require('./database');
const {DataTypes} = require('sequelize');
const groups = require('./groups');
const member = require('./members');

let commodity = database.define("commodity",{

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
    price:{
        type:DataTypes.STRING,
        allowNull:false
    },
    number:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    company:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Description:{
        type:DataTypes.STRING,
        allowNull:false
    }

})


commodity.belongsTo(groups)
groups.hasMany(commodity)


database.sync().then(() => {
    console.log('commodity table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });   


module.exports= commodity