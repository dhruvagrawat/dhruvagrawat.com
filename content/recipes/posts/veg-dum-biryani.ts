import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "veg-dum-biryani",
  title: "Veg Dum Biryani",
  description:
    "Fragrant layered veg dum biryani: spiced yogurt-marinated vegetables, basmati, fried onions, mint and saffron, sealed and slow-steamed.",
  date: "2026-04-12",
  category: "Rice",
  cuisine: "North Indian",
  difficulty: "Involved",
  vegetarian: true,
  tags: ["Biryani", "Rice", "Vegetarian", "Indian", "Festive", "Dinner"],
  keywords: ["veg biryani recipe", "veg dum biryani", "vegetable biryani", "hyderabadi veg biryani", "layered biryani"],
  prepTime: 40,
  cookTime: 50,
  servings: 5,
  intro: `A great biryani is about layers and patience: vegetables marinated in yogurt and spices, basmati cooked only three-quarters of the way, crisp brown onions, mint, saffron milk and ghee — all sealed in one pot and finished slowly on *dum* (steam), so the rice absorbs every aroma.

It's a weekend project, but none of the steps are difficult. Read through once, get your ingredients ready, and the rest flows.`,
  ingredientGroups: [
    {
      title: "Rice",
      items: [
        "2 cups (400 g) aged long-grain basmati rice",
        "10–12 cups water",
        "1 tbsp salt",
        "Whole spices: 1 bay leaf, 4 green cardamoms, 4 cloves, 1 small cinnamon stick, 1 star anise, 1 tsp shahi jeera (caraway)",
        "1 tsp lemon juice",
      ],
    },
    {
      title: "Vegetable marinade",
      items: [
        "400 g mixed vegetables: carrot, beans, cauliflower florets, peas, potato (cut into bite-size pieces)",
        "100 g paneer cubes (optional)",
        "1 cup thick yogurt, whisked",
        "1 tbsp ginger-garlic paste",
        "2 green chillies, slit",
        "1½ tsp Kashmiri red chilli powder",
        "¼ tsp turmeric",
        "2 tsp biryani masala or garam masala",
        "Half of the fried onions (below)",
        "A handful each of mint and coriander leaves, chopped",
        "1 tbsp lemon juice",
        "1 tsp salt",
      ],
    },
    {
      title: "Layering",
      items: [
        "2 large onions, thinly sliced (for birista / fried onions)",
        "Oil for frying the onions",
        "3 tbsp ghee",
        "A generous pinch of saffron soaked in ¼ cup warm milk",
        "A handful of mint and coriander leaves",
        "½ tsp kewra or rose water (optional)",
      ],
    },
  ],
  steps: [
    {
      title: "Prepare",
      items: [
        "Wash the rice gently 3–4 times until the water runs clear, then soak for 30 minutes.",
        "Fry the sliced onions in oil over medium heat, stirring, until deep golden-brown and crisp (12–15 minutes). Drain on paper. Keep 2 tbsp of the onion oil.",
      ],
    },
    {
      title: "Marinate the vegetables",
      items: [
        "Mix all the marinade ingredients with half the fried onions and the vegetables. Set aside for 30 minutes while you cook the rice.",
      ],
    },
    {
      title: "Parboil the rice",
      items: [
        "Bring the water to a rolling boil with the salt, whole spices and lemon juice. The water should taste salty like the sea.",
        "Drain the soaked rice and add it. Boil for 4–5 minutes until the rice is about 70% cooked — it should break when pressed, with a firm white core. Drain immediately.",
      ],
    },
    {
      title: "Cook the vegetable layer",
      items: [
        "In a heavy-bottomed pot, heat the 2 tbsp onion oil. Add the marinated vegetables and cook on medium for 8–10 minutes, stirring, until the vegetables are just tender and the gravy has thickened. Spread evenly.",
      ],
    },
    {
      title: "Layer and dum",
      items: [
        "Spread half the rice over the vegetables. Scatter half the remaining fried onions, mint and coriander, and drizzle over half the saffron milk and 1 tbsp ghee.",
        "Add the rest of the rice, then the remaining onions, herbs, saffron milk, kewra water and ghee.",
        "Seal the pot: cover with a tight lid lined with foil, or seal the edge with a rope of dough.",
        "Cook on high for 3–4 minutes, then place the pot on a flat tawa (griddle) over the lowest heat for 20–25 minutes. The tawa stops the bottom from burning.",
        "Turn off the heat and rest for 10 minutes before opening. Fluff gently from the sides with a wide spoon to keep the layers, and serve with raita and salan or salad.",
      ],
    },
  ],
  tips: [
    "Use aged basmati — it stays long and separate. New rice turns sticky.",
    "70% cooked is the key number: the rice finishes on dum. Fully cooked rice turns mushy.",
    "Crisp, well-browned onions (birista) give biryani most of its depth. Don't rush them.",
    "A heavy-bottomed pot and the tawa underneath prevent a burnt base during dum.",
  ],
})
