import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/database";
import { IUser } from "@/interfaces";
import { User } from "@/models";
import { isValidObjectId } from "mongoose";
import { RollerShades } from "@mui/icons-material";

type Data = { message: string } | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "PUT":
      return updateUsers(req, res);
    default:
      return res.status(200).json({ message: "Example" });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await User.find().select("-password").lean();
  await db.disconnect();

  return res.status(200).json(users);
};

const updateUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = "", role = "" } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "No existe usuario para ese id" });
  }

  const validRoles = ["admin", "client", "super-user", "SEO"];
  if (!validRoles.includes(role)) {
    return res
      .status(400)
      .json({ message: "Rol ni permitido" + validRoles.join(", ") });
  }

  await db.connect();
  const user = await User.findById(userId);

  if (!user) {
    await db.disconnect();
    return res.status(404).json({ message: "Usuario no encontrado" + userId });
  }

  user.role = role;
  await user.save();
  await db.disconnect();

  return res.status(200).json({ message: "Usuario Actualizado" });
};
