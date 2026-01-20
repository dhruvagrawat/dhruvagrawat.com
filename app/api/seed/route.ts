import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore cookie setting errors
            }
          },
        },
      }
    )

    // Seed Recipes
    const recipes = [
      {
        title: "Paneer Butter Masala",
        slug: "paneer-butter-masala",
        description: "A rich and creamy North Indian curry made with paneer cheese in a tomato-based sauce.",
        image_url: "/images/paneer-butter-masala.jpg",
        category: "Indian",
        tags: ["Indian", "Vegetarian", "Curry"],
        cook_time: 45,
        servings: 4,
        ingredients: JSON.stringify([
          "500g paneer, cubed",
          "2 onions, finely chopped",
          "3 tomatoes, pureed",
          "2 tbsp butter",
          "1 tbsp ginger-garlic paste",
          "1 tsp red chili powder",
          "1 tsp garam masala",
          "1/2 cup cream",
          "Salt to taste",
        ]),
        directions: JSON.stringify([
          "Heat butter in a pan and add the chopped onions. Sauté until golden brown.",
          "Add ginger-garlic paste and sauté for another minute.",
          "Add tomato puree, red chili powder, and salt. Cook until the oil separates.",
          "Add paneer cubes and gently mix.",
          "Pour in cream and simmer for 5 minutes.",
          "Sprinkle garam masala and serve hot with naan or rice.",
        ]),
      },
      {
        title: "Spaghetti Carbonara",
        slug: "spaghetti-carbonara",
        description: "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
        image_url: "/images/spaghetti-carbonara.jpg",
        category: "Italian",
        tags: ["Italian", "Pasta", "Quick"],
        cook_time: 30,
        servings: 2,
        ingredients: JSON.stringify([
          "200g spaghetti",
          "100g pancetta or guanciale, diced",
          "2 large eggs",
          "50g Pecorino Romano, grated",
          "50g Parmigiano Reggiano, grated",
          "Freshly ground black pepper",
          "Salt for pasta water",
        ]),
        directions: JSON.stringify([
          "Bring a large pot of salted water to boil and cook spaghetti according to package instructions.",
          "While pasta cooks, sauté pancetta in a large pan until crispy.",
          "In a bowl, whisk eggs and mix in the grated cheeses and black pepper.",
          "Drain pasta, reserving some pasta water, and immediately add to the pan with pancetta.",
          "Remove pan from heat and quickly stir in the egg and cheese mixture, creating a creamy sauce.",
          "If needed, add a splash of reserved pasta water to loosen the sauce.",
          "Serve immediately with extra grated cheese and black pepper.",
        ]),
      },
      {
        title: "Chocolate Lava Cake",
        slug: "chocolate-lava-cake",
        description: "A decadent warm chocolate cake with a molten center, perfect for dessert lovers.",
        image_url: "/images/chocolate-cake.jpg",
        category: "Dessert",
        tags: ["Dessert", "Chocolate", "Indulgent"],
        cook_time: 15,
        servings: 2,
        ingredients: JSON.stringify([
          "100g dark chocolate (70% cocoa)",
          "100g butter",
          "2 eggs",
          "2 egg yolks",
          "25g sugar",
          "30g flour",
          "Pinch of salt",
          "Butter for greasing",
        ]),
        directions: JSON.stringify([
          "Preheat oven to 200°C and butter 2 ramekins.",
          "Melt chocolate and butter together over a double boiler.",
          "Whisk eggs, egg yolks, and sugar until pale and thick.",
          "Fold chocolate mixture into eggs, then gently fold in flour and salt.",
          "Divide batter between ramekins.",
          "Bake for 12-14 minutes until edges are set but center is soft.",
          "Serve immediately with vanilla ice cream.",
        ]),
      },
    ]

    // Seed Blogs
    const blogs = [
      {
        title: "The Art of Mindful Cooking",
        slug: "art-of-mindful-cooking",
        description: "Discover how cooking can become a form of meditation and mindfulness practice.",
        image_url: "/images/blog-mindful-cooking.jpg",
        content: "Cooking is not just about preparing food; it's about being present in the moment. When you focus on the textures, aromas, and colors of your ingredients, you engage your senses fully. This mindful approach to cooking can reduce stress, increase enjoyment, and create deeper connections with the food we consume.",
        author: "Dhruv Agarwat",
        tags: ["Cooking", "Mindfulness", "Wellness"],
        read_time: 5,
      },
      {
        title: "Digital Wellness in a Connected World",
        slug: "digital-wellness-connected-world",
        description: "Practical tips for maintaining mental health while staying connected online.",
        image_url: "/images/blog-digital-wellness.jpg",
        content: "In today's hyper-connected world, digital wellness is crucial. Setting boundaries with technology, taking regular digital detoxes, and being intentional about our online consumption can significantly improve our mental health and productivity.",
        author: "Dhruv Agarwat",
        tags: ["Technology", "Wellness", "Digital"],
        read_time: 7,
      },
      {
        title: "Travel Stories: Finding Magic in Every Journey",
        slug: "travel-stories-finding-magic",
        description: "Reflections on unforgettable travel experiences and cultural discoveries.",
        image_url: "/images/blog-travel-stories.jpg",
        content: "Travel opens our minds to new perspectives and cultures. Every journey tells a story - from the friendships formed with locals to the unexpected discoveries in hidden corners of cities. These experiences shape who we are and broaden our understanding of the world.",
        author: "Dhruv Agarwat",
        tags: ["Travel", "Adventure", "Culture"],
        read_time: 6,
      },
    ]

    // Seed Articles
    const articles = [
      {
        title: "The Future of Artificial Intelligence in Healthcare",
        slug: "future-ai-healthcare",
        description: "Exploring how AI technologies are transforming diagnosis, treatment, and patient care.",
        image_url: "/images/article-ai-healthcare.jpg",
        content: "Artificial Intelligence is revolutionizing healthcare through predictive diagnostics, personalized treatment plans, and administrative automation. Machine learning algorithms can now detect diseases like cancer earlier than human radiologists in many cases.",
        author: "Dhruv Agarwat",
        tags: ["Technology", "Healthcare", "AI"],
        read_time: 12,
      },
      {
        title: "Understanding Quantum Computing: A Beginner's Guide",
        slug: "quantum-computing-guide",
        description: "A simplified explanation of quantum computing principles and their potential impact.",
        image_url: "/images/article-quantum-computing.jpg",
        content: "Quantum computers harness the power of quantum mechanics to process information in fundamentally different ways than classical computers. Unlike traditional bits that are either 0 or 1, quantum bits (qubits) can exist in superposition, allowing quantum computers to explore multiple possibilities simultaneously.",
        author: "Dhruv Agarwat",
        tags: ["Technology", "Quantum", "Science"],
        read_time: 15,
      },
      {
        title: "Web3 and the Future of the Internet",
        slug: "web3-future-internet",
        description: "Understanding decentralization, blockchain, and the next evolution of the web.",
        image_url: "/images/article-web3-future.jpg",
        content: "Web3 represents a paradigm shift in how we interact with the internet. Built on blockchain technology and decentralized protocols, Web3 aims to return data ownership and control to users, creating a more transparent and equitable digital ecosystem.",
        author: "Dhruv Agarwat",
        tags: ["Technology", "Blockchain", "Web3"],
        read_time: 10,
      },
    ]

    // Seed Music
    const music = [
      {
        title: "Midnight Serenity",
        slug: "midnight-serenity",
        image_url: "/images/music-lofi-beats.jpg",
        tags: ["Lofi", "Instrumental", "Relaxing"],
        artist: "Dhruv Agarwat",
        audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        album: "Midnight Sessions",
        duration: 180,
      },
      {
        title: "Neon Dreams",
        slug: "neon-dreams",
        image_url: "/images/music-synthwave.jpg",
        tags: ["Synthwave", "Electronic", "Retro"],
        artist: "Dhruv Agarwat",
        audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        album: "Neon Nights",
        duration: 210,
      },
      {
        title: "Ambient Bliss",
        slug: "ambient-bliss",
        image_url: "/images/music-ambient-chill.jpg",
        tags: ["Ambient", "Chill", "Meditative"],
        artist: "Dhruv Agarwat",
        audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        album: "Peaceful Moments",
        duration: 240,
      },
    ]

    // Insert recipes
    const { error: recipeError } = await supabase.from("recipes").insert(recipes)
    if (recipeError) throw new Error(`Recipe insert error: ${recipeError.message}`)

    // Insert blogs
    const { error: blogError } = await supabase.from("blogs").insert(blogs)
    if (blogError) throw new Error(`Blog insert error: ${blogError.message}`)

    // Insert articles
    const { error: articleError } = await supabase.from("articles").insert(articles)
    if (articleError) throw new Error(`Article insert error: ${articleError.message}`)

    // Insert music
    const { error: musicError } = await supabase.from("music").insert(music)
    if (musicError) throw new Error(`Music insert error: ${musicError.message}`)

    return Response.json(
      { message: "Data seeded successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Seed error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Seeding failed" },
      { status: 500 }
    )
  }
}
