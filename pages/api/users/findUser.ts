import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import db from "@libs/client/db";
import { withApiSession } from "@libs/server/withApiSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const profile = await db.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });

  if (!profile) return res.json({ ok: false });

  res.json({
    ok: true,
    profile,
  });
}

// withApiSession : withIronSessionApiRoute 함수와 이 함수에 필요한 옵션을 포함한 함수
export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: false })
);
