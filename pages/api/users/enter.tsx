import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/clients";
import withHandler from "../../../libs/server/withHandler";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  return res.json(req.body);
}

export default withHandler("POST", handler);
