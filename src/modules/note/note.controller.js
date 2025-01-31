import { Router } from "express";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { isAuthenticated } from "./../../middleware/auth.middleware.js";
import * as noteService from "./note.service.js";

const router = Router();

router.post(
  "/",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.createNote)
);

router.patch(
  "/all",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.updateAllTitles)
);

router.get(
  "/paginate-sort",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.paginate_sort)
);

router.get(
  "/note-by-content",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.getNoteByContent)
);

router.get(
  "/note-with-user",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.getNotesWithUser)
);
router.get(
  "/aggregate",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.aggregate)
);

router.put(
  "/replace/:noteId",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.replaceNote)
);

router.delete(
  "/replace/:noteId?",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.deleteAllNotes)
);

router.delete(
  "/:noteId",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.deleteNote)
);

router.patch(
  "/:noteId",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.updateNote)
);

router.get(
  "/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(noteService.getNote)
);

export default router;
