import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "punjabi-chole-masala",
  title: "Punjabi Chole Masala",
  description:
    "Dark, tangy, dhaba-style Punjabi chole: chickpeas cooked with tea for colour, then simmered in a deeply browned onion-tomato masala.",
  date: "2026-09-06",
  category: "Main course",
  cuisine: "North Indian",
  difficulty: "Easy",
  vegetarian: true,
  tags: ["North Indian", "Punjabi", "Chickpeas", "Vegetarian", "Vegan", "Street Food"],
  keywords: ["chole recipe", "punjabi chole", "chole masala recipe", "chana masala", "chole bhature chole"],
  prepTime: 15,
  cookTime: 50,
  servings: 4,
  intro: `This is the chole of Delhi and Punjab — the one that comes with bhature or kulche from a street stall: dark brown, tangy, spicy and full of flavour. Two small tricks give it that colour and depth: cooking the chickpeas with a tea bag and black cardamom, and browning the onions properly before anything else goes in.

*Plan ahead: the chickpeas need to soak for 8 hours or overnight.*`,
  ingredientGroups: [
    {
      title: "Chickpeas",
      items: [
        "1½ cups (300 g) dried kabuli chana (white chickpeas)",
        "1 tea bag (or 2 tsp loose tea tied in muslin)",
        "2 black cardamoms",
        "1 bay leaf",
        "1 tsp salt",
        "4 cups water",
      ],
    },
    {
      title: "Masala",
      items: [
        "3 tbsp oil or ghee",
        "1 tsp cumin seeds",
        "2 medium onions, finely chopped",
        "1 tbsp ginger-garlic paste",
        "2 green chillies, chopped",
        "2 medium tomatoes, puréed",
        "1 tsp Kashmiri red chilli powder",
        "1½ tsp coriander powder",
        "2 tbsp chole masala (store-bought is fine)",
        "1 tsp amchur (dry mango powder) or 1 tsp anardana powder",
        "½ tsp garam masala",
        "Salt to taste",
      ],
    },
    {
      title: "To serve",
      items: ["Ginger juliennes", "Sliced onion rings", "Fresh coriander", "Lemon wedges", "A knob of butter (optional)"],
    },
  ],
  steps: [
    {
      title: "Soak and cook the chickpeas",
      items: [
        "Rinse the chickpeas and soak in plenty of water for 8 hours or overnight. They'll double in size.",
        "Drain and add to a pressure cooker with 4 cups water, the tea bag, black cardamoms, bay leaf and salt.",
        "Cook on high for 1 whistle, then on low for 15–20 minutes, until the chickpeas are very soft and easily crushed between your fingers. Remove the tea bag and whole spices; keep the dark cooking water.",
      ],
    },
    {
      title: "Brown the masala",
      items: [
        "Heat the oil in a heavy pan. Add the cumin seeds and let them crackle.",
        "Add the onions and cook over medium heat, stirring, until deep golden-brown — 10–12 minutes. This is where the flavour comes from, so don't rush it.",
        "Add the ginger-garlic paste and green chillies and cook for 1 minute.",
        "Add the tomato purée, chilli powder, coriander powder and chole masala. Cook until the masala is thick, darkens and releases oil, 8–10 minutes.",
      ],
    },
    {
      title: "Simmer",
      items: [
        "Add the chickpeas with 1½ cups of their cooking water. Bring to a boil.",
        "Mash a few chickpeas against the side of the pan to thicken the gravy. Add the amchur and salt.",
        "Simmer on low for 15–20 minutes so the chickpeas soak up the masala. Add more cooking water if it gets too thick.",
        "Stir in the garam masala. Top with ginger juliennes, onion rings, coriander and a squeeze of lemon, plus a knob of butter if you like. Serve with bhature, kulche, puri or rice.",
      ],
    },
  ],
  tips: [
    "The tea bag gives the classic dark colour without changing the taste — don't skip it.",
    "Soft chickpeas are essential: they should almost melt. Add a pinch of baking soda to the soak if your chickpeas are old and stubborn.",
    "Chole tastes even better the next day, once the spices have settled in.",
    "It's naturally vegan if you use oil instead of ghee and skip the butter.",
  ],
})
