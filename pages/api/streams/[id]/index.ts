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
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id?.toString()),
    },
    include: {
      Message: {
        select: {
          message: true,
          id: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });

  const isOwner = stream?.userId === user?.id;
  if (stream && !isOwner) {
    stream.cloudflareKey = "xxxxx";
    stream.cloudflareUrl = "xxxxx";
  }
  
  res.json({
    ok: true,
    stream,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
