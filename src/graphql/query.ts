import * as graphql from 'graphql'

import User from '@local/models/user-model'
import Movie from '@local/models/movie-model'
import { UserType, MovieType } from './type'

import { validateToken } from '@local/middlewares/validate-token'

const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLString } = graphql

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        const user = validateToken(authorization)

        return User.findById(user.id)
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        validateToken(authorization)
        return User.find()
      },
    },
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLString } },
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        validateToken(authorization)

        return Movie.findById(args.id)
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        validateToken(authorization)
        return Movie.find()
      },
    },
  },
})
