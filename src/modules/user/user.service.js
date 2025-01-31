import crypto from "crypto-js";
import { User } from "../../DB/models/user.model.js";

export const updateUser = async (req, res, next) => {
  //get token
  const { email } = req.body;
  const { user } = req;

  //check email is exist or no
  const emailExist = await User.findOne({ email });

  if (emailExist) return next(new Error("Email already exist", { cause: 409 }));

  //check if password is sent do not update it
  if (req.body.password) req.body.password = undefined;
  //if phone is sent encrypt it
  if (req.body.phone)
    req.body.phone = crypto.AES.encrypt(req.body.phone, process.env.SECRET_KEY);

  //update the current document
  await user.updateOne(req.body);

  return res.status(200).json({ success: true, message: "User updated" });
};

export const deleteUser = async (req, res, next) => {
  const { user } = req;
  //permanent delete
  await User.deleteOne({ _id: user.id });
  res
    .status(200)
    .json({ success: false, message: "User Deleted successfully" });
};

export const getUserData = async (req, res, next) => {
  const { user } = req;

  const userData = await User.findOne({ _id: user.id });

  return res.status(200).json({ success: true, data: userData });
};
