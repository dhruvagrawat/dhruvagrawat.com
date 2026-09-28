import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "pesto-alla-genovese",
  title: "Pesto alla Genovese with Trofie, Potatoes and Green Beans",
  description:
    "Authentic Genoese basil pesto made the Ligurian way — basil, pine nuts, garlic, Parmigiano, Pecorino and olive oil — served with trofie, potatoes and green beans cooked in the same pot.",
  date: "2026-06-14",
  category: "Pasta",
  cuisine: "Italian",
  difficulty: "Easy",
  vegetarian: false,
  tags: ["Italian", "Pasta", "Pesto", "Basil", "Summer"],
  keywords: ["pesto recipe", "authentic pesto genovese", "basil pesto", "trofie al pesto", "homemade pesto"],
  prepTime: 20,
  cookTime: 15,
  servings: 4,
  intro: `Pesto comes from Genoa, on the Ligurian coast, and its name comes from *pestare* — to pound. Traditionally it's made in a marble mortar with a wooden pestle, which crushes the basil instead of chopping it and keeps the sauce bright green and sweet.

In Liguria it's served the way below: with twisted trofie pasta, boiled potatoes and green beans all cooked in the same pot. It sounds odd; it's perfect.`,
  ingredientGroups: [
    {
      title: "Pesto",
      items: [
        "50 g fresh basil leaves (young, small leaves are best)",
        "30 g pine nuts",
        "1 small garlic clove",
        "A pinch of coarse sea salt",
        "50 g Parmigiano Reggiano, finely grated",
        "25 g Pecorino (Fiore Sardo or Romano), finely grated",
        "80–100 ml mild extra-virgin olive oil",
      ],
    },
    {
      title: "Pasta",
      items: [
        "400 g trofie (or linguine)",
        "1 medium waxy potato, peeled and cut into 1 cm cubes",
        "150 g green beans, trimmed and cut into 3 cm pieces",
        "Salt",
      ],
    },
  ],
  steps: [
    {
      title: "Make the pesto",
      items: [
        "Wash the basil gently and pat it completely dry — water turns pesto dark.",
        "In a mortar, pound the garlic with the coarse salt to a paste. Add the pine nuts and pound until creamy.",
        "Add the basil a handful at a time and grind with a circular motion against the sides of the mortar, rather than bashing, until you have a bright green paste.",
        "Stir in both cheeses, then drizzle in the olive oil slowly, stirring, until creamy.",
        "Using a food processor instead? Chill the blade, use the pulse button in short bursts, and stir in the cheese and oil by hand at the end so the basil doesn't heat up and darken.",
      ],
    },
    {
      title: "Cook the pasta, potatoes and beans",
      items: [
        "Bring a large pot of salted water to the boil. Add the potato cubes and cook for 5 minutes.",
        "Add the trofie and the green beans, and cook until the pasta is al dente (check the packet — usually 8–10 minutes for dried trofie).",
        "Scoop out a mug of pasta water, then drain everything.",
      ],
    },
    {
      title: "Dress and serve",
      items: [
        "In a large bowl, loosen the pesto with 2–3 tbsp of the pasta water.",
        "Add the pasta, potatoes and beans and toss well, adding more water if needed so it's creamy rather than oily. Never heat pesto in a pan — it loses its colour and aroma.",
        "Serve with a little extra Parmigiano.",
      ],
    },
  ],
  tips: [
    "Pesto oxidises quickly. If you're storing it, press cling film onto the surface or cover with a thin layer of oil; it keeps 2–3 days in the fridge or 3 months frozen (freeze without the cheese).",
    "In India, pine nuts are pricey — cashews or walnuts make a good, less traditional substitute.",
    "The potatoes release starch that helps the pesto cling — don't skip them.",
    "Parmigiano and Pecorino are made with animal rennet. For strictly vegetarian pesto, use a vegetarian hard cheese.",
  ],
})
