import { Schema, model } from 'mongoose'

export interface ICard {
  name: string
  link: string
  owner: Schema.Types.ObjectId
  likes: Schema.Types.ObjectId[]
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

cardSchema.set('toJSON', {
  transform: (_, ret) => ({
    _id: ret._id.toString(),
    name: ret.name,
    link: ret.link,
    owner: ret.owner.toString(),
    likes: ret.likes.map((id: Schema.Types.ObjectId) => id.toString())
  })
})

export default model<ICard>('Card', cardSchema)
