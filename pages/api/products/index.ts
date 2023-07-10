import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/clients";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { name, price, description } = req.body;
  const { user } = req.session;

  const product = await client.product.create({
    data: {
      name,
      price: +price,
      description,
      image: "test",
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.json({
    ok: true,
    product,
  });
}

export default withApiSession(
  withHandler({
    method: "POST",
    handler,
  })
);