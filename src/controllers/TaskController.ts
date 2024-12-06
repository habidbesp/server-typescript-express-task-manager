import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = req.project;
      const newTask = new Task({ project: project.id, ...req.body });
      project.tasks.push(newTask.id);
      await Promise.allSettled([newTask.save(), project.save()]);
      res.status(200).send("Task created successfully!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getProjectTasks = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
