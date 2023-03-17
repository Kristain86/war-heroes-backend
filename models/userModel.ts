import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema<IUSer>({
  username: String,
  googleId: String,
});

export default userSchema;
