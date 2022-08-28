import db from "@libs/client/db";
import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withApiSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const alreadyExists = await db.like.findFirst({
    where: {
      tweetId: +id?.toString()!,
      userId: user?.id,
    },
  });

  if (alreadyExists) {
    await db.like.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    const a = await db.like.create({
      data: {
        user: { connect: { id: user?.id } },
        tweet: { connect: { id: +id?.toString()! } },
      },
    });
    console.log(a);
  }

  res.json({
    ok: true,
  });
}

// withSession : withIronSessionApiRoute 함수와 이 함수에 필요한 옵션을 포함한 함수
export default withApiSession(withHandler({ methods: ["POST"], handler }));
