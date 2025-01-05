import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response): Promise<void> => {
    const project = new Project(req.body);

    // Assign Manager
    project.manager = req.user.id;
    try {
      await project.save();
      res.status(201).send("Project created successfully!");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getAllProjects = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } },
        ],
      });
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
      const project = await Project.findById(req.params.id).populate({
        path: "tasks",
        populate: { path: "completedBy", select: "_id name email" },
      });
      if (!project) {
        const error = new Error("Project not found.");
        res.status(404).json({ error: error.message });
        return;
      }

      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        const error = new Error("Invalid Action.");
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
      if (req.project.manager.toString() !== req.user.id.toString()) {
        const error = new Error(
          "Only the manager is authorized to update the project."
        );
        res.status(404).json({ error: error.message });
        return;
      }
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
      if (req.project.manager.toString() !== req.user.id.toString()) {
        const error = new Error(
          "Only the manager is authorized to delete the project."
        );
        res.status(404).json({ error: error.message });
        return;
      }

      await req.project.deleteOne();
      res
        .status(200)
        .send("Project: '" + req.project.projectName + "' was deleted");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
