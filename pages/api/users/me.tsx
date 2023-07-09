import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/clients";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
  });
  // BigInt 값을 문자열로 변환
  const profileStr = JSON.parse(
    JSON.stringify(profile, (_, v) => (typeof v === "bigint" ? `${v}` : v))
  );
  res.json({
    ok: true,
    ...profileStr,
  });
}

export default withApiSession(
  withHandler({
    method: "GET",
    handler,
  })
);
