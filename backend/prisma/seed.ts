import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeding...');

  const empresa = await prisma.empresa.create({
    data: {
      nome: 'Tech Corp',
      cnpj: '12.345.678/0001-90',
      responsavel: 'João Silva',
      email: 'contato@techcorp.com',
    },
  });

  const cliente = await prisma.client.create({
    data: {
      nome: 'Admin',
      CPF: '123.456.789-00',
      tel: '11987654321',
      email: 'admin@admin.com',
      senha: '123',
      admin: true,
      Endereco: {
        create: [
          {
            rua: 'Rua das Flores',
            numero: 123,
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01000-000',
          },
        ],
      },
      Cartao: {
        create: [
          {
            numero: '4111111111111111',
            nome: 'Admin',
            empresaId: empresa.id,
          },
        ],
      },
      Pontos: {
        create: [
          {
            empresaId: empresa.id,
            pontos: 100,
            valorAcumulado: 50.0,
          },
        ],
      },
    },
  });

  // Criando promoções
  await prisma.promocoes.create({
    data: {
      nome: 'Desconto de Verão',
      descricao: '10% de desconto em todas as compras',
      valor: 10.0,
      data: new Date(),
      empresaId: empresa.id,
    },
  });

  // Criando transações
  const cartao = await prisma.cartao.findFirst({
    where: { clienteId: cliente.id },
  });

  if (cartao) {
    await prisma.transacoes.create({
      data: {
        valor: 200.0,
        data: new Date(),
        cartaoId: cartao.id,
        empresaId: empresa.id,
        clienteId: cliente.id,
      },
    });
  }

  console.log('Seeding concluído!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
