import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export interface IMovie extends mongoose.Document {
  title: String
  description: String
  image: String
  imageTitle: String
  imageSmall: String
  trailer: String
  video: String
  year: String
  limit: Number
  genre: String
  isSeries: Boolean
}

const MovieSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },

    description: {
      type: String,
    },
    image: {
      type: String,
    },
    imageTitle: {
      type: String,
    },
    imageSmall: {
      type: String,
    },
    trailer: {
      type: String,
    },
    video: {
      type: String,
    },
    year: {
      type: String,
    },
    limit: {
      type: Number,
    },
    genre: {
      type: String,
    },
    isSeries: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model<IMovie>('Movie', MovieSchema)
