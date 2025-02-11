import { Schema, model } from 'mongoose'
import { isEmail } from 'validator'

enum DefaultProfileInfo {
  AVATAR = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  NAME = 'Жак-Ив Кусто',
  ABOUT = 'Исследователь'
}

export interface IUser {
  name?: string
  about?: string
  avatar?: string
  email: string
  password: string
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: DefaultProfileInfo.NAME
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: DefaultProfileInfo.ABOUT
  },
  avatar: {
    type: String,
    default: DefaultProfileInfo.AVATAR
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => isEmail(email),
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
})

userSchema.set('toJSON', {
  transform: (
    _,
    {
      _id,
      name,
      about,
      avatar,
      email,
      password
    }: IUser & { _id: Schema.Types.ObjectId }
  ) => ({
    _id: _id.toString(),
    name,
    about,
    avatar,
    email,
    password
  })
})

export default model<IUser>('User', userSchema)
