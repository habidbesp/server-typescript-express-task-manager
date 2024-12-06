import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = await Project.create(req.body);

      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getAllProjects = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const projects = await Project.find({});
      res.status(201).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getProjectById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const projectById = await Project.findById(req.params.id);
      if (!projectById) {
        const error = new Error("Project not found.");
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(200).json(projectById);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const projectToUpdate = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!projectToUpdate) {
        const error = new Error("Project not found.");
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(200).json(projectToUpdate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const projectToDelete = await Project.findByIdAndDelete(req.params.id);
      if (!projectToDelete) {
        const error = new Error("Project not found.");
        res.status(404).json({ error: error.message });
        return;
      }
      res
        .status(200)
        .send("Project: '" + projectToDelete.projectName + "' was deleted");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

//CRUD
