import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/password"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hashPassword("admin123")
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  })

  // Create regular user
  const userPassword = await hashPassword("user123")
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: userPassword,
      name: "Regular User",
      role: "USER",
    },
  })

  // Create sample products
  const products = [
    {
      name: "Smartphone X",
      description: "Latest smartphone with advanced features and high-resolution camera.",
      price: 799.99,
      category: "Electronics",
      rating: 4.5,
      userId: admin.id,
    },
    {
      name: "Laptop Pro",
      description: "Powerful laptop for professionals with high performance and long battery life.",
      price: 1299.99,
      category: "Electronics",
      rating: 4.8,
      userId: admin.id,
    },
    {
      name: "Wireless Headphones",
      description: "Noise-cancelling wireless headphones with premium sound quality.",
      price: 199.99,
      category: "Audio",
      rating: 4.3,
      userId: user.id,
    },
    {
      name: "Smart Watch",
      description: "Fitness tracker and smartwatch with heart rate monitoring and GPS.",
      price: 249.99,
      category: "Wearables",
      rating: 4.0,
      userId: user.id,
    },
    {
      name: "Coffee Maker",
      description: "Programmable coffee maker with built-in grinder and timer.",
      price: 129.99,
      category: "Home Appliances",
      rating: 4.2,
      userId: admin.id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
