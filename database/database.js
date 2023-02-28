const {Sequelize} = require("sequelize");

const database = new Sequelize("shop_db", "root", "", {
    dialect: "mysql",
    host: "localhost",
});



database.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });





 

 module.exports = database;