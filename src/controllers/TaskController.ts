import type { Request, Response } from "express";

export class TaskController {
  static createTask = async (req: Request, res: Response): Promise<void> => {
    console.log("req.params => ", req.params);
    try {
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
