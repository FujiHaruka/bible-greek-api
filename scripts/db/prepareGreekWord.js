const strongsGreekDict = require('../../ext/strongs/greek/strongs-greek-dictionary')
if (!strongsGreekDict) {
  throw new Error('Incorrect import strongs-greek-dictionary')
}
const R = require('ramda')
const indexById = R.indexBy(R.prop('id'))
const greekJaArray = require('../../assets/strong_greek_ja')
const greekJa = indexById(greekJaArray)
const {GreekWord} = require('../../lib/models')

async function prepareGreekWord ({force = false}) {
  if (force) {
    await GreekWord.sync()
    await GreekWord.drop()
  }
  await GreekWord.sync()

  const words = Object.keys(strongsGreekDict)
    .map((id) => {
      const {lemma, strongs_def: strongs, kjv_def: kjv} = strongsGreekDict[id]
      return {
        id,
        lemma,
        def: (strongs || kjv).trim(),
        ja: greekJa[id].ja
      }
    })
  try {
    await GreekWord.bulkCreate(words)
  } catch (e) {
    // エラーをそのまま表示すると SQL 文が長くて大変なことになるため
    console.error(e.message)
  }
}

if (!module.parent) {
  prepareGreekWord({force: true}).catch(console.error)
}

module.exports = prepareGreekWord
