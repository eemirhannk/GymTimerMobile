// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css', '~/assets/css/tailwind.css'],
  modules: ['@nuxt/fonts', '@nuxt/image', '@nuxtjs/tailwindcss'],
  tailwindcss:{
    cssPath: '~/assets/css/tailwind.css',
  }
})