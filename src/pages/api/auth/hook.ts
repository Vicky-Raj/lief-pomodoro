// pages/api/auth/hook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma"
import { printTreeView } from "next/dist/build/utils";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, secret } = req.body;

  if (req.method !== "POST") {
    return res.status(403).json({ message: "Method not allowed" });
  }

  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    return res.status(403).json({ message: `You must provide the secret 🤫` });
  }

  await prisma.user.upsert({
    where: { email: user.email },
    update: {},
    create: {name:user.name,email:user.email}
  })

  return res.status(200).json({
    message: `User with email: has been created successfully!`,
  });

};

export default handler;
