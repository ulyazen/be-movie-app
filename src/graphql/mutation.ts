import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLID,
} from 'graphql'

import { UserType, TokenType, MovieType } from './type'
import { signup, login } from './resolver/user-resolver'
import { addMovie, updateMovie, deleteMovie } from './resolver/movie-resolver'

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: signup,
    },
    login: {
      type: TokenType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: login,
    },
    addMovie: {
      type: MovieType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        image: { type: GraphQLString },
        imageTitle: { type: GraphQLString },
        imageSmall: { type: GraphQLString },
        trailer: { type: GraphQLString },
        video: { type: GraphQLString },
        year: { type: GraphQLString },
        limit: { type: GraphQLInt },
        genre: { type: GraphQLString },
        isSeries: { type: GraphQLBoolean },
      },
      resolve: addMovie,
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        image: { type: GraphQLString },
        imageTitle: { type: GraphQLString },
        imageSmall: { type: GraphQLString },
        trailer: { type: GraphQLString },
        video: { type: GraphQLString },
        year: { type: GraphQLString },
        limit: { type: GraphQLInt },
        genre: { type: GraphQLString },
        isSeries: { type: GraphQLBoolean },
      },
      resolve: updateMovie,
    },
    deleteMovie: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: deleteMovie,
    },
  },
})
