import * as yup from 'yup'

import Movie from '@local/models/movie-model'
export const movieRules = yup.object().shape({
  title: yup
    .string()
    .required()
    .test('uniqueTitle', 'This title already exists', async (title) => {
      const user = await Movie.findOne({ title })
      return !user
    }),
})
