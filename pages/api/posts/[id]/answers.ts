import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/clients";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { id } = req.query;
  const { user } = req.session;
  const { Answer: answer } = req.body;
  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: Number(id?.toString()),
        },
      },
      answer,
    },
  });
  res.json({
    ok: true,
    newAnswer,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
