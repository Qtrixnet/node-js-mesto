import { Schema, model, Model, Document } from 'mongoose'
import { isEmail } from 'validator'
import bcrypt from 'bcrypt'
import { AuthError } from '../errors/auth-error'

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

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>({
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

userSchema.static(
  'findUserByCredentials',
  async function findUserByCredentials(email: string, password: string) {
    const user = await this.findOne({
      email
    }).select('+password')

    if (!user) throw new AuthError('Неправильные почта или пароль')

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) throw new AuthError('Неправильные почта или пароль')

    return user
  }
)

export const User = model<IUser, UserModel>('User', userSchema)
