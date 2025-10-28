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
  },
  app:{
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Gym Timer - Antrenman Zamanlayıcı Uygulaması',
      htmlAttrs: {
        lang: 'tr'
      },
      meta: [
        { name: 'description', content: 'Spor salonunda kullanabileceğiniz profesyonel zamanlayıcı uygulaması. Antrenmanlarınızı daha verimli hale getirin.' },
        { name: 'keywords', content: 'gym timer, spor salonu zamanlayıcı, antrenman zamanlayıcı, egzersiz zamanlayıcı, workout timer' },
        { name: 'author', content: 'Gym Timer' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#EEEEEE' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Gym Timer - Antrenman Zamanlayıcı Uygulaması' },
        { property: 'og:description', content: 'Spor salonunda kullanabileceğiniz profesyonel zamanlayıcı uygulaması. Antrenmanlarınızı daha verimli hale getirin.' },
        { property: 'og:locale', content: 'tr_TR' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Gym Timer - Antrenman Zamanlayıcı Uygulaması' },
        { name: 'twitter:description', content: 'Spor salonunda kullanabileceğiniz profesyonel zamanlayıcı uygulaması.' },
        // Mobile
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Gym Timer' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://gym-timer-tp.netlify.app' }
      ]
    }
  }
})