import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withApiSession";
import withHandler, { responseType } from "@libs/server/withHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  req.session.destroy();
  res.json({ ok: true });
}

// withApiSession : withIronSessionApiRoute 함수와 이 함수에 필요한 옵션을 포함한 함수
export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
