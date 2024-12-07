import type { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";

// Extending the Express Request interface to include an optional 'project' property
// This allows the project object to be added to the request in middleware, enabling access
// to the project details in subsequent route handlers. The 'project' property is of type IProject.
declare global {
  namespace Express {
    interface Request {
      project?: IProject;
    }
  }
}
export async function projectExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      const error = new Error("Project not found.");
      res.status(404).json({ error: error.message });
      return;
    }
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
