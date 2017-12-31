const debug = require('debug')('bible-greek-api:db')
const Sequelize = require('sequelize')
const {SQLITE_DATABASE, SQLITE_USER, SQLITE_PASSWORD, SQLITE_PATH} = require('../../env')

const sequelize = new Sequelize(SQLITE_DATABASE, SQLITE_USER, SQLITE_PASSWORD, {
  dialect: 'sqlite',
  storage: SQLITE_PATH,
  logging: debug
})

module.exports = {
  GreekWord: sequelize.define(...require('./GreekWordModel')),
  BibleAtom: sequelize.define(...require('./BibleAtomModel'))
}
