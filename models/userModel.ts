import mongoose from 'mongoose';
import { texts } from '../const/texts';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as val from 'validator';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema<IUSer>(
  {
    username: {
      type: String,
      required: [true, texts.forms.errors.username.ENTER_USERNAME],
    },

    email: {
      type: String,
      unique: true,
      required: [true, texts.forms.errors.email.ENTER_EMAIL],
      lowercase: true,
      validate: [val.default.isEmail, texts.forms.errors.email.INVALID_EMAIL],
    },

    password: {
      type: String,
      required: [true, texts.forms.errors.password.ENTER_PASSWORD],
      minlength: [6, texts.forms.errors.password.PASSWORD_LENGTH],
    },
  },

  {
    timestamps: true,
  }
);

// fire function after doc saved to db
userSchema.post('save', function (doc, next) {
  console.log('new user is created and saved', doc);
  next();
});

// fire function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default userSchema;
