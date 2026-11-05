// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Test TODO"
    }
  },

  css: ['~/assets/styles/global.scss', '~/assets/styles/variables.scss'],

  modules: ['@pinia/nuxt'],

  typescript: {
    strict: true
  },

  devtools: { enabled: false },

  compatibilityDate: '2025-07-15'
})
