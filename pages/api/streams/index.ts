import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/clients";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { user } = req.session;
  const { name, price, description } = req.body;

  if (req.method === "POST") {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
        },
        body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic" }, "thumbnailTimestampPct": 0.5}`,
      }
    );
    const {
      result: {
        uid,
        rtmps: { url, streamKey },
      },
    } = await response.json();

    const stream = await client.stream.create({
      data: {
        cloudflareId: uid,
        cloudflareKey: streamKey,
        cloudflareUrl: url,
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      stream,
    });
  } else if (req.method === "GET") {
    const { page } = req.query;
    const offset = 10;
    const streams = await client.stream.findMany({
      take: offset,
      skip: (Number(page) - 1) * offset,
    });

    res.json({
      ok: true,
      streams,
      ...(streams.length === 0 ? { end: true } : {}),
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
