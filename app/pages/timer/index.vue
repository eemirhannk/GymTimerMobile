<script setup lang="ts">
const route = useRoute()

// Query parametrelerinden değerleri al
const totalSets = computed(() => Number(route.query.setCount) || 3)
const setDuration = computed(() => Number(route.query.setDuration) || 0)
const restDuration = computed(() => Number(route.query.restDuration) || 60)

// Timer state
const currentSet = ref(1)
const isWorking = ref(true) // true: çalışma, false: dinlenme
const timeLeft = ref(0)
const isRunning = ref(false)
const isPaused = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

// Timer interval'ını başlat (süreyi sıfırlamadan)
const startInterval = () => {
  if (setDuration.value === 0 && isWorking.value) {
    // Süresiz çalışma modu
    return
  }
  
  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      handleTimeEnd()
    }
  }, 1000)
}

// Timer'ı başlat (ilk başlatma için)
const startTimer = () => {
  isRunning.value = true
  isPaused.value = false
  
  if (isWorking.value) {
    timeLeft.value = setDuration.value
  } else {
    timeLeft.value = restDuration.value
  }
  
  startInterval()
}

// Süre bittiğinde
const handleTimeEnd = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  
  if (isWorking.value) {
    // Çalışma süresi bitti, dinlenmeye geç
    isWorking.value = false
    timeLeft.value = restDuration.value
    startInterval()
  } else {
    // Dinlenme bitti
    if (currentSet.value < totalSets.value) {
      // Sonraki set'e geç
      currentSet.value++
      isWorking.value = true
      timeLeft.value = setDuration.value
      startInterval()
    } else {
      // Tüm setler tamamlandı
      isRunning.value = false
    }
  }
}

// Manuel geçiş (süresiz çalışma için)
const nextPhase = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  
  if (isWorking.value) {
    // Dinlenmeye geç
    isWorking.value = false
    timeLeft.value = restDuration.value
    startInterval()
  } else {
    // Sonraki set'e geç
    if (currentSet.value < totalSets.value) {
      currentSet.value++
      isWorking.value = true
      timeLeft.value = setDuration.value
      if (setDuration.value > 0) {
        startInterval()
      }
    } else {
      isRunning.value = false
    }
  }
}

// Pause/Resume
const togglePause = () => {
  if (isPaused.value) {
    // Devam et - süreyi sıfırlamadan sadece interval'ı başlat
    isPaused.value = false
    startInterval()
  } else {
    // Duraklat
    isPaused.value = true
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}

// Reset
const resetTimer = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  currentSet.value = 1
  isWorking.value = true
  timeLeft.value = 0
  isRunning.value = false
  isPaused.value = false
}

// Zamanı formatla (mm:ss)
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Progress bar için yüzde
const progressPercent = computed(() => {
  if (setDuration.value === 0 && isWorking.value) return 0
  
  const total = isWorking.value ? setDuration.value : restDuration.value
  if (total === 0) return 0
  return ((total - timeLeft.value) / total) * 100
})

// Component unmount olduğunda interval'ı temizle
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// İlk yükleme
onMounted(() => {
  if (setDuration.value > 0) {
    timeLeft.value = setDuration.value
  }
})
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-2xl">
      
      <!-- Header -->
      <div class="mb-6 sm:mb-8 flex items-center justify-between">
        <NuxtLink 
          to="/" 
          class="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Geri</span>
        </NuxtLink>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 italic">Gym Timer</h1>
        <div class="w-16"></div>
      </div>

      <!-- Timer Card -->
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-10 overflow-hidden">
        
        <!-- Set Info -->
        <div class="text-center mb-8">
          <div class="text-sm font-medium text-gray-500 mb-1">
            Set
          </div>
          <div class="text-4xl sm:text-5xl font-bold text-gray-800">
            {{ currentSet }} / {{ totalSets }}
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex justify-center mb-6">
          <div 
            :class="[
              'px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300',
              isWorking 
                ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            ]"
          >
            {{ isWorking ? '💪 Çalışma Zamanı' : '😌 Dinlenme Zamanı' }}
          </div>
        </div>

        <!-- Timer Display -->
        <div class="relative mb-8">
          <!-- Progress Circle Background -->
          <div class="flex justify-center items-center">
            <div class="relative">
              <!-- Background Circle -->
              <svg class="transform -rotate-90 w-64 h-64 sm:w-80 sm:h-80">
                <circle
                  cx="50%"
                  cy="50%"
                  r="120"
                  stroke="#E5E7EB"
                  stroke-width="12"
                  fill="none"
                />
                <!-- Progress Circle -->
                <circle
                  cx="50%"
                  cy="50%"
                  r="120"
                  :stroke="isWorking ? '#10B981' : '#3B82F6'"
                  stroke-width="12"
                  fill="none"
                  :stroke-dasharray="2 * Math.PI * 120"
                  :stroke-dashoffset="2 * Math.PI * 120 * (1 - progressPercent / 100)"
                  class="transition-all duration-300 ease-linear"
                  stroke-linecap="round"
                />
              </svg>
              
              <!-- Time Display -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  v-if="!isRunning"
                  class="text-6xl sm:text-7xl font-bold text-gray-800"
                >
                  {{ setDuration === 0 && isWorking ? '--:--' : formattedTime }}
                </div>
                <div 
                  v-else
                  class="text-6xl sm:text-7xl font-bold"
                  :class="isWorking ? 'text-green-600' : 'text-blue-600'"
                >
                  {{ setDuration === 0 && isWorking ? '--:--' : formattedTime }}
                </div>
                <div v-if="setDuration === 0 && isWorking && isRunning" class="text-sm text-gray-500 mt-2">
                  Süresiz
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Workout Completed -->
        <div v-if="!isRunning && currentSet > totalSets" class="text-center mb-8">
          <div class="text-3xl mb-4">🎉</div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Tebrikler!</h2>
          <p class="text-gray-600">Tüm setleri tamamladınız!</p>
        </div>

        <!-- Control Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <!-- Start Button -->
          <button
            v-if="!isRunning"
            @click="startTimer"
            class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {{ currentSet > totalSets ? 'Yeniden Başla' : 'Başla' }}
          </button>

          <!-- Pause/Resume Button -->
          <button
            v-if="isRunning && !(setDuration === 0 && isWorking)"
            @click="togglePause"
            :class="[
              'px-8 py-4 font-semibold rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
              isPaused 
                ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500'
            ]"
          >
            {{ isPaused ? 'Devam Et' : 'Duraklat' }}
          </button>

          <!-- Next Phase Button (for unlimited work time) -->
          <button
            v-if="isRunning && setDuration === 0 && isWorking"
            @click="nextPhase"
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Dinlenmeye Geç
          </button>

          <!-- Reset Button -->
          <button
            v-if="isRunning"
            @click="resetTimer"
            class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sıfırla
          </button>
        </div>

        <!-- Settings Info -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-xs text-gray-500 mb-1">Toplam Set</div>
              <div class="font-semibold text-gray-800">{{ totalSets }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">Çalışma</div>
              <div class="font-semibold text-gray-800">{{ setDuration === 0 ? 'Süresiz' : setDuration + 's' }}</div>
            </div>
            <div class="col-span-2 sm:col-span-1">
              <div class="text-xs text-gray-500 mb-1">Dinlenme</div>
              <div class="font-semibold text-gray-800">{{ restDuration }}s</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>