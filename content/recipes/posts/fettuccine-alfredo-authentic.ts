import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "fettuccine-alfredo-authentic",
  title: "Fettuccine Alfredo (the Original, No Cream)",
  description:
    "The real Roman fettuccine Alfredo — fettuccine al burro — made with just butter, Parmigiano Reggiano and starchy pasta water, emulsified into a silky sauce. Three ingredients, 15 minutes.",
  date: "2025-11-09",
  category: "Pasta",
  cuisine: "Italian",
  difficulty: "Medium",
  vegetarian: false,
  tags: ["Italian", "Pasta", "Quick", "Classic"],
  keywords: ["fettuccine alfredo recipe", "authentic alfredo", "alfredo without cream", "fettuccine al burro", "original alfredo sauce"],
  prepTime: 5,
  cookTime: 15,
  servings: 4,
  intro: `The Alfredo you know from restaurant menus — thick, heavy, full of cream — is an American invention. The original, created in Rome in the early 1900s, is **fettuccine al burro**: fresh fettuccine tossed with butter and Parmigiano Reggiano until they melt together with a little pasta water into a light, glossy sauce.

It's all technique. The starch in the pasta water is what turns butter and cheese into a sauce instead of an oily clump, so read the steps once before you start.`,
  ingredientGroups: [
    {
      title: "Ingredients",
      items: [
        "400 g fettuccine (fresh egg fettuccine is best; good dried works)",
        "100 g good unsalted butter, cut into cubes and softened",
        "120 g Parmigiano Reggiano (ideally aged 24 months), very finely grated, plus extra to serve",
        "Salt",
        "Freshly ground black pepper (optional)",
      ],
    },
  ],
  steps: [
    {
      title: "Get everything ready",
      items: [
        "Grate the Parmigiano as finely as possible — a microplane is perfect. Coarse cheese clumps instead of melting.",
        "Put the butter in a large, wide pan (big enough to toss all the pasta) and keep it off the heat for now.",
        "Bring a large pot of water to a boil and salt it — a little less than usual, as the cheese is salty.",
      ],
    },
    {
      title: "Cook and emulsify",
      items: [
        "Cook the fettuccine until just al dente (fresh pasta takes 2–3 minutes; dried, 1 minute less than the packet).",
        "Just before it's done, add 2 ladles of the cooking water to the butter and melt it over low heat, swirling, into a cloudy, creamy liquid.",
        "Lift the fettuccine straight into the pan with tongs, letting some water cling to it. Toss well in the butter.",
        "Take the pan off the heat. Add the Parmigiano a handful at a time, tossing and shaking the pan constantly, adding a splash of pasta water whenever it looks thick or sticky.",
        "Keep tossing for about a minute until the cheese melts into a smooth, glossy sauce that coats every strand.",
      ],
    },
    {
      title: "Serve",
      items: [
        "Serve immediately on warm plates, with a little more Parmigiano and black pepper if you like. This sauce waits for no one.",
      ],
    },
  ],
  tips: [
    "Add the cheese off the heat. Too much heat makes Parmigiano seize into stringy lumps.",
    "If the sauce breaks and looks oily, add a splash of hot pasta water and toss vigorously — it will come back together.",
    "Pre-grated cheese in packets contains anti-caking powder and won't melt smoothly. Grate it yourself.",
    "Parmigiano Reggiano is made with animal rennet. For a strictly vegetarian version, use a vegetarian Italian-style hard cheese.",
  ],
})
