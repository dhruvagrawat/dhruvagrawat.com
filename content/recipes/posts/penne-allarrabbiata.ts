import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "penne-allarrabbiata",
  title: "Penne all'Arrabbiata",
  description:
    "The authentic Roman arrabbiata: penne in a fiery tomato sauce made with just garlic, dried chilli, olive oil and good tomatoes. No cream, no onion — ready in 30 minutes.",
  date: "2025-10-05",
  category: "Pasta",
  cuisine: "Italian",
  difficulty: "Easy",
  vegetarian: true,
  tags: ["Italian", "Pasta", "Vegetarian", "Spicy", "Quick"],
  keywords: ["arrabbiata recipe", "authentic arrabbiata", "penne arrabbiata", "spicy tomato pasta", "Roman pasta"],
  prepTime: 5,
  cookTime: 25,
  servings: 4,
  intro: `*Arrabbiata* means "angry" in Italian — a nod to the heat of the chilli. It's a Roman classic, and like most Roman pasta it's built on very few ingredients, so each one matters: ripe or good tinned tomatoes, plenty of extra-virgin olive oil, fresh garlic and dried red chilli (*peperoncino*).

What it *doesn't* have: cream, onions, bell peppers or a pile of dried herbs. The only green is a handful of fresh parsley at the end.`,
  ingredientGroups: [
    {
      title: "Ingredients",
      items: [
        "400 g penne rigate",
        "800 g peeled plum tomatoes (2 tins, San Marzano if you can find them)",
        "5 tbsp extra-virgin olive oil, plus more to finish",
        "4 garlic cloves, thinly sliced",
        "1–2 tsp dried red chilli flakes, or 2–3 whole dried red chillies, crumbled (to taste)",
        "A small handful of flat-leaf parsley, chopped",
        "Salt",
        "Pecorino Romano, grated, to serve (optional)",
      ],
    },
  ],
  steps: [
    {
      title: "Make the sauce",
      items: [
        "Tip the tomatoes into a bowl and crush them by hand, removing any hard cores.",
        "Put the olive oil, garlic and chilli into a wide, cold pan, then set it over medium-low heat. Let the garlic sizzle gently for 2–3 minutes until pale gold — don't let it brown or it turns bitter.",
        "Add the tomatoes and a good pinch of salt. Simmer uncovered for 15–20 minutes, stirring now and then, until the sauce thickens and the oil starts to separate at the edges.",
      ],
    },
    {
      title: "Cook the pasta",
      items: [
        "Meanwhile, bring a large pot of water to a boil and salt it generously — it should taste pleasantly salty.",
        "Cook the penne for 2 minutes less than the packet time. Before draining, scoop out a mug of the starchy pasta water.",
      ],
    },
    {
      title: "Bring it together",
      items: [
        "Drain the penne and add it straight into the sauce with a splash of pasta water.",
        "Toss over high heat for 1–2 minutes until the pasta is al dente and glossy with sauce. Add more pasta water if it looks dry.",
        "Turn off the heat, stir in the parsley and a drizzle of raw olive oil. Taste for salt and heat, and serve immediately — with grated Pecorino if you like.",
      ],
    },
  ],
  tips: [
    "Start the garlic in cold oil — it infuses the oil slowly and won't burn.",
    "Penne rigate (the ridged kind) holds the sauce far better than smooth penne.",
    "Finishing the pasta in the sauce, not just pouring sauce on top, is what makes it taste restaurant-level.",
    "For more heat, add the chilli in two stages: half with the garlic, half with the tomatoes.",
  ],
})
