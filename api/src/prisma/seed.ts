import prismaClient from './prismaClient'

async function main() {
   await prismaClient.codeCounterConfig.upsert({
      where: { name: 'ARTICLE' },
      update: {},
      create: { name: 'ARTICLE', next: 1 },
   })

   await prismaClient.codeCounterConfig.upsert({
      where: { name: 'ORDER' },
      update: {},
      create: { name: 'ORDER', next: 1 },
   })
}

main()
   .then(() => {
      console.log('✅ Seed completado')
   })
   .catch((e) => {
      console.error('❌ Error en seed', e)
   })
   .finally(async () => {
      await prismaClient.$disconnect()
   })
