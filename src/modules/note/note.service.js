import { Note } from "../../DB/models/note.model.js";

export const createNote = async (req, res, next) => {
  //get logged in user id
  const { _id } = req.user;
  const { title, content } = req.body;

  const note = new Note({ title, content, userId: _id });
  await note.save();

  res.status(201).json({ success: true, message: "Note Created" });
};

export const updateNote = async (req, res, next) => {
  //get note id
  const { noteId } = req.params;
  //get user id
  const { _id } = req.user;
  //get new content
  const { title, content } = req.body;

  //check content or title is exist or no
  if (!content && !title)
    return next(new Error("No data to update", { cause: 400 }));

  //find note
  const noteExist = await Note.findById(noteId);
  if (!noteExist) return next(new Error("Note not found", { cause: 404 }));

  if (String(noteExist.userId) != String(_id))
    return next(new Error("You are not the owner", { cause: 401 }));

  if (content) noteExist.content = content;
  if (title) noteExist.title = title;

  await noteExist.save();
  return res.status(200).json({ success: true, note: noteExist });
};

export const replaceNote = async (req, res, next) => {
  //get note id
  const { noteId } = req.params;
  //get user id
  const { _id } = req.user;
  //get new content
  const { title, content, userId } = req.body;

  //check content or title is exist or no
  if (!content && !title && !userId)
    return next(new Error("No data to update", { cause: 400 }));

  //find note
  const noteExist = await Note.findById(noteId);
  if (!noteExist) return next(new Error("Note not found", { cause: 404 }));

  if (String(noteExist.userId) != String(_id))
    return next(new Error("You are not the owner", { cause: 401 }));

  if (content) noteExist.content = content;
  if (title) noteExist.title = title;
  if (userId) noteExist.userId = userId;

  await noteExist.save();
  return res.status(200).json({ success: true, note: noteExist });
};

export const updateAllTitles = async (req, res, next) => {
  //user id
  const { _id } = req.user;
  // get title
  const { title } = req.body;

  if (!title) next(new Error("not input data to update", { cause: 400 }));

  const result = await Note.updateMany({ userId: _id }, { title });

  if (!result.modifiedCount)
    return next(new Error("No notes found", { cause: 409 }));
  return res.status(200).json({ success: true, message: "All notes updated" });
};

export const deleteNote = async (req, res, next) => {
  //get note id
  const { noteId } = req.params;
  //get user id
  const { _id } = req.user;

  //check note exist
  const noteExist = await Note.findById(noteId);
  if (!noteExist) return next(new Error("Note not found", { cause: 404 }));

  //check the owner of the note
  if (noteExist.userId.toString() != _id.toString())
    return next(new Error("You are not the owner", { cause: 401 }));

  await noteExist.deleteOne();
  return res
    .status(200)
    .json({ success: true, message: "deleted", note: noteExist });
};

export const paginate_sort = async (req, res, next) => {
  //get page number and limit
  const { page, limit } = req.query;

  const results = await Note.find()
    .sort({ createdAt: -1 })
    .skip(page || 1)
    .limit(limit || 1);

  res.json({ results });
};

export const getNote = async (req, res, next) => {
  //get note id
  const { id: noteId } = req.params;
  const { _id } = req.user;

  //get note
  const note = await Note.findById(noteId);

  if (!note) return next(new Error("Note not found", { cause: 404 }));

  if (!note.userId.equals(_id))
    return next(new Error("You are not the owner", { cause: 401 }));

  return res.status(200).json({ success: true, note });
};

export const getNoteByContent = async (req, res, next) => {
  //get note id
  const { content } = req.query;
  const { _id } = req.user;

  //get note
  const notes = await Note.find({
    userId: _id,
    content: { $regex: new RegExp(content, "i") },
  });

  if (!notes.length) return next(new Error("Note not found", { cause: 404 }));

  return res.status(200).json({ success: true, notes });
};

export const getNotesWithUser = async (req, res, next) => {
  //get user
  const { _id } = req.user;

  //get note
  const notes = await Note.find(
    { userId: _id },
    { title: 1, createdAt: 1 }
  ).populate({
    path: "userId",
    select: "email -_id",
  });

  return res.status(200).json({ success: true, notes });
};

export const aggregate = async (req, res, next) => {
  //   get title
  const { title } = req.query;
  // get user id
  const { _id } = req.user;

  const notes = await Note.aggregate([
    { $match: { userId: _id } },
    { $match: { content: { $regex: new RegExp(title, "i") } } },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "userId",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        userId: 1,
        createdAt: 1,
        _id: 0,
        user: { name: 1, email: 1 },
      },
    },
  ]);

  return res.status(200).json({ success: true, notes });
};

export const deleteAllNotes = async (req, res, next) => {
  //get user id
  const { _id } = req.user;
  //get note id
  const { noteId } = req.params;

  if (noteId) await Note.deleteOne({ _id: noteId, userId: _id });
  else await Note.deleteMany({ userId: _id });

  return res.status(200).json({ success: true, message: "deleted" });
};
