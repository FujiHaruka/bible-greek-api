const {STRING} = require('sequelize')

/**
 * ギリシャ語辞書
 */
const GreekWordModel = [
  'greek_word',
  {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false
    },
    lemma: {
      type: STRING,
      allowNull: false
    },
    // strongs def
    def: {
      type: STRING,
      allowNull: false
    },
    ja: {
      type: STRING,
      allowNull: true
    }
  },
  {
    timestamps: false
  }
]

module.exports = GreekWordModel
