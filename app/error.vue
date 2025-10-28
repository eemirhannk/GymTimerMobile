<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8">
    <div class="max-w-md w-full">
      <!-- Error Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 md:w-24 md:h-24 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            class="w-10 h-10 md:w-12 md:h-12 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Error Content -->
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          {{ error?.statusCode || '404' }}
        </h1>
        <h2 class="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
          {{ errorTitle }}
        </h2>
        <p class="text-gray-600 text-sm md:text-base leading-relaxed">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <NuxtLink 
          to="/" 
          class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center shadow-md hover:shadow-lg"
        >
          Ana Sayfaya Dön
        </NuxtLink>
        
        <button 
          @click="handleError"
          class="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border-2 border-gray-300 shadow-sm hover:shadow-md"
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object as () => any
})

const errorTitle = computed(() => {
  const statusCode = props.error?.statusCode || 404
  
  if (statusCode === 404) {
    return 'Sayfa Bulunamadı'
  } else if (statusCode === 500) {
    return 'Sunucu Hatası'
  } else if (statusCode >= 500) {
    return 'Sunucu Hatası'
  } else if (statusCode >= 400) {
    return 'İstek Hatası'
  }
  
  return 'Bir Hata Oluştu'
})

const errorMessage = computed(() => {
  const statusCode = props.error?.statusCode || 404
  
  if (statusCode === 404) {
    return 'Aradığınız sayfa bulunamadı veya taşınmış olabilir. Lütfen URL\'yi kontrol edin veya ana sayfaya dönün.'
  } else if (statusCode === 500) {
    return 'Sunucu tarafında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } else if (statusCode >= 500) {
    return 'Sunucu tarafında bir sorun oluştu. Ekibimiz durumdan haberdar edildi.'
  } else if (statusCode >= 400) {
    return 'İsteğiniz işlenirken bir hata oluştu. Lütfen tekrar deneyin.'
  }
  
  return 'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.'
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
