import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withApiSession";
import db from "@libs/client/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const tweets = await db.tweet.findMany({
      // findMany에서 relation을 카운트 가능(필드 하나 추가로 만들어서 count++ 하는 작업을 안해도 된다.)
      include: {
        _count: { select: { Like: true, Comment: true } },

        user: true,
        Like: { where: { userId: user?.id }, select: { userId: true } },
      },
    });

    res.json({
      ok: true,
      tweets,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { text },
    } = req;
    const tweet = await db.tweet.create({
      data: {
        text,
        user: { connect: { id: user?.id } },
      },
    });
    return res.json({ ok: true, tweet });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: false })
);
