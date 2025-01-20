import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExists,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Project description is required"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID not valid"),
  handleInputErrors,
  ProjectController.getProjectById
);

// Middleware to preload the project document whenever a route contains param "projectId".
router.param("projectId", projectExists);
router.put(
  "/:projectId",
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Project description is required"),
  param("projectId").isMongoId().withMessage("ID not valid"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID not valid"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);

/** Routes for Task */
router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Task description is required"),
  handleInputErrors,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

// Middleware to preload the task document whenever a route contains param "taskId".
router.param("taskId", taskExists);

// Middleware to verify if a task belongs to a project whenever a route contains param "taskId".
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID not valid"),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID not valid"),
  body("name").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Task description is required"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID not valid"),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID not valid"),
  body("status").notEmpty().withMessage("Task status is required"),
  handleInputErrors,
  TaskController.updateTaskStatus
);

/**  Routes for teams */
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("Invalid Email"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);

router.get("/:projectId/team", TeamMemberController.getProjectTeam);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("Invalid User Id"),
  handleInputErrors,
  TeamMemberController.addMemberById
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("Invalid User Id"),
  handleInputErrors,
  TeamMemberController.removeMemberById
);

/** Routes for Notes */

router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content").notEmpty().withMessage("Note content is required."),
  handleInputErrors,
  NoteController.createNote
);

router.get("/:projectId/tasks/:taskId/notes", NoteController.getTaskNotes);
router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",
  param("noteId").isMongoId().withMessage("Invalid Note ID"),
  handleInputErrors,
  NoteController.deleteTaskNote
);

export default router;
