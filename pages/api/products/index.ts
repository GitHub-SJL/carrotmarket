import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/clients";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            Fav: true,
          },
        },
      },
    });

    res.json({
      ok: true,
      products,
    });
  }
  if (req.method === "POST") {
    const { name, price, description, image } = req.body;
    const { user } = req.session;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image,
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
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
