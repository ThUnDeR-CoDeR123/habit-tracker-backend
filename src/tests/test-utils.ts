import prisma from "../config/database";


export const cleanupTestUser = async (email: string) => {
  await prisma.user.deleteMany({
    where: { email }
  });
};
