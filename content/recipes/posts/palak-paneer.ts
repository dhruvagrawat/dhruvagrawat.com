import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "palak-paneer",
  title: "Palak Paneer",
  description:
    "Bright green palak paneer: fresh spinach blanched and blended into a smooth, gently spiced gravy with soft paneer cubes — with the trick to keep the colour vibrant.",
  date: "2026-07-05",
  category: "Main course",
  cuisine: "North Indian",
  difficulty: "Easy",
  vegetarian: true,
  tags: ["North Indian", "Paneer", "Spinach", "Vegetarian", "Healthy", "Dinner"],
  keywords: ["palak paneer recipe", "green palak paneer", "spinach paneer", "restaurant style palak paneer", "healthy paneer curry"],
  prepTime: 15,
  cookTime: 25,
  servings: 4,
  intro: `Palak paneer should be a vivid green, not a murky olive. The trick is simple: blanch the spinach for just two minutes, shock it in ice water to lock in the colour, and add the purée at the very end so it only warms through.`,
  ingredientGroups: [
    {
      title: "Spinach purée",
      items: [
        "500 g fresh spinach (palak), thick stems removed",
        "2 green chillies",
        "Ice water",
      ],
    },
    {
      title: "Gravy",
      items: [
        "250 g paneer, cut into cubes",
        "2 tbsp ghee or oil",
        "1 tsp cumin seeds",
        "1 medium onion, finely chopped",
        "1 tbsp ginger-garlic paste",
        "1 medium tomato, finely chopped",
        "½ tsp Kashmiri red chilli powder",
        "1 tsp coriander powder",
        "½ tsp garam masala",
        "1 tsp kasuri methi, crushed",
        "2 tbsp fresh cream (plus more to serve)",
        "Salt to taste",
      ],
    },
    {
      title: "Tempering (optional)",
      items: ["1 tbsp ghee", "2 garlic cloves, finely chopped", "A pinch of Kashmiri chilli powder"],
    },
  ],
  steps: [
    {
      title: "Blanch and blend the spinach",
      items: [
        "Wash the spinach well in several changes of water to remove grit.",
        "Bring a large pot of water to a boil, add the spinach and green chillies and blanch for exactly 2 minutes.",
        "Immediately transfer to a bowl of ice water for 2 minutes. This stops the cooking and keeps it bright green.",
        "Squeeze out a little water and blend to a smooth purée, adding a splash of the cold water if needed.",
      ],
    },
    {
      title: "Cook the masala",
      items: [
        "Heat the ghee in a pan. Add the cumin seeds and let them splutter.",
        "Add the onion and cook until golden, about 6–7 minutes. Add the ginger-garlic paste and cook for 1 minute.",
        "Add the tomato, chilli powder, coriander powder and salt. Cook until the tomato breaks down and the masala leaves the sides of the pan, about 5 minutes.",
      ],
    },
    {
      title: "Finish",
      items: [
        "Soak the paneer cubes in hot water for 5 minutes to soften, then drain.",
        "Lower the heat, add the spinach purée and ½ cup water, and stir well. Heat for just 2–3 minutes — don't let it boil for long or the colour dulls.",
        "Add the paneer, garam masala, kasuri methi and cream. Simmer for 1–2 minutes.",
        "For the optional tempering, heat the ghee, fry the garlic until golden, add the chilli powder and pour over the palak paneer. Serve with roti, naan or jeera rice.",
      ],
    },
  ],
  tips: [
    "Blanch for 2 minutes, not more — overcooked spinach turns dark and bitter.",
    "Add the spinach last and only warm it through; long boiling kills the colour.",
    "A few leaves of fresh methi or a handful of coriander in the blender adds depth.",
    "For a vegan version, swap paneer for tofu and cream for cashew cream.",
  ],
})
