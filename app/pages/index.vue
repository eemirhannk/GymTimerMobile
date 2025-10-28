<script setup lang="ts">
const setCount = ref<number>(3)
const setDuration = ref<number>(0)
const restDuration = ref<number>(60)
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-lg">
      
      <div class="mb-8 sm:mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 text-center italic">
          Gym Timer
        </h1>
      </div>

      <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8">
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Set Sayısı
            </label>
            <input
              v-model.number="setCount"
              type="number"
              min="1"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Örn: 3"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Set Süresi (saniye) - Opsiyonel
            </label>
            <input
              v-model.number="setDuration"
              type="number"
              min="0"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0 = süresiz"
            />
            <p class="mt-1 text-xs text-gray-500">0 girerseniz süre sınırı olmaz</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Dinlenme Süresi (saniye)
            </label>
            <input
              v-model.number="restDuration"
              type="number"
              min="0"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Örn: 60"
            />
          </div>

          <NuxtLink
            :to="{
              path: '/timer',
              query: {
                setCount: setCount,
                setDuration: setDuration,
                restDuration: restDuration
              }
            }"
            class="block w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
          >
            Başla
          </NuxtLink>

        </div>
      </div>
    </div>
  </div>
</template>