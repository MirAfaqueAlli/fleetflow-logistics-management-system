import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  seed: {
    run: 'tsx prisma/seed.ts',
  },
})
