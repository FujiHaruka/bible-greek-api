/**
 * Translate Strong's hebrew definitions
 */
const {join} = require('path')
const fs = require('fs')
const {promisify} = require('util')
const asleep = require('asleep')
const writeFileAsync = promisify(fs.writeFile)
const prop = name => obj => obj[name]
const googleTranslate = require('google-translate')(process.env.GOOGLE_TRANSLATE_API_KEY)
const translateToJa = (strings) => new Promise((resolve, reject) => {
  // resolve(strings.map(() => ({translatedText: ''})))
  googleTranslate.translate(strings, 'en', 'ja', (err, translations) => err ? reject(err) : resolve(translations))
})
const translateToJaLong = async (strings) => {
  let charCount = 0
  const limit = 1000
  const count = Math.ceil(strings.length / limit)
  let all = []
  for (let i = 0; i < count; i++) {
    const offset = i * limit
    const slice = strings.slice(offset, offset + limit)

    charCount += slice.reduce((count, str) => count + str.length, 0)
    console.log(`Waiting 2 min...`)
    await asleep(120 * 1000)

    console.log(i, slice.length, charCount)
    const translations = await translateToJa(slice)
    all = all.concat(translations)
  }
  return all
}
const {GreekWord} = require('../lib/models')

const STRONG_GREEK_JA_PATH = join(__dirname, '../assets/strong_greek_ja.json')

async function translateStrongs (destPath = STRONG_GREEK_JA_PATH) {
  const greekWords = await GreekWord.findAll()
  if (greekWords.length === 0) {
    console.error(`GreekWord not set`)
    return
  }
  const wordIds = greekWords.map(prop('id'))
  const enDefs = greekWords.map(prop('def'))
  console.log(`length: ${enDefs.length}`)
  let translations
  try {
    translations = await translateToJaLong(enDefs)
  } catch (e) {
    console.error(e.body)
    return
  }
  const jaDefs = translations
    .map(prop('translatedText'))
    .map((ja, i) => ({
      id: wordIds[i],
      ja,
      en: enDefs[i]
    }))
  await writeFileAsync(destPath, JSON.stringify(jaDefs, null, '  '))
}

if (!module.parent) {
  translateStrongs().catch(console.error)
}
