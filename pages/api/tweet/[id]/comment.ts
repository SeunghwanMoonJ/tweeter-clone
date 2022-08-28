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
      query: { id },
    } = req;

    const comments = await db.comment.findMany({
      where: { tweetId: +id.toString() },
    });
    console.log(comments);

    res.json({
      ok: true,
      comments,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      query: { id },
      body: { text },
    } = req;

    const comment = await db.comment.create({
      data: {
        text,
        user: { connect: { id: user?.id } },
        tweet: { connect: { id: +id.toString() } },
      },
    });
    console.log(comment);

    return res.json({ ok: true, comment });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler, isPrivate: false })
);
