import type { Request, Response } from "express";
import Task from "../models/Task";
import Note from "../models/Note";

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

  static getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await Task.findById(req.task.id)
        .populate({
          path: "completedBy.user",
          select: "_id name email",
        })
        .populate({
          path: "notes",
          populate: { path: "createdBy", select: "_id name email" },
        });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.status(200).send("Task updated successfully!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      await Promise.allSettled([
        req.task.deleteOne(),
        req.project.updateOne({ $pull: { tasks: req.params.taskId } }),
        Note.deleteMany({ task: req.params.taskId }),
      ]);
      res.status(200).send(`Task deleted successfully`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateTaskStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { status } = req.body;
      req.task.status = status;
      const data = { user: req.user.id, status };
      req.task.completedBy.push(data);
      await req.task.save();
      res.status(200).send(`Task status successfully updated`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
