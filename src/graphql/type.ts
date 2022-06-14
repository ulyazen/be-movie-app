import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql'

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  }),
})

export const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
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
  }),
})

export const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType },
  }),
})
