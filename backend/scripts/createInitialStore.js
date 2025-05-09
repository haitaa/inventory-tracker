import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const store = await prisma.store.create({
      data: {
        id: "1",
        name: "Ana Mağaza",
        description: "Varsayılan mağaza",
      },
    });

    console.log("Store oluşturuldu:", store);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
