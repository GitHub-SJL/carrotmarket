import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import client from "@/libs/server/clients";
import withHandler, { ResponseType } from "@/libs/server/withHandler";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  console.log(token);
  res.status(200).end();
}

export default withHandler("POST", handler);
