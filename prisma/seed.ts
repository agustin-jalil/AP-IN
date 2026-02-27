// prisma/seed.ts
import { PrismaClient, Role, Categoria } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ─── Admin user ───────────────────────────────
  const adminPassword = await bcrypt.hash('Admin1234!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@applestock.com' },
    update: {},
    create: {
      email: 'admin@applestock.com',
      nombre: 'Administrador',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  // ─── Vendedor user ────────────────────────────
  const vendedorPassword = await bcrypt.hash('Vendedor1234!', 10);
  const vendedor = await prisma.user.upsert({
    where: { email: 'vendedor@applestock.com' },
    update: {},
    create: {
      email: 'vendedor@applestock.com',
      nombre: 'Juan Vendedor',
      passwordHash: vendedorPassword,
      role: Role.VENDEDOR,
    },
  });

  console.log('✅ Usuarios creados:', { admin: admin.email, vendedor: vendedor.email });

  // ─── Sucursal ─────────────────────────────────
  const sucursal = await prisma.sucursal.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      nombre: 'Casa Central',
      direccion: 'Av. Corrientes 1234',
      ciudad: 'Buenos Aires',
    },
  });

  console.log('✅ Sucursal creada:', sucursal.nombre);

  // ─── Productos ────────────────────────────────
  const productos = [
    {
      modelo: 'iPhone 15 Pro',
      categoria: Categoria.iPhone,
      memoria: '256GB',
      color: 'Titanio Negro',
      precio: 1299.99,
      bateria: 100,
      usado: false,
      stock: 15,
    },
    {
      modelo: 'iPhone 15 Pro',
      categoria: Categoria.iPhone,
      memoria: '512GB',
      color: 'Titanio Natural',
      precio: 1499.99,
      bateria: 100,
      usado: false,
      stock: 8,
    },
    {
      modelo: 'iPhone 14',
      categoria: Categoria.iPhone,
      memoria: '128GB',
      color: 'Medianoche',
      precio: 799.99,
      bateria: 85,
      usado: true,
      stock: 5,
    },
    {
      modelo: 'MacBook Pro 14"',
      categoria: Categoria.Mac,
      memoria: '512GB',
      color: 'Plata',
      precio: 1999.99,
      bateria: 100,
      usado: false,
      stock: 4,
    },
    {
      modelo: 'iPad Pro 12.9"',
      categoria: Categoria.iPad,
      memoria: '256GB',
      color: 'Gris Espacial',
      precio: 1099.99,
      bateria: 95,
      usado: false,
      stock: 7,
    },
    {
      modelo: 'Apple Watch Series 9',
      categoria: Categoria.Watch,
      memoria: '64GB',
      color: 'Medianoche',
      precio: 399.99,
      bateria: 100,
      usado: false,
      stock: 12,
    },
    {
      modelo: 'AirPods Pro 2da Gen',
      categoria: Categoria.AirPods,
      memoria: '0GB',
      color: 'Blanco',
      precio: 249.99,
      bateria: 100,
      usado: false,
      stock: 20,
    },
    {
      modelo: 'Funda MagSafe iPhone 15',
      categoria: Categoria.Accesorios,
      memoria: 'N/A',
      color: 'Rosa',
      precio: 49.99,
      bateria: null,
      usado: false,
      stock: 30,
    },
  ];

  for (const p of productos) {
    await prisma.producto.create({
      data: { ...p, precio: p.precio, sucursalId: sucursal.id },
    });
  }

  console.log(`✅ ${productos.length} productos creados`);
  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });