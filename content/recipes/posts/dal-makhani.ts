import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "dal-makhani",
  title: "Dal Makhani (Restaurant Style)",
  description:
    "Slow-cooked Punjabi dal makhani: whole black urad dal and rajma simmered with butter, tomatoes and cream until velvety — with the optional charcoal smoke (dhungar) for that dhaba flavour.",
  date: "2026-01-18",
  category: "Main course",
  cuisine: "North Indian",
  difficulty: "Medium",
  vegetarian: true,
  tags: ["North Indian", "Punjabi", "Dal", "Vegetarian", "Slow Cooked", "Dinner"],
  keywords: ["dal makhani recipe", "restaurant style dal makhani", "dal makhani pressure cooker", "Punjabi dal", "black dal"],
  prepTime: 15,
  cookTime: 90,
  servings: 5,
  intro: `Dal makhani is the pride of Punjabi cooking and the dish every North Indian restaurant is judged on. Whole black urad dal and a little rajma are cooked soft, then simmered slowly with butter, tomato and cream until they turn into something rich, creamy and smoky.

There's no shortcut to that texture — the long, slow simmer is the recipe. Soak overnight, cook it on a lazy Sunday, and it tastes even better the next day.

*Plan ahead: the dal needs to soak for 8–10 hours.*`,
  ingredientGroups: [
    {
      title: "Dal",
      items: [
        "1 cup (200 g) whole black urad dal (sabut kaali urad)",
        "¼ cup rajma (red kidney beans)",
        "4 cups water, plus more while simmering",
        "1 tsp salt",
      ],
    },
    {
      title: "Masala",
      items: [
        "3 tbsp butter + 1 tbsp ghee",
        "1 tsp cumin seeds",
        "1 tbsp ginger-garlic paste",
        "1 green chilli, slit",
        "1 cup fresh tomato purée (about 3 tomatoes)",
        "1½ tsp Kashmiri red chilli powder",
        "½ tsp garam masala",
        "1 tsp kasuri methi, crushed",
        "⅓ cup fresh cream, plus a little to serve",
        "Salt to taste",
      ],
    },
    {
      title: "Smoke (optional)",
      items: ["1 small piece of natural charcoal", "½ tsp ghee"],
    },
  ],
  steps: [
    {
      title: "Soak and cook the dal",
      items: [
        "Rinse the urad dal and rajma well, then soak in plenty of water for 8–10 hours or overnight.",
        "Drain, add to a pressure cooker with 4 cups of fresh water and 1 tsp salt. Cook on high for 1 whistle, then on low for 25–30 minutes (about 8–10 whistles on medium works too). The dal should be completely soft and easy to mash between your fingers.",
        "Mash about a third of the dal lightly with the back of a ladle to make it creamy.",
      ],
    },
    {
      title: "Make the masala",
      items: [
        "In a heavy pot, heat 2 tbsp of the butter with the ghee. Add the cumin seeds and let them crackle.",
        "Add the ginger-garlic paste and green chilli and sauté for a minute until the raw smell goes.",
        "Add the tomato purée and chilli powder. Cook for 8–10 minutes on medium until thick and the fat separates.",
      ],
    },
    {
      title: "Slow-simmer",
      items: [
        "Add the cooked dal with its liquid and 1 cup of hot water. Bring to a boil, then turn the heat to the lowest setting.",
        "Simmer uncovered or partly covered for 45–60 minutes, stirring every few minutes and adding a splash of hot water whenever it gets too thick. The longer it cooks, the creamier it gets.",
        "Stir in the remaining butter, the cream, garam masala and crushed kasuri methi. Simmer for 5 more minutes and adjust the salt.",
      ],
    },
    {
      title: "Smoke it (optional, but it's the dhaba secret)",
      items: [
        "Heat the charcoal over a gas flame until red-hot. Place a small steel bowl on top of the dal, put the coal in it and pour the ghee over.",
        "As soon as it starts smoking, cover the pot tightly for 2–3 minutes, then remove the bowl.",
        "Serve with a swirl of cream and butter, alongside naan, laccha paratha or jeera rice.",
      ],
    },
  ],
  tips: [
    "Cook the dal until it's genuinely soft — undercooked urad never turns creamy, no matter how much butter you add.",
    "Stir from the bottom as it simmers; this dal loves to stick.",
    "It thickens a lot as it cools. Loosen leftovers with hot water or milk when reheating.",
    "Want it richer? Some restaurants simmer it for 3–4 hours. Want it lighter? Use less butter and replace cream with milk.",
  ],
})
