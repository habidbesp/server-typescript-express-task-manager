import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";
import { isValidObjectId } from "mongoose";

// Extending the Express Request interface to include an optional 'task' property
// This allows the task object to be added to the request in middleware, enabling access
// to the task details in subsequent route handlers. The 'task' property is of type ITask.

declare global {
  namespace Express {
    interface Request {
      task?: ITask;
    }
  }
}

export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!isValidObjectId(req.params.taskId)) {
      const error = new Error("ID not valid");
      res.status(404).json({ error: error.message });
      return;
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      const error = new Error("Task not found.");
      res.status(404).json({ error: error.message });
      return;
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    if (req.task.project.toString() !== req.project.id.toString()) {
      const error = new Error("Invalid Action.");
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function removeTaskFromProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tasks = req.project.tasks;
    req.project.tasks = tasks.filter(
      (task) => task.toString() !== req.params.taskId
    );
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function hasAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    if (req.user.id.toString() !== req.project.manager.toString()) {
      const error = new Error("Invalid Action.");
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
