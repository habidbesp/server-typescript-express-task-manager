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
      const project = await Project.findById(req.params.id).populate("tasks");
      if (!project) {
        const error = new Error("Project not found.");
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
      req.project.projectName = req.body.projectName;
      req.project.clientName = req.body.clientName;
      req.project.description = req.body.description;

      await req.project.save();

      res.status(200).send("Poject successfully updated!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
      await req.project.deleteOne();
      res
        .status(200)
        .send("Project: '" + req.project.projectName + "' was deleted");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

//CRUD
