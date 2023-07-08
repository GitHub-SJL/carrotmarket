import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import client from "@/libs/server/clients";
import withHandler, { ResponseType } from "@/libs/server/withHandler";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: +phone } : email ? { email } : null;
  if (!user)
    return res.status(400).json({
      ok: false,
    });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  if (phone) {
    // Twilio SMS 인증 Service (유료)
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   body: `Your login token is ${payload}`,
    //   from: "+18147873034",
    //   to: process.env.MY_PHONE!,
    // });
    // console.log(message);
  }
  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
