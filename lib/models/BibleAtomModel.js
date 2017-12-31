const {STRING, INTEGER} = require('sequelize')

/**
 * Nestle 1904 によるギリシャ語新約聖書本文
 */
const BibleAtomModel = [
  'wlc',
  {
    // ex: "mat.1.1"
    osisId: {
      type: STRING,
      allowNull: false
    },
    // ex: "G121"
    wordId: {
      type: STRING,
      allowNull: true
    },
    strongNumber: {
      type: INTEGER,
      allowNull: true
    },
    // word index in the verse
    index: {
      type: INTEGER,
      allowNull: false
    },
    word: {
      type: STRING,
      allowNull: false
    }
  },
  {
    indexes: [{ unique: false, fields: ['osisId'] }],
    timestamps: false
  }
]

module.exports = BibleAtomModel
