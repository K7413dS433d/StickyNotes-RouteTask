import { User } from "./../DB/models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!authorization || !authorization.startsWith(process.env.JWT_PREFIX))
    return next(new Error("Invalid Token", { cause: 401 }));

  //check user existence
  let userExist = await User.findById(_id);
  if (!userExist) return next(new Error("User Not found", { cause: 404 }));

  req.user = userExist;
  return next();
};
