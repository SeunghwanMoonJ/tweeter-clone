import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withApiSession";
import db from "@libs/client/db";
import compareHash from "@libs/server/compareHash";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const { emailOrPhone, password } = req.body;

  const user = emailOrPhone?.includes("@")
    ? { email: emailOrPhone }
    : { phone: emailOrPhone };

  const foundedUser = await db.user.findFirst({
    where: user,
  });

  const compareResult = await compareHash(password, foundedUser?.password!);
  if (!compareResult) return res.json({ loginFailed: true, ok: false });

  req.session.user = {
    id: foundedUser?.id!,
  };
  await req.session.save();

  return res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
