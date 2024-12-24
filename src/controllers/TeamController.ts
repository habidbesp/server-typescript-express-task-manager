import { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("id email name");
    if (!user) {
      const error = new Error("User not found");
      res.status(404).json({ error: error.message });
      return;
    }
    res.json(user);
  };

  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project.id).populate({
      path: "team",
      select: "id email name",
    });

    res.json(project.team);
  };

  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    // Find user
    const user = await User.findById(id).select("id");
    if (!user) {
      const error = new Error("User not found.");
      res.status(404).json({ error: error.message });
      return;
    }

    if (
      req.project.team.some(
        (teamMember) => teamMember.toString() === user.id.toString()
      )
    ) {
      const error = new Error(
        "The user is already a collaborator in this team."
      );
      res.status(409).json({ error: error.message });
      return;
    }

    req.project.team.push(user.id);
    await req.project.save();

    res.send("The user was successfully added to this project.");
  };

  static removeMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!req.project.team.some((teamMember) => teamMember.toString() === id)) {
      const error = new Error(
        "The user is not listed as a collaborator in this team."
      );
      res.status(409).json({ error: error.message });
      return;
    }

    req.project.team = req.project.team.filter(
      (teamMember) => teamMember.toString() !== id
    );

    await req.project.save();

    res.send("User successfully removed from the project.");
  };
}
