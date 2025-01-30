import { Schema, model } from 'mongoose'

export interface IUser {
  name: string
  about: string
  avatar: string
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
})

userSchema.set('toJSON', {
  transform: (_, ret) => ({
    _id: ret._id.toString(),
    name: ret.name,
    about: ret.about,
    avatar: ret.avatar
  })
})

export default model<IUser>('User', userSchema)
