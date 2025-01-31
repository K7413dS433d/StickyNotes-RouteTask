import { Schema, model, Types } from "mongoose";
import { capitalize } from "../../utils/capitalize.js";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      validate: { validator: (value) => capitalize(value) },
    },
    content: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export const Note = new model("Note", noteSchema);
