// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/image', '@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  routeRules:{
    '/**': { cache: { maxAge: 60 * 60 * 60}, ssr: true, swr: true },
  },
  googleFonts: {
    families: {
      'IBM Plex Sans': [400, 700],
    },
    display: 'swap',
    download: true,
    preload: true,
    base64: true,
    inject: true,
  }
})