import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  const keys = Array.from(Array(100).keys());
  
  for (const idx of keys) {
    await client.stream.create({
      data: {
        name: String(idx),
        description: String(idx),
        price: idx,
        user: {
          connect: {
            id: 18,
          },
        },
      },
    });
    console.log(`${idx + 1}/100`); // 인덱스는 0부터 시작하므로 1을 더해줍니다
  }
}
main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());
