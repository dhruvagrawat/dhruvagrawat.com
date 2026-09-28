import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "cacio-e-pepe",
  title: "Cacio e Pepe",
  description:
    "The Roman classic of pasta, Pecorino Romano and black pepper — with the foolproof method for a creamy, clump-free sauce. No butter, no cream, just three ingredients and technique.",
  date: "2026-02-22",
  category: "Pasta",
  cuisine: "Italian",
  difficulty: "Medium",
  vegetarian: false,
  tags: ["Italian", "Pasta", "Quick", "Classic", "Roman"],
  keywords: ["cacio e pepe recipe", "authentic cacio e pepe", "pecorino pepper pasta", "Roman pasta", "cheese and pepper pasta"],
  prepTime: 10,
  cookTime: 15,
  servings: 4,
  intro: `*Cacio e pepe* means "cheese and pepper", and that's all there is: Pecorino Romano, black pepper and pasta. Shepherds in the Roman countryside carried these three ingredients because they kept for weeks.

It's famously easy to get wrong — the cheese clumps into rubbery lumps if it gets too hot. The trick is to make a smooth pecorino "cream" with slightly cooled, starchy pasta water first, and toss it with the pasta off the heat.`,
  ingredientGroups: [
    {
      title: "Ingredients",
      items: [
        "320 g spaghetti or tonnarelli",
        "200 g Pecorino Romano, very finely grated",
        "2 tsp whole black peppercorns",
        "Salt (just a little — the cheese is salty)",
      ],
    },
  ],
  steps: [
    {
      title: "Toast the pepper",
      items: [
        "Crush the peppercorns coarsely in a mortar and pestle or with the bottom of a pan.",
        "Toast them in a large, dry frying pan over medium heat for about 1 minute until fragrant. Take off the heat.",
      ],
    },
    {
      title: "Cook the pasta",
      items: [
        "Cook the pasta in a smaller amount of water than usual (about 2.5 litres) with only a light pinch of salt — less water means starchier water, which makes the sauce.",
        "Cook until 2 minutes short of al dente. Scoop out 2 mugs of pasta water before draining.",
      ],
    },
    {
      title: "Make the pecorino cream",
      items: [
        "Put the grated Pecorino in a bowl. Let a ladle of the pasta water cool for a minute, then add it a little at a time, whisking with a fork into a thick, smooth paste. It should look like loose ricotta, not a runny sauce.",
      ],
    },
    {
      title: "Toss and serve",
      items: [
        "Add a ladle of pasta water to the pepper pan and bring it to a simmer. Add the drained pasta and toss for 1–2 minutes until al dente, adding water as needed.",
        "Take the pan off the heat and wait 30 seconds. Add the pecorino cream and toss vigorously, adding splashes of pasta water until the sauce is glossy and coats every strand.",
        "Serve at once with a little extra Pecorino and a crack of pepper.",
      ],
    },
  ],
  tips: [
    "Heat is the enemy: never add the cheese to a pan on the flame.",
    "Grate the Pecorino as finely as you can — fine cheese melts, coarse cheese clumps.",
    "If the sauce goes stringy, add a splash of warm (not boiling) pasta water and keep tossing.",
    "Pecorino Romano is made with animal rennet. For strictly vegetarian diners, use a vegetarian hard cheese.",
  ],
})
