import bcrypt from "bcrypt";
import crypto from "crypto-js";
import jwt from "jsonwebtoken";
import { User } from "./../../DB/models/user.model.js";

export const signUp = async (req, res, next) => {
  const { email, password, phone, confirmPass } = req.body;
  //check confirm password
  if (confirmPass != password) {
    return next(
      new Error("Password and Confirm password should be the same", {
        cause: 400,
      })
    );
  }
  //hash password
  req.body.password = bcrypt.hashSync(
    String(password),
    +process.env.SALT_ROUND
  );

  //encrypt phone number
  req.body.phone = crypto.AES.encrypt(phone, process.env.SECRET_KEY).toString();

  //check existence
  const userExist = await User.findOne({ email });
  if (userExist) return next(new Error("Email already exists", { cause: 409 }));

  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json({ success: true, message: "User added successfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  //check user exist
  const userExist = await User.findOne({ email });
  //if exist check password
  let match = false;
  if (userExist)
    match = await bcrypt.compare(String(password), userExist.password);

  if (!userExist || !match)
    return next(new Error("invalid Email or password", { cause: 401 }));

  //generate token
  const token = jwt.sign(
    { email: userExist.email, _id: userExist._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "2h" }
  );

  return res
    .status(200)
    .json({ success: true, message: "Login successful", token });
};
