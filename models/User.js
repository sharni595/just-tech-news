const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our User model
class User extends Model {}

//define table columns and configuration
User.init(
    {
        //TABLE COLUMN DEFINITIONS GO HERE
        //define an id column
        id: {
            //use special Sequelize DataTypes object
            type: DataTypes.INTEGER,
            //this is the equivalent of SQL/s not null option
            allowNull: false, 
            //instruct that this is primary key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values in this table
            unique: true,
            //if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //pass in our imported sequelize connection
        sequelize,
        //don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        //don't pluralize name of database table
        freezeTableName: true,
        //use underscored instead of camel-casing
        underscored: true,
        //make it so our model name stays lowercase in database
        modelName: 'user'
    }
);

module.exports = User;