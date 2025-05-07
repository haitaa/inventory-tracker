import { PrismaClient } from "@prisma/client";

// BigInt'leri JSON.stringify ile serileştirmek için, prototype'ı genişletelim
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const prisma = new PrismaClient();
export default prisma;
