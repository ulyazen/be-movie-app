import { GraphQLError } from 'graphql'

import Movie, { IMovie } from '@local/models/movie-model'
import { movieRules } from '@local/rules/movie-rules'
import { validateToken } from '@local/middlewares/validate-token'

export async function addMovie(
  parent: any,
  args: any,
  { headers }: any
): Promise<IMovie | Error> {
  try {
    const { authorization } = headers
    validateToken(authorization)
    await movieRules.validate(args)

    const movie = new Movie({
      title: args.title,
      description: args.description,
      image: args.image,
      imageTitle: args.imageTitle,
      imageSmall: args.imageSmall,
      trailer: args.trailer,
      video: args.video,
      year: args.year,
      limit: args.limit,
      genre: args.genre,
      isSeries: args.isSeries,
    })

    return await Movie.create(movie)
  } catch (err: any) {
    return new GraphQLError(err)
  }
}

export async function updateMovie(
  parent: any,
  args: any,
  { headers }: any
): Promise<IMovie | Error | null> {
  try {
    const { authorization } = headers
    validateToken(authorization)
    const movie = await Movie.findById({ _id: args.id })

    if (!movie) {
      throw new Error('movie does not exists')
    }

    await Movie.findOneAndUpdate(
      { _id: args.id },
      {
        title: args.title || movie.title,
        description: args.description || movie.description,
        image: args.image || movie.image,
        imageTitle: args.imageTitle || movie.imageTitle,
        imageSmall: args.imageSmall || movie.imageSmall,
        trailer: args.trailer || movie.trailer,
        video: args.video || movie.video,
        year: args.year || movie.year,
        limit: args.limit || movie.limit,
        genre: args.genre || movie.genre,
        isSeries: args.isSeries || movie.isSeries,
      }
    )

    const movieUpdate: IMovie | null = await Movie.findById({
      _id: args.id,
    })

    return movieUpdate
  } catch (err: any) {
    return new GraphQLError(err)
  }
}

export async function deleteMovie(
  parent: any,
  args: any,
  { headers }: any
): Promise<IMovie | Error | null | true> {
  try {
    const { authorization } = headers
    validateToken(authorization)
    const movie = await Movie.findByIdAndDelete({ _id: args.id })

    if (!movie) {
      throw new Error('movie does not exists')
    }

    return true
  } catch (err: any) {
    return new GraphQLError(err)
  }
}
