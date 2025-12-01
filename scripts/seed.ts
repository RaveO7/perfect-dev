import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Channels récurrents (au moins 3 vidéos chacun)
const channels = [
  "Premium Studio",
  "Action Films",
  "Romance Channel",
  "Sci-Fi Network",
  "Comedy Central",
  "Mystery TV",
  "Drama Network",
  "Horror Channel"
]

// Pornstars récurrents (au moins 3 vidéos chacun)
const pornstars = [
  "Emma Stone",
  "Scarlett Johansson",
  "Emma Watson",
  "Zoe Saldana",
  "Jennifer Lawrence",
  "Natalie Portman",
  "Cate Blanchett",
  "Mia Goth",
  "Anya Taylor-Joy",
  "Lady Gaga"
]

// Catégories
const categories = [
  "Romance",
  "Drama",
  "Action",
  "Thriller",
  "Sci-Fi",
  "Fantasy",
  "Comedy",
  "Entertainment",
  "Mystery",
  "Horror",
  "Music",
  "Documentary",
  "Nature",
  "Sports",
  "Cooking",
  "Travel",
  "Technology",
  "Fashion",
  "Gaming",
  "Art",
  "Fitness",
  "Wildlife",
  "History",
  "Animation",
  "News",
  "Reality"
]

// Fonction pour générer des vidéos avec des channels et pornstars récurrents
function generateTestVideos() {
  const videos = []
  let videoId = 1

  // Créer 4-5 vidéos pour chaque channel (pour avoir au moins 3)
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i]
    const numVideos = 4 + Math.floor(Math.random() * 2) // 4 ou 5 vidéos par channel
    
    for (let j = 0; j < numVideos; j++) {
      // Sélectionner 1-2 pornstars aléatoires
      const selectedPornstars = []
      const numPornstars = Math.random() > 0.5 ? 2 : 1
      const shuffledPornstars = [...pornstars].sort(() => 0.5 - Math.random())
      for (let k = 0; k < numPornstars && k < shuffledPornstars.length; k++) {
        selectedPornstars.push(shuffledPornstars[k])
      }

      // Sélectionner 2-3 catégories aléatoires
      const selectedCategories = []
      const numCategories = 2 + Math.floor(Math.random() * 2) // 2 ou 3 catégories
      const shuffledCategories = [...categories].sort(() => 0.5 - Math.random())
      for (let k = 0; k < numCategories && k < shuffledCategories.length; k++) {
        selectedCategories.push(shuffledCategories[k])
      }

      const hours = Math.floor(Math.random() * 2) // 0 ou 1 heure
      const minutes = 15 + Math.floor(Math.random() * 45) // 15-60 minutes
      const time = hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `0:${minutes.toString().padStart(2, '0')}`

      videos.push({
        title: `${channel} - Episode ${j + 1} - ${selectedPornstars[0] || 'Featured'}`,
        description: `An amazing production from ${channel} featuring ${selectedPornstars.join(' and ')}. High-quality content with stunning visuals and performances.`,
        imgUrl: `https://via.placeholder.com/800x450?text=${encodeURIComponent(channel)}+${videoId}`,
        videoUrl: `https://example.com/video${videoId}.mp4`,
        time: time,
        actors: selectedPornstars.join(','),
        channels: channel,
        categories: selectedCategories.join(','),
        like: 500 + Math.floor(Math.random() * 4000),
        dislike: Math.floor(Math.random() * 200),
        view: 5000 + Math.floor(Math.random() * 50000),
        repport: Math.floor(Math.random() * 10)
      })
      videoId++
    }
  }

  // Ajouter des vidéos supplémentaires pour certains pornstars (pour avoir au moins 3 vidéos par pornstar)
  const pornstarVideoCount: { [key: string]: number } = {}
  
  // Compter les vidéos existantes par pornstar
  videos.forEach(video => {
    if (video.actors) {
      video.actors.split(',').forEach(actor => {
        const trimmed = actor.trim()
        if (trimmed) {
          pornstarVideoCount[trimmed] = (pornstarVideoCount[trimmed] || 0) + 1
        }
      })
    }
  })

  // Ajouter des vidéos pour les pornstars qui ont moins de 3 vidéos
  for (const pornstar of pornstars) {
    const currentCount = pornstarVideoCount[pornstar] || 0
    if (currentCount < 3) {
      const needed = 3 - currentCount
      for (let i = 0; i < needed; i++) {
        const randomChannel = channels[Math.floor(Math.random() * channels.length)]
        const randomCategories = []
        const numCategories = 2 + Math.floor(Math.random() * 2)
        const shuffledCategories = [...categories].sort(() => 0.5 - Math.random())
        for (let k = 0; k < numCategories && k < shuffledCategories.length; k++) {
          randomCategories.push(shuffledCategories[k])
        }

        const hours = Math.floor(Math.random() * 2)
        const minutes = 15 + Math.floor(Math.random() * 45)
        const time = hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `0:${minutes.toString().padStart(2, '0')}`

        videos.push({
          title: `${pornstar} - Exclusive Scene ${i + 1}`,
          description: `Exclusive content featuring ${pornstar}. Premium quality production with amazing performances.`,
          imgUrl: `https://via.placeholder.com/800x450?text=${encodeURIComponent(pornstar)}+${videoId}`,
          videoUrl: `https://example.com/video${videoId}.mp4`,
          time: time,
          actors: pornstar,
          channels: randomChannel,
          categories: randomCategories.join(','),
          like: 500 + Math.floor(Math.random() * 4000),
          dislike: Math.floor(Math.random() * 200),
          view: 5000 + Math.floor(Math.random() * 50000),
          repport: Math.floor(Math.random() * 10)
        })
        videoId++
      }
    }
  }

  return videos
}

async function main() {
  console.log('🌱 Début de l\'insertion des données de test...')

  // Nettoyer les données existantes
  console.log('🧹 Nettoyage des anciennes données...')
  await prisma.categorie.deleteMany()
  await prisma.channel.deleteMany()
  await prisma.actor.deleteMany()
  await prisma.videos.deleteMany()

  // Générer les vidéos de test
  console.log('📹 Génération des vidéos de test...')
  const testVideos = generateTestVideos()

  // Insérer les vidéos
  console.log('💾 Insertion des vidéos...')
  for (const video of testVideos) {
    const createdVideo = await prisma.videos.create({
      data: {
        title: video.title,
        description: video.description,
        imgUrl: video.imgUrl,
        videoUrl: video.videoUrl,
        time: video.time,
        actors: video.actors,
        channels: video.channels,
        categories: video.categories,
        like: video.like,
        dislike: video.dislike,
        view: video.view,
        repport: video.repport,
      }
    })

    // Insérer les acteurs dans la table Actor
    if (video.actors) {
      const actorsList = video.actors.split(',').filter(a => a.trim() !== '')
      for (const actor of actorsList) {
        await prisma.actor.create({
          data: {
            idVideo: createdVideo.id,
            name: actor.trim()
          }
        }).catch(() => {
          // Ignore les doublons
        })
      }
    }

    // Insérer les chaînes dans la table Channel
    if (video.channels) {
      const channelsList = video.channels.split(',').filter(c => c.trim() !== '')
      for (const channel of channelsList) {
        await prisma.channel.create({
          data: {
            idVideo: createdVideo.id,
            name: channel.trim()
          }
        }).catch(() => {
          // Ignore les doublons
        })
      }
    }

    // Insérer les catégories dans la table Categorie
    if (video.categories) {
      const categoriesList = video.categories.split(',').filter(c => c.trim() !== '')
      for (const categorie of categoriesList) {
        await prisma.categorie.create({
          data: {
            idVideo: createdVideo.id,
            name: categorie.trim()
          }
        }).catch(() => {
          // Ignore les doublons
        })
      }
    }
  }

  console.log('✨ Insertion terminée avec succès!')
  console.log(`📊 Statistiques:`)
  console.log(`   - ${testVideos.length} vidéos créées`)
  
  const actorCount = await prisma.actor.count()
  const channelCount = await prisma.channel.count()
  const categorieCount = await prisma.categorie.count()
  
  // Compter les channels uniques avec au moins 3 vidéos
  const channelsWithMinVideos = await prisma.$queryRawUnsafe<Array<{ name: string, count: bigint }>>(
    `SELECT name, COUNT(*) as count
     FROM Channel
     GROUP BY name
     HAVING COUNT(*) >= 3`
  )
  
  // Compter les pornstars uniques avec au moins 3 vidéos
  const pornstarsWithMinVideos = await prisma.$queryRawUnsafe<Array<{ name: string, count: bigint }>>(
    `SELECT name, COUNT(*) as count
     FROM Actor
     GROUP BY name
     HAVING COUNT(*) >= 3`
  )
  
  console.log(`   - ${actorCount} acteurs (${pornstarsWithMinVideos.length} avec ≥3 vidéos)`)
  console.log(`   - ${channelCount} chaînes (${channelsWithMinVideos.length} avec ≥3 vidéos)`)
  console.log(`   - ${categorieCount} catégories`)
  
  console.log(`\n📺 Channels disponibles:`)
  channelsWithMinVideos.forEach(ch => {
    console.log(`   - ${ch.name} (${ch.count} vidéos)`)
  })
  
  console.log(`\n⭐ Pornstars disponibles:`)
  pornstarsWithMinVideos.forEach(ps => {
    console.log(`   - ${ps.name} (${ps.count} vidéos)`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'insertion:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
