const R = require('ramda')
const {
  findVerse,
  findGreekDefinitions,
  findVersesUsingWord
} = require('./domain')

const Path = {
  GREEK_SENTENCE: '/greek_sentences/:book/:chapter/:verse',
  GREEK_SENTENCES_USING_WORD: '/greek_sentences/strong/:strongNumber',
  GREEK_WORD: '/greek_words/:strongNumber'
}

function route (router) {
  router.get(
    Path.GREEK_SENTENCE,
    async (ctx, next) => {
      const {book, chapter, verse} = ctx.params
      const osisId = `${book}.${chapter}.${verse}`
      const atoms = await findVerse(osisId)
      if (atoms.err) {
        ctx.body = atoms.err
        ctx.status = 400
        return
      }
      const wordIds = atoms.map(R.prop('wordId'))
      const defs = await findGreekDefinitions(wordIds)
      if (defs.err) {
        ctx.body = defs.err
        ctx.status = 400
        return
      }
      for (const atom of atoms) {
        atom.def = defs[atom.wordId]
      }
      ctx.body = atoms
      ctx.status = 200
    }
  )

  router.get(
    Path.GREEK_SENTENCES_USING_WORD,
    async (ctx, next) => {
      const {strongNumber} = ctx.params
      const wordId = 'G' + strongNumber
      const osisIds = await findVersesUsingWord(wordId)
      if (osisIds.err) {
        ctx.body = osisIds.err
        ctx.status = 400
        return
      }
      ctx.body = osisIds
      ctx.status = 200
    }
  )

  router.get(
    Path.GREEK_WORD,
    async (ctx, next) => {
      const {strongNumber} = ctx.params
      const wordId = 'G' + strongNumber
      const def = await findGreekDefinitions(wordId)
      if (def.err) {
        ctx.body = def.err
        ctx.status = 400
        return
      }
      ctx.body = def
      ctx.status = 200
    }
  )
}

module.exports = route
