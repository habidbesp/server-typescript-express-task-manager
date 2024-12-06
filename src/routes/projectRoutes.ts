import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";

const router = Router();

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

router.put(
  "/:id",
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Project description is required"),
  param("id").isMongoId().withMessage("ID not valid"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID not valid"),
  handleInputErrors,
  ProjectController.deleteProject
);

/** Routes for Task */
router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Task description is required"),
  handleInputErrors,
  validateProjectExists,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

export default router;
