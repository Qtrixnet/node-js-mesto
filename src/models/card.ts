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
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: []
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

cardSchema.set('toJSON', {
  transform: (
    _,
    { _id, name, link, owner, likes }: ICard & { _id: Schema.Types.ObjectId }
  ) => ({
    _id: _id.toString(),
    name,
    link,
    owner: owner.toString(),
    likes: likes.map((id: Schema.Types.ObjectId) => id.toString())
  })
})

export const Card = model<ICard>('Card', cardSchema)
