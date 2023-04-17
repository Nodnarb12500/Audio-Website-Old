const knex = require("./knex");

/*
 * replace tableName with the name of the table you want to modify
 * and if you want change the names of the functions to reflect that change to
 */

/* Modifying the database */

function createAudio(data) {
  return knex("audios").insert(data);
}

function modifyAudio(id, data) {
  return knex("audios").where("id", id).update(data);
}

function deleteAudio(id) {
  return knex("audios").where("id", id).del();
}

/* Searching the database */
function databaseSize() { 
  return knex("audios").count('*');
}

function getAudio(id) {
  return knex("audios").where("id", id);
}

function getTwentyFive(search, page) {
  let n = page * 25;
  if (search === "all") {
    return knex("audios").select('*').limit(25).offset(n);

  } else {
    return knex("audios")
      .whereLike("search", "\%" + search + "\%").limit(25).offset(n);

  }
}

module.exports = {
  createAudio,
  databaseSize,
  modifyAudio,
  deleteAudio,
  getAudio,
  getTwentyFive
}
