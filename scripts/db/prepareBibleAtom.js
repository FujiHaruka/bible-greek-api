const {BibleAtom} = require('../../lib/models')
const {join} = require('path')
const fs = require('fs')
const R = require('ramda')
const {promisify} = require('util')
const readFileAsync = promisify(fs.readFile)
const readdirAsync = promisify(fs.readdir)
const parseXml = require('../../lib/helpers/parseXml')
const assert = require('assert')

const BIBLE_BOOK_PATH = join(__dirname, '../../ext/greek-new-testament/syntax-trees/nestle1904-lowfat/xml')

// 再帰的に w ノードを取得する
function filterWNodes (xml) {
  if (Array.isArray(xml)) {
    return R.pipe(
      R.map(filterWNodes),
      R.flatten
    )(xml)
  }
  return R.flatten([
    'w' in xml ? xml.w : [],
    'wg' in xml ? filterWNodes(xml.wg) : []
  ])
}

// const logAsJson = (o) => console.log(JSON.stringify(o, null, '  '))

async function prepareBibleAtomModel ({force = false}) {
  if (force) {
    await BibleAtom.sync()
    await BibleAtom.drop()
  }
  await BibleAtom.sync()

  const files = (await readdirAsync(BIBLE_BOOK_PATH))
    .filter((name) => ['0', '1', '2'].includes(name[0]))

  for (const file of files) {
    console.log(file)
    const xmlData = await readFileAsync(join(BIBLE_BOOK_PATH, file))
    const xml = await parseXml(xmlData)
    const wNodes = filterWNodes(xml.book.sentence)

    const atoms = wNodes.map((wNode) => {
      let [osisId, indexStr] = wNode.osisId.split('!')
      assert.ok(osisId)
      osisId = osisId.toLowerCase()
      const index = Number(indexStr) - 1
      assert.ok(index >= 0)
      const strongNumber = Number(wNode.strong)
      assert.ok(strongNumber)
      const wordId = 'G' + strongNumber
      const word = wNode._
      return {
        osisId,
        index,
        strongNumber,
        wordId,
        word
      }
    })
    console.log(`Create ${atoms.length} words`)

    await BibleAtom.bulkCreate(atoms)
  }
}

if (!module.parent) {
  prepareBibleAtomModel({force: true}).catch(console.error)
}

module.exports = prepareBibleAtomModel
