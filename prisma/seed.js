import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

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
    beforeImageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
    afterImageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
    isFeatured: true,
    imageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
  },
});

await prisma.featureProject.upsert({
  where: { slug: "the-kapoor-villa" },
  update: {},
  create: {
    slug: "the-kapoor-villa",
    title: "The Kapoor Villa",
    description: "Modern classic overhaul with warm palette. ......",
    propertyType: "Villa",
    area: "3200 sq ft",
    layout: "4BHK",
    location: "Mumbai",
    designHighlights: ["Italian marble", "Smart lighting", "Open kitchen"],
    beforeImageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
    afterImageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
    isFeatured: true,
    imageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
  },
});

await prisma.homeTestimonial.createMany({
  data: [
    {
      userName: "Devesh kumar Singh",
      userLocation: "Gurugram, IN",
      userReview:
        "Team delivered exactly what we wanted—on time and with great design sense.",
      userProfile:
        "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Ellipse_4_k4gbuo.png",
      image:
        "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      order: 1,
    },
    {
      userName: "Kashish Singh",
      userLocation: "Mumbai, IN",
      userReview:
        "Smooth process and fantastic interior finish. Highly recommended!",
      userProfile: "https://example.com/avatars/riya.jpg",
      image:
        "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      order: 2,
    },
  ],
  skipDuplicates: true,
});

await prisma.projectVideo.createMany({
  data: [
    {
      title: "Villa Living Room Walkthrough",
      videoUrl: "https://example.com/videos/villa-living.mp4",
      thumbnailUrl: "https://example.com/thumbs/villa-living.jpg",
      projectSlug: "royal-villa-mumbai",
      order: 1,
    },
    {
      title: "Modern Kitchen Tour",
      videoUrl: "https://example.com/videos/kitchen-tour.mp4",
      thumbnailUrl: "https://example.com/thumbs/kitchen-tour.jpg",
      projectSlug: "royal-villa-mumbai",
      order: 2,
    },
  ],
  skipDuplicates: true,
});

await prisma.project.upsert({
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
    beforeImageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
    afterImageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
    isFeatured: true,
    imageUrl: [
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102197/Frame_2147227311_vdbcq9.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
      "https://res.cloudinary.com/dqwc7j44b/image/upload/v1760102196/Frame_2147227312_jmxl0s.png",
    ],
  },
});

const password = "your-default-password"; // Change this to a secure password
const hash = await bcrypt.hash(password, 10);

await prisma.adminUser.upsert({
  where: { email: "admin@demo.com" },
  update: {},
  create: { email: "admin@demo.com", password: hash, name: "Admin" },
});

main().finally(() => prisma.$disconnect());
