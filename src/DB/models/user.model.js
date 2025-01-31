import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, min: 18, max: 60 },
});

export const User = model("User", userSchema);
