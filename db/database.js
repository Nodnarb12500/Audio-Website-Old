const knex = require("./knex");

/*
 * replace tableName with the name of the table you want to modify
 * and if you want change the names of the functions to reflect that change to
 */

/* Modifying the database */

function createRow(data) {
  return knex("tableName").insert(data);
}

function modifyRow(id, data) {
  return knex("tableName").where("id", id).update(data);
}

function deleteRow(id) {
  return knex("tableName").where("id", id).del();
}

/* Searching the database */

function getRow(id) {
  return knex("tableName").where("id", id);
}

module.exports = {
  createRow,
  modifyRow,
  deleteRow,
  getRow
}
