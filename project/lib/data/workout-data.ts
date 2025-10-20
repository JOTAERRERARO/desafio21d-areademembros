import type { WorkoutDay } from "@/lib/types/database"

// 🧠 INSTRUÇÕES PARA TROCAR OS VÍDEOS:
// 1. Encontre o dia que você quer alterar (day: 1, day: 2, etc.)
// 2. Localize o campo "url" dentro de "exercises"
// 3. Substitua o link pelo novo link do YouTube no formato EMBED
// 4. Formato correto: https://www.youtube.com/embed/ID_DO_VIDEO
// 5. Se você tiver um link no formato /watch?v=, use a função convertToEmbedUrl() abaixo

// Função auxiliar para converter URLs do YouTube
export function convertToEmbedUrl(url: string): string {
  // Se já estiver no formato embed, retorna como está
  if (url.includes("/embed/")) {
    return url
  }

  // Converte formato /watch?v= para /embed/
  const videoIdMatch = url.match(/[?&]v=([^&]+)/)
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`
  }

  return url
}

export const week1Days: WorkoutDay[] = [
  {
    day: 1,
    title: "FULL BODY CALISTHENICS",
    description: "Reativando todos os grupos musculares",
    exercises: [
      {
        id: "w1d1e1",
        title: "Full Body Calisthenics - CALI 2.0 Series",
        type: "video",
        duration: "25 min",
        url: "https://www.youtube.com/embed/rBXmeNcDz1E",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 2,
    title: "UPPER BODY STRENGTH",
    description: "Peito, ombros e braços",
    exercises: [
      {
        id: "w1d2e1",
        title: "Upper Body Strength - 10 Min Shoulder",
        type: "video",
        duration: "30 min",
        url: "https://www.youtube.com/embed/yJTYOHiJpSs",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 3,
    title: "LOWER BODY MOBILITY",
    description: "Pernas e mobilidade",
    exercises: [
      {
        id: "w1d3e1",
        title: "Lower Body Mobility - Leg Day",
        type: "video",
        duration: "28 min",
        url: "https://www.youtube.com/embed/O54PvQIY0ps",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 4,
    title: "STRETCH & CORE STABILITY",
    description: "Alongamento e estabilidade do core",
    exercises: [
      {
        id: "w1d4e1",
        title: "Stretch & Core Stability",
        type: "video",
        duration: "20 min",
        url: "https://www.youtube.com/embed/fXRSKQ8hrgQ",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 5,
    title: "PUSH WORKOUT",
    description: "Peito e tríceps",
    exercises: [
      {
        id: "w1d5e1",
        title: "Push Workout - Chest & Triceps",
        type: "video",
        duration: "25 min",
        url: "https://www.youtube.com/embed/CKXUCydj9o0",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 6,
    title: "PULL WORKOUT",
    description: "Costas e bíceps",
    exercises: [
      {
        id: "w1d6e1",
        title: "Pull Workout - Back & Biceps",
        type: "video",
        duration: "30 min",
        url: "https://www.youtube.com/embed/E_WnU_kee_E",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 7,
    title: "DESCANSO ATIVO",
    description: "Mobilidade e recuperação",
    exercises: [
      {
        id: "w1d7e1",
        title: "Mobility Flow - Descanso Ativo",
        type: "video",
        duration: "15 min",
        url: "https://www.youtube.com/embed/cx4oKIL-Nv8",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
]

export const week2Days: WorkoutDay[] = [
  {
    day: 8,
    title: "HIIT 30MIN FULL BODY",
    description: "Treino intervalado de alta intensidade",
    exercises: [
      {
        id: "w2d8e1",
        title: "HIIT 30min Full Body",
        type: "video",
        duration: "30 min",
        url: "https://www.youtube.com/embed/CdUVpTqlEBw",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 9,
    title: "DUMBBELL PUSH/PULL",
    description: "Treino com halteres",
    exercises: [
      {
        id: "w2d9e1",
        title: "Dumbbell Push/Pull",
        type: "video",
        duration: "30 min",
        url: "https://www.youtube.com/embed/fWptOzJI3Wc",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 10,
    title: "RESISTANCE BAND WORKOUT",
    description: "Treino com faixas de resistência",
    exercises: [
      {
        id: "w2d10e1",
        title: "Resistance Band Workout",
        type: "video",
        duration: "25 min",
        url: "https://www.youtube.com/embed/sF_ICnyxXnw",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 11,
    title: "SHOULDER & ARMS BURNOUT",
    description: "Ombros e braços intenso",
    exercises: [
      {
        id: "w2d11e1",
        title: "Shoulder & Arms Burnout",
        type: "video",
        duration: "28 min",
        url: "https://www.youtube.com/embed/_yXNph-LU-0",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 12,
    title: "SLAM BALL CHALLENGE",
    description: "Desafio com slam ball",
    exercises: [
      {
        id: "w2d12e1",
        title: "Slam Ball Challenge",
        type: "video",
        duration: "20 min",
        url: "https://www.youtube.com/embed/gB8NNnluyBM",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 13,
    title: "CORE STABILITY + STRETCH",
    description: "Core e alongamento",
    exercises: [
      {
        id: "w2d13e1",
        title: "Core Stability + Stretch",
        type: "video",
        duration: "25 min",
        url: "https://www.youtube.com/embed/5gGqQVGbIYM",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 14,
    title: "FOAM ROLL RECOVERY",
    description: "Recuperação com foam roller",
    exercises: [
      {
        id: "w2d14e1",
        title: "Foam Roll Recovery",
        type: "video",
        duration: "15 min",
        url: "https://www.youtube.com/embed/kuUZYUBHryw",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
]

export const week3Days: WorkoutDay[] = [
  {
    day: 15,
    title: "BARBELL STRENGTH FULL BODY",
    description: "Força com barra",
    exercises: [
      {
        id: "w3d15e1",
        title: "Barbell Strength Full Body",
        type: "video",
        duration: "35 min",
        url: "https://www.youtube.com/embed/EQJbY3eFu90",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 16,
    title: "LANDMINE COMPLEX",
    description: "Complexo com landmine",
    exercises: [
      {
        id: "w3d16e1",
        title: "Landmine Complex",
        type: "video",
        duration: "30 min",
        url: "https://www.youtube.com/embed/XX1-nL9oM2E",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 17,
    title: "MOBILITY 10 MIN DAILY",
    description: "Mobilidade diária",
    exercises: [
      {
        id: "w3d17e1",
        title: "Mobility 10 Min Daily",
        type: "video",
        duration: "10 min",
        url: "https://www.youtube.com/embed/L5MadhSA8MY",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 18,
    title: "CHEST & CORE TITAN 30",
    description: "Peito e core intenso",
    exercises: [
      {
        id: "w3d18e1",
        title: "Chest & Core TITAN 30",
        type: "video",
        duration: "30 min",
        url: "https://www.youtube.com/embed/SEqetqEW5uU",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 19,
    title: "KETTLEBELL FLOW",
    description: "Fluxo com kettlebell",
    exercises: [
      {
        id: "w3d19e1",
        title: "Kettlebell Flow",
        type: "video",
        duration: "25 min",
        url: "https://www.youtube.com/embed/61mlOpBEnGc",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 20,
    title: "RINGS WORKOUT",
    description: "Treino com argolas",
    exercises: [
      {
        id: "w3d20e1",
        title: "Rings Workout",
        type: "video",
        duration: "28 min",
        url: "https://www.youtube.com/embed/bncm3neK6cM",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 21,
    title: "DESAFIO FINAL - FULL BODY MAX OUT",
    description: "Teste final de força e resistência",
    exercises: [
      {
        id: "w3d21e1",
        title: "Desafio Final - Full Body Max Out",
        type: "video",
        duration: "40 min",
        url: "https://www.youtube.com/embed/wKMy9FEpOhw",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
]

export const extraWorkouts: WorkoutDay[] = [
  {
    day: 22,
    title: "AQUECIMENTO DIÁRIO",
    description: "Warm Up 10min",
    exercises: [
      {
        id: "extra1",
        title: "Aquecimento Diário (Warm Up 10min)",
        type: "video",
        duration: "10 min",
        url: "https://www.youtube.com/embed/9eydA0oKJa0",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 23,
    title: "ALONGAMENTO PÓS-TREINO",
    description: "Stretch 15min",
    exercises: [
      {
        id: "extra2",
        title: "Alongamento Pós-Treino (Stretch 15min)",
        type: "video",
        duration: "15 min",
        url: "https://www.youtube.com/embed/HtJv4Gv5HTQ",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 24,
    title: "TREINO EXPRESS 15MIN",
    description: "Sem equipamento",
    exercises: [
      {
        id: "extra3",
        title: "Treino Express 15min (sem equipamento)",
        type: "video",
        duration: "15 min",
        url: "https://www.youtube.com/embed/Red2IPV9e68",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
  {
    day: 25,
    title: "TREINO DE CORE E ABDÔMEN",
    description: "20min intenso",
    exercises: [
      {
        id: "extra4",
        title: "Treino de Core e Abdômen (20min)",
        type: "video",
        duration: "20 min",
        url: "https://www.youtube.com/embed/omaC1Bvv80o",
        completed: false,
      },
    ],
    completed: false,
    isToday: false,
    isLocked: false,
  },
]
