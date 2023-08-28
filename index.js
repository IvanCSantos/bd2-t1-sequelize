const { test } = require('node:test');
const prompt = require('prompt-sync')()
const { Sequelize, DataTypes } = require('sequelize');
const MYSQL_IP="localhost";
const MYSQL_LOGIN="root";
const MYSQL_PASSWORD="123456";
const DATABASE = "sakila";
const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD, {
    host: MYSQL_IP, 
    dialect: "mysql"
});

/* sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 }); */

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
    last_update: {type: DataTypes.DATE}
}, {tableName: 'film', timestamps: false});

const FilmActor = sequelize.define('FilmActor', {
    actor_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    film_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
}, {tableName: 'film_actor', timestamps: false});

const Actor = sequelize.define('Actor', {
    actor_id: {type:  DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    first_name: {type: DataTypes.STRING, allowNull: false},
    last_name: {type: DataTypes.STRING, allowNull: false},
    last_update: {type: DataTypes.DATE}
}, {tableName: 'actor', timestamps: false});

const FilmCategory = sequelize.define('FilmCategory', {
    film_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    category_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
}, {tableName: 'film_category', timestamps: false});

const Category = sequelize.define('Category', {
    category_id: {type:  DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    last_update: {type: DataTypes.DATE}
}, {tableName: 'category', timestamps: false});


Film.belongsToMany(Actor, {through: FilmActor, foreignKey: 'film_id'});
Film.belongsToMany(Category, {through: FilmCategory, foreignKey: 'film_id'});
Actor.belongsToMany(Film, {through: FilmActor, foreignKey: 'actor_id'});
Category.belongsToMany(Film, {through: FilmCategory, foreignKey: 'category_id'});

// Returns all films
async function getAllFilms() {
    try {
        let films = await Film.findAll()
        console.log(films);
    } catch (error) {
        console.error("Erro: ", error)
    }
}
//getAllFilms()

// Return a film by specifying its id
// Test SQL Queries:
/* use sakila;
select * from film where film_id = 1;
select * from film_actor where film_id = 1;

select f.film_id, f.title, f.description,
		a.actor_id, a.first_name, a.last_name
		FROM film as f
		LEFT JOIN film_actor as fa ON fa.film_id = f.film_id
		LEFT JOIN actor as a ON a.actor_id = fa.actor_id
		WHERE f.film_id = 1
		
SELECT `Actor`.`actor_id`, `Actor`.`first_name`, `Actor`.`last_name`, `Actor`.`last_update`,
`FilmActor`.`actor_id` AS `FilmActor.actor_id`, `FilmActor`.`film_id` AS `FilmActor.film_id` 
FROM `actor` AS `Actor` 
INNER JOIN `film_actor` AS `FilmActor` ON `Actor`.`actor_id` = `FilmActor`.`actor_id` 
AND `FilmActor`.`film_id` = 1; 

SELECT `Category`.`category_id`, `Category`.`name`, `Category`.`last_update`, 
`FilmCategory`.`film_id` AS `FilmCategory.film_id`, `FilmCategory`.`category_id` AS `FilmCategory.category_id` 
FROM `category` AS `Category` 
INNER JOIN `film_category` AS `FilmCategory` ON `Category`.`category_id` = `FilmCategory`.`category_id` 
AND `FilmCategory`.`film_id` = 1;*/
async function getFilmById(id) {
    try {
        let films = await Film.findByPk(id)
        let categories = await films.getCategories()
        let actors = await films.getActors()
        console.log(films, categories, actors);
    } catch (error) {
        console.error("Erro: ", error)
    }
}
//getFilmById(1)


// Returns all categories
async function getAllCategories() {
    try {
        let categories = await Category.findAll()
        console.log(categories)
    } catch (error) {
        console.error("Erro: ", error)
    }
}
//getAllCategories() 

// Returns a category by specifying its id
async function getCategoryById(id) {
    try {
        let categories = await Category.findByPk(id)
        let categoryFilms = await categories.getFilms()
        console.log(categories, categoryFilms)
    } catch (error) {
        console.error("Erro: ", error)
    }
}
//getCategoryById(1)

// Returns all actors
async function getAllActors() {
    try {
        let actors = await Actor.findAll()
        console.log(actors)
    } catch (error) {
        console.error("Erro: ", error)
    }
}
//getAllActors()

// Returns an actor by specifying its id
async function getActorById(id) {
    try {
        let actor = await Actor.findByPk(id)
        let actorFilms = await actor.getFilms();
        console.log(actor, actorFilms)
    } catch (error) {
        console.error("Erro: ", error)
    }
}
//getActorById(1)

const displayMenuOptions = function() {
    console.log("*** CONSULTA ***")
    console.log("1. Listar todos os filmes")
    console.log("2. Consultar um filme através de seu id")
    console.log("3. Listar todas as categorias")
    console.log("4. Consultar uma categoria através de seu id")
    console.log("5. Listar todos os atores")
    console.log("6. Consultar um ator através de seu id")
    console.log("7. Sair")
    console.log("")
}

async function menu() {
    let option = 0
    while(option !== 7){
        displayMenuOptions()
        option = parseInt(prompt("Selectione uma opção do menu: "))
        switch(option) {
            case 1:
                await getAllFilms()
                break
            case 2:
                promptId = parseInt(prompt("Qual ID deseja consultar? "))
                await getFilmById(promptId)
                break
            case 3:
                await getAllCategories()
                break
            case 4:
                promptId = parseInt(prompt("Qual ID deseja consultar? "))
                await getCategoryById(promptId)
                break
            case 5:
                await getAllActors()
                break
            case 6:
                promptId = parseInt(prompt("Qual ID deseja consultar? "))
                await getActorById(promptId)
                break
            case 7:
                console.log(typeof(option),": ", option)
            default:
                console.log(`Opção inválida ${option}!`)
        }
    }
}

menu()