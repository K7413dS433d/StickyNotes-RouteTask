import connectDB from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import noteRouter from "./modules/note/note.controller.js";
const bootStrap = async (app, express) => {
  //connection
  await connectDB();

  //body parser
  app.use(express.json());

  // authentication route
  app.use("/users", authRouter);

  //user route
  app.use("/users", userRouter);

  // note route
  app.use("/notes", noteRouter);

  //not found route
  app.all("*", (req, res) =>
    res.status(500).json({ success: false, message: "not found api" })
  );

  //global error handling
  app.use((error, req, res, next) => {
    const status = error.cause || 500;
    res
      .status(status)
      .json({ success: false, message: error.message, stack: error.stack });
  });
};

export default bootStrap;
