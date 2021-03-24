const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

require('dotenv').config();
const ADMIN_PW = process.env.ADMIN_PW;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

// create our User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// create fields/columns for User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    bootcamp: {
        type: DataTypes.STRING,
    },
    profile_pic: {
        type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4]
      }
    }
  },
  {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      async beforeCreate(newUserData) {
        if (newUserData.password === ADMIN_PW && newUserData.username === ADMIN_USERNAME) {
          newUserData.is_admin = true;
          if (ADMIN_USERNAME === 'gkps') newUserData.profile_pic = '/assets/images/kash.jpeg'
        } 
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },

      async beforeUpdate(updatedUserData) {
        if (updatedUserData.password === ADMIN_PW && updatedUserData.username === ADMIN_USERNAME) {
          updatedUserData.is_admin = true;
          if (ADMIN_USERNAME === 'gkps') newUserData.profile_pic = '/assets/images/kash.jpeg'
        }
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;
