import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const items = [
    {
      key: "projects_completed",
      label: "Projects Completed",
      value: 500,
      suffix: "+",
      order: 1,
    },
    {
      key: "years_experience",
      label: "Years Experience",
      value: 15,
      suffix: "+",
      order: 2,
    },
    {
      key: "design_awards",
      label: "Design Awards",
      value: 50,
      suffix: "+",
      order: 3,
    },
    {
      key: "client_satisfaction",
      label: "Client Satisfaction",
      value: 98,
      suffix: "%",
      order: 4,
    },
  ];
  for (const i of items) {
    await prisma.homeStat.upsert({
      where: { key: i.key },
      update: i,
      create: i,
    });
  }
  console.log("✅ Seeded home stats");
}

await prisma.recentProject.upsert({
  where: { slug: "royal-villa-mumbai3" },
  update: {},
  create: {
    slug: "royal-villa-mumbai3",
    title: "rahul gandhi ji is great person",
    description: "Modern classic overhaul with warm palette. ......",
    propertyType: "Villa",
    area: "3200 sq ft",
    layout: "4BHK",
    location: "Mumbai",
    designHighlights: ["Italian marble", "Smart lighting", "Open kitchen"],
    beforeImageUrl: "https://example.com/before.jpg",
    afterImageUrl: "https://example.com/after.jpg",
    isFeatured: true,
    imageUrl: [
      "https://example.com/after.jpg",
      "https://example.com/before.jpg",
      "https://example.com/before.jpg",
      "https://example.com/before.jpg",
    ],
  },
});

main().finally(() => prisma.$disconnect());
