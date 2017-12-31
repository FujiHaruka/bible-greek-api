const {join} = require('path')
const {
  BIBLE_GREEK_API_ENV_PATH
} = process.env

let defaultEnv = {
  SQLITE_DATABASE: 'bible_greek_api',
  SQLITE_USER: 'user',
  SQLITE_PASSWORD: 'password',
  SQLITE_PATH: join(__dirname, 'var/database.sqlite'),
  APP_PORT: 3006,
  URL_PREFIX: '' // for example '/api'
}

module.exports = BIBLE_GREEK_API_ENV_PATH ? require(BIBLE_GREEK_API_ENV_PATH) : defaultEnv
