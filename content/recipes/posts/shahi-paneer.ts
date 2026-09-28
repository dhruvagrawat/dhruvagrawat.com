import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "shahi-paneer",
  title: "Shahi Paneer",
  description:
    "Restaurant-style shahi paneer at home: soft paneer in a rich, mildly spiced Mughlai gravy of onions, tomatoes, cashews, cream and whole spices, finished with kasuri methi and saffron.",
  date: "2025-10-26",
  category: "Main course",
  cuisine: "North Indian",
  difficulty: "Medium",
  vegetarian: true,
  tags: ["North Indian", "Paneer", "Vegetarian", "Mughlai", "Curry", "Dinner"],
  keywords: ["shahi paneer recipe", "restaurant style shahi paneer", "paneer gravy", "Mughlai paneer", "creamy paneer curry"],
  prepTime: 15,
  cookTime: 35,
  servings: 4,
  intro: `*Shahi* means royal, and this is the paneer dish of wedding buffets and celebration dinners — a Mughlai-style gravy that's rich and fragrant rather than fiery. The secret is a silky base of onions, tomatoes and cashews simmered with whole spices, then blended smooth and finished with cream, kasuri methi and a few threads of saffron.`,
  ingredientGroups: [
    {
      title: "Gravy base",
      items: [
        "2 medium onions, roughly chopped",
        "3 medium tomatoes, roughly chopped",
        "15–20 cashews",
        "1 tbsp chopped ginger",
        "4 garlic cloves",
        "1 green chilli (optional)",
        "1 cup water",
      ],
    },
    {
      title: "Whole spices",
      items: ["2 tbsp ghee or butter", "1 bay leaf", "3 green cardamom pods", "3 cloves", "1 small stick cinnamon"],
    },
    {
      title: "To finish",
      items: [
        "400 g paneer, cut into cubes",
        "1½ tsp Kashmiri red chilli powder",
        "1 tsp coriander powder",
        "¼ tsp turmeric",
        "½ tsp garam masala",
        "1 tsp kasuri methi (dried fenugreek leaves), crushed between your palms",
        "¼ cup fresh cream",
        "½–1 tsp sugar (to balance the tomatoes)",
        "A pinch of saffron soaked in 1 tbsp warm milk (optional)",
        "Salt to taste",
      ],
    },
  ],
  steps: [
    {
      title: "Make the gravy base",
      items: [
        "Put the onions, tomatoes, cashews, ginger, garlic and green chilli in a pan with 1 cup of water. Cover and simmer for 12–15 minutes until the onions are completely soft.",
        "Let it cool slightly, then blend to a very smooth purée. For a truly silky, restaurant finish, pass it through a sieve.",
      ],
    },
    {
      title: "Cook the masala",
      items: [
        "Heat the ghee in a heavy pan. Add the bay leaf, cardamom, cloves and cinnamon and let them sizzle for 30 seconds until fragrant.",
        "Add the chilli powder, coriander powder and turmeric, and stir for 10 seconds — don't let them burn.",
        "Pour in the blended purée (it will splutter). Cook on medium-low, stirring often, for 10–12 minutes until it thickens and ghee starts to separate at the edges.",
      ],
    },
    {
      title: "Add the paneer and finish",
      items: [
        "Add ½–¾ cup hot water to reach the consistency you like, then the salt and sugar. Simmer for 3 minutes.",
        "Soak the paneer cubes in hot water for 5 minutes while the gravy simmers, then drain — this keeps them soft.",
        "Add the paneer, garam masala and crushed kasuri methi. Simmer gently for 2–3 minutes.",
        "Turn off the heat and stir in the cream and saffron milk. Serve hot with naan, laccha paratha or jeera rice.",
      ],
    },
  ],
  tips: [
    "Don't boil the gravy hard after adding cream — it can split.",
    "Soaking paneer in hot water makes even shop-bought paneer soft and spongy.",
    "Kasuri methi is the 'restaurant' flavour most home versions miss. Crush it just before adding.",
    "For a white 'safed' shahi paneer, skip the tomatoes and chilli powder and add more cashews and yogurt.",
  ],
})
