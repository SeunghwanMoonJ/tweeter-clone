import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withApiSession";
import db from "@libs/client/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const tweet = await db.tweet.findUnique({
    where: { id: +id.toString() },
    include: {
      _count: { select: { Like: true, Comment: true } },
      user: true,
      Comment: { where: { tweetId: +id.toString() }, include: { user: true } },
    },
  });

  const isLiked = Boolean(
    await db.like.findFirst({
      where: {
        userId: user?.id,
        tweetId: tweet?.id,
      },
    })
  );

  res.json({
    ok: true,
    tweet,
    isLiked,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: false })
);
