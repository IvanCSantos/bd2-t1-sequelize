const { test } = require('node:test');
const fs = require('fs');
const csv = require('csv-parser');
const prompt = require('prompt-sync')({sigint: true})
const { Sequelize, DataTypes } = require('sequelize');
const MYSQL_IP="68.64.164.119";
const MYSQL_LOGIN="admin";
const MYSQL_PASSWORD="F8aZkomi";
const DATABASE = "sakila";
const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD, {
    host: MYSQL_IP, 
    port: 18761,
    dialect: "mysql",
    pool: {
        max: 20,
        min: 0,
        acquire: 6000000,
        idle: 10000
      }
});

// The Sakila database is available at
// https://dev.mysql.com/doc/sakila/en/sakila-installation.html

//sequelize.authenticate().then(() => {
 //   console.log('Connection has been established successfully.');
 //}).catch((error) => {
 //   console.log('Unable to connect to the database: ', error);
 //});

 // Sequelize documentation: https://sequelize.org/docs/v6/core-concepts/model-basics/

const Film = sequelize.define('Film', {
    film_id: {type:  DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    release_year: {type: DataTypes.STRING},
    language_id: {type: DataTypes.INTEGER, allowNull: false},
    original_language_id: {type: DataTypes.INTEGER, allowNull: false},
    rental_duration: {type: DataTypes.INTEGER, allowNull: false},
    rental_rate: {type: DataTypes.DOUBLE, allowNull: false},
    length: {type: DataTypes.INTEGER},
    replacement_cost: {type: DataTypes.DOUBLE, allowNull: false},
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

const User = sequelize.define('User', {
    // Colunas da tabela
    index: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      //autoIncrement: true,
    },
    userId: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    sex: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      //allowNull: false,
      //unique: true,
    },
    phone: {
      type: Sequelize.STRING,
    },
    dateOfBirth: {
      type: Sequelize.STRING,
    },
    jobTitle: {
      type: Sequelize.STRING,
    },
  });

// Returns all films
async function getAllFilms() {
    try {
        let films = await Film.findAll({include: [Category, Actor]})
        console.log(JSON.stringify(films, null, 2) + "\n\n");

    } catch (error) {
        console.error("Erro: ", error)
    }
}

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
        let films = await Film.findByPk(id, {include: [Category, Actor]})

        console.log(JSON.stringify(films, null, 2)) 
    } catch (error) {
        console.error("Erro: ", error)
    }
}

// Returns all categories
async function getAllCategories() {
    try {
        let categories = await Category.findAll({include: Film})
        console.log(JSON.stringify(categories, null, 2) + "\n\n");
    } catch (error) {
        console.error("Erro: ", error)
    }
}

// Returns a category by specifying its id
async function getCategoryById(id) {
    try {
        let categories = await Category.findByPk(id, {include: Film})
        console.log(JSON.stringify(categories, null, 2)) 
    } catch (error) {
        console.error("Erro: ", error)
    }
}




// Returns all actors
async function getAllActors() {
    try {
        let actors = await Actor.findAll({include: Film})
        console.log(JSON.stringify(actors, null, 2) + "\n\n");
    } catch (error) {
        console.error("Erro: ", error)
    }
}

// Returns an actor by specifying its id
async function getActorById(id) {
    try {
        let actor = await Actor.findByPk(id, {include: Film})
        console.log(JSON.stringify(actor, null, 2)) 
    } catch (error) {
        console.error("Erro: ", error)
    }
}

const displayMenuOptions = function() {
    console.log("*** CONSULTA ***")
    console.log("1. Listar todos os filmes")
    console.log("2. Consultar um filme através de seu id")
    console.log("3. Listar todas as categorias")
    console.log("4. Consultar uma categoria através de seu id")
    console.log("5. Listar todos os atores")
    console.log("6. Consultar um ator através de seu id")
    console.log("")
    console.log("*** CRIAR ***")
    console.log("7. Adiciona um novo filme")
    console.log("8. Adiciona um novo ator")
    console.log("9. Adiciona uma nova categoria")
    console.log("")
    console.log("*** Trabalho 2 ***")
    console.log("10. Criar Tabela User")
    console.log("11. Insere Users do arquivo CSV")
    console.log("12. Mostra todos os Users")
    console.log("13. Busca User por nome")

    console.log("20. Sair")
    console.log("")
}

function promptIdToQuery(){
    return parseInt(prompt("Qual ID deseja consultar? "))
}

async function addNewActor() {
    console.log("Adicionando novo ator.")
    let firstName = prompt("Informe o primeiro nome do ator: ")
    let lastName = prompt("Informe o último nome do ator: ")

    const createdActor = await Actor.create({
        first_name: firstName, 
        last_name: lastName,
        }
    )

    let createRelationships = prompt("Deseja criar associação de filme (y/n)? ")
    if(createRelationships === "y"){
        let title = prompt("Informe o título do filme: ")
        let description = prompt("Informe a descrição do filme: ")
        let release_year = prompt("Informe o ano de lançamento do filme: ")
        let rental_duration = prompt("Informe o tempo de locação do filme: ")
        let rental_rate = prompt("Informe a taxa de locação do filme: ")
        let length = prompt("Informe o comprimento do filme: ")
        let language_id = 1
        let original_language_id = 1
        let replacement_cost = prompt("Informe o custo de reposição do filme: ")
        let rating = prompt("Informe o rating do filme: ('G','PG','PG-13','R','NC-17')")
        let special_features = prompt("Informe os recursos especiais do filme: ")
        let category = prompt("Informe a categoria do filme: ")

        const createdFilm = await Film.create({
            title,
            description,
            release_year,
            rental_duration,
            rental_rate,
            length,
            language_id,
            original_language_id,
            replacement_cost,
            rating,
            special_features
        })
    
        const createdCategory = await Category.create({
            name: category
        })
    
        await FilmCategory.create({
            film_id: createdFilm.film_id,
            category_id: createdCategory.category_id
        })
    }
}

async function addNewFilm() {
    console.log("Adicionando novo filme.")
    let title = prompt("Informe o título do filme: ")
    let description = prompt("Informe a descrição do filme: ")
    let release_year = prompt("Informe o ano de lançamento do filme: ")
    let rental_duration = prompt("Informe o tempo de locação do filme: ")
    let rental_rate = prompt("Informe a taxa de locação do filme: ")
    let length = prompt("Informe o comprimento do filme: ")
    let language_id = 1
    let original_language_id = 1
    let replacement_cost = prompt("Informe o custo de reposição do filme: ")
    let rating = prompt("Informe o rating do filme: ('G','PG','PG-13','R','NC-17')")
    let special_features = prompt("Informe os recursos especiais do filme: ")
    let category = prompt("Informe a categoria do filme: ")
    
    
    const createdFilm = await Film.create({
        title,
        description,
        release_year,
        rental_duration,
        rental_rate,
        length,
        language_id,
        original_language_id,
        replacement_cost,
        rating,
        special_features
    })

    const createdCategory = await Category.create({
        name: category
    })

    await FilmCategory.create({
        film_id: createdFilm.film_id,
        category_id: createdCategory.category_id
    })

    console.log("Novo filme criado: " + createdFilm.film_id + " " + createdFilm.title + " " + createdFilm.description)
    console.log("")
}

async function addNewCategory() {
    console.log("Adicionando uma nova categoria.")
    let name = prompt("Informe o nome da categoria: ")
    let newCategory = {name: name}
    const createdCategory = await Category.create(newCategory)
    console.log("Nova categoria criada: " + createdCategory.category_id + " " + createdCategory.name)
    console.log("")
}

async function menu() {
    let option = 0
    while(option !== 20){
        displayMenuOptions()
        option = parseInt(prompt("Selectione uma opção do menu: "))
        switch(option) {
            case 1:
                await getAllFilms()
                break
            case 2:
                promptId = promptIdToQuery()
                await getFilmById(promptId)
                break
            case 3:
                await getAllCategories()
                break
            case 4:
                promptId = promptIdToQuery()
                await getCategoryById(promptId)
                break
            case 5:
                await getAllActors()
                break
            case 6:
                promptId = promptIdToQuery()
                await getActorById(promptId)
                break
            case 7:
                await addNewFilm()
                break
            case 8:
                await addNewActor()
                break
            case 9:
                await addNewCategory()
                break
            case 10:
                await User.sync()
                break
            case 11:
                await loadUserCsv()
                break
            case 12:
                await getAllUsers()
                break
            case 13:
                nome = prompt("Qual nome deseja consultar? ")
                await getAllUsersLikeName(nome)
                break
            case 20:
                console.log(typeof(option),": ", option)
            default:
                console.log(`Opção inválida ${option}!`)
        }
    }
}

//Trabalho 2

// Returns all Users
async function getAllUsers() {
    try {
        let users = await User.findAll({})
        console.log(JSON.stringify(users, null, 2) + "\n\n");

    } catch (error) {
        console.error("Erro: ", error)
    }
}

// Returns all Users with name
async function getAllUsersLikeName(nome) {
    try {
        let users = await User.findAll({
            where: {
              firstName: {
                [Sequelize.Op.like]: `%${nome}%`, // Usando o operador $like
              },
            },
          })
        console.log(JSON.stringify(users, null, 2) + "\n\n");

    } catch (error) {
        console.error("Erro: ", error)
    }
}

//carrega todos os usuarios
async function loadUserCsv() {
    console.log('CSV.');

    await User.destroy({
        where: {},
        truncate: true,
      })
        .then((rowsDeleted) => {
          console.log(`Foram deletadas as linhas da tabela User.`);
        })
        .catch((error) => {
          console.error('Erro ao deletar linhas da tabela User:', error);
        });
        
    //await fs.createReadStream('teste.csv')
    fs.createReadStream('people-100000.csv')
    .pipe(csv())
    .on('data',   async (row) => {

      // Inserir os dados na tabela User
      //Index,User Id,First Name,Last Name,Sex,Email,Phone,Date of birth,Job Title
      await Object.keys(row).forEach((key) => {
          row[key] = row[key].replace(/\r?\n$/, '');
          
        });
        //console.log(row)
        //console.log(row['﻿Index'])
       // console.log(row['User Id'])
       // console.log(row['First Name'])
        //console.log(row['Last Name'])
        //console.log(row['Sex'])
        //console.log(row['Email'])
        //console.log(row['Phone'])
       // console.log(row['Date of birth'])
       // console.log(row['Job Title'])
        await User.create({
            index: row['﻿Index'],
            userId: row['User Id'],
            firstName: row['First Name'],
            lastName: row['Last Name'],
            sex: row['Sex'],
            email: row['Email'],
            phone: row['Phone'],
            dateOfBirth: row['Date of birth'],
            jobTitle: row['Job Title'],
          })
            .then((user) => {
              //console.log(`Usuário inserido: ${user.userId}`);
            })
            .catch((error) => {
                console.error('Erro ao inserir usuário:', error);
            });
            
        });
        
    }
    
    
    
menu();