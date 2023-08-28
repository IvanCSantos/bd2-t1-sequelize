const { test } = require('node:test');
const { Sequelize, DataTypes } = require('sequelize');
const MYSQL_IP="localhost";
const MYSQL_LOGIN="root";
const MYSQL_PASSWORD="123456";
const DATABASE = "sakila";
const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD, {
    host: MYSQL_IP, 
    dialect: "mysql"
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });


const Film = sequelize.define('Film', {
    film_id: {type:  DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    release_year: {type: DataTypes.INTEGER},
    //language_id: {type: DataTypes.STRING, allowNull: false},
    //original_language_id: {type: DataTypes.STRING, allowNull: false},
    rental_duration: {type: DataTypes.INTEGER, allowNull: false},
    rental_rate: {type: DataTypes.INTEGER, allowNull: false},
    length: {type: DataTypes.INTEGER},
    replacement_cost: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.ENUM('G','PG','PG-13','R','NC-17')},
    special_features: {type: DataTypes.STRING},
}, {tableName: 'film', timestamps: false});

const FilmActor = sequelize.define('FilmActor', {
    actor_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    film_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
}, {tableName: 'film_actor', timestamps: false});

const Actor = sequelize.define('Actor', {
    actor_id: {type:  DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    first_name: {type: DataTypes.STRING, allowNull: false},
    last_name: {type: DataTypes.STRING, allowNull: false},
}, {tableName: 'actor', timestamps: false});

const FilmCategory = sequelize.define('FilmCategory', {
    film_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    category_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
}, {tableName: 'film_actor', timestamps: false});

const Category = sequelize.define('Category', {
    category_id: {type:  DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
}, {tableName: 'category', timestamps: false});


Film.belongsToMany(Actor, {through: FilmActor, foreignKey: 'film_id'});
Film.belongsToMany(Category, {through: FilmCategory, foreignKey: 'film_id'});
Actor.belongsToMany(Film, {through: FilmActor, foreignKey: 'actor_id'});
Category.belongsToMany(Film, {through: FilmCategory, foreignKey: 'category_id'});