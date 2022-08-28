import withHandler, { responseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import hash from "@libs/server/hash";
import db from "@libs/client/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<responseType>
) {
  const { email, phone, name, password } = req.body;
  const hashedPassword = await hash(password);

  const emailOrPhone = phone ? { phone } : email ? { email } : null;
  const userData = phone
    ? { phone: phone, name: name, password: hashedPassword }
    : email
    ? { email: email, name: name, password: hashedPassword }
    : null;
  if (!emailOrPhone || !userData) return res.status(404);

  const foundedUser = await db.user.findFirst({
    where: emailOrPhone,
  });
  console.log("foundedUser : ", foundedUser);
  if (foundedUser) return res.json({ userExists: true, ok: false });

  const createdUser = await db.user.create({
    data: userData,
  });
  console.log("createdUser : ", createdUser);
  if (!createdUser) return res.json({ userExists: false, ok: false });

  return res.json({ userExists: false, ok: true });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
