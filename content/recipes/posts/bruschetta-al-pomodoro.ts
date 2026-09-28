import { defineRecipe } from "@/content/define"

export default defineRecipe({
  slug: "bruschetta-al-pomodoro",
  title: "Bruschetta al Pomodoro",
  description:
    "Classic Italian tomato bruschetta: grilled rustic bread rubbed with garlic, topped with ripe tomatoes, fresh basil, salt and extra-virgin olive oil. Simple, fresh and ready in 20 minutes.",
  date: "2025-12-21",
  category: "Starter",
  cuisine: "Italian",
  difficulty: "Easy",
  vegetarian: true,
  tags: ["Italian", "Starter", "Vegetarian", "Vegan", "Quick", "Party Food"],
  keywords: ["bruschetta recipe", "tomato bruschetta", "authentic bruschetta", "Italian appetizer", "bruschetta al pomodoro"],
  prepTime: 15,
  cookTime: 5,
  servings: 4,
  intro: `Bruschetta comes from central Italy, where it began as a way to taste the new season's olive oil: bread grilled over a fire, rubbed with garlic, drizzled with oil and salted. Tomatoes came later and made it famous.

With so few ingredients, it's only as good as its tomatoes, bread and olive oil. Make it in season with ripe tomatoes, and skip the balsamic glaze — you won't find it in Italy.`,
  ingredientGroups: [
    {
      title: "Topping",
      items: [
        "500 g ripe tomatoes (cherry or firm plum tomatoes)",
        "8–10 fresh basil leaves",
        "3 tbsp extra-virgin olive oil, plus more for drizzling",
        "½ tsp flaky or sea salt",
        "Freshly ground black pepper",
      ],
    },
    {
      title: "Bread",
      items: [
        "8 slices rustic country bread or a sourdough loaf, about 1.5 cm thick",
        "1–2 garlic cloves, peeled and halved",
      ],
    },
  ],
  steps: [
    {
      title: "Prepare the tomatoes",
      items: [
        "Cut the tomatoes into small dice (halve cherry tomatoes and quarter them). Scoop out very watery seeds if your tomatoes are juicy.",
        "Put them in a sieve over a bowl, sprinkle with the salt and leave for 10 minutes to drain the excess water — this keeps the bread crisp.",
        "Tip into a bowl, add the olive oil and pepper, and tear in the basil. Toss gently.",
      ],
    },
    {
      title: "Toast the bread",
      items: [
        "Grill the bread on a griddle pan, barbecue or under a hot grill for 1–2 minutes a side until crisp and charred in places, but still soft inside.",
        "While the toast is hot, rub one side of each slice with the cut side of a garlic clove — the rough surface grates it like a zester.",
        "Drizzle each slice with a little olive oil.",
      ],
    },
    {
      title: "Assemble and serve",
      items: [
        "Spoon the tomatoes onto the bread just before serving, add a final drizzle of oil and a pinch of salt, and eat straight away.",
      ],
    },
  ],
  tips: [
    "Assemble at the last minute — the tomatoes will soften the toast within 15 minutes.",
    "Day-old bread grills better than very fresh bread.",
    "Rubbing raw garlic on the toast gives a much cleaner garlic flavour than mixing chopped garlic into the tomatoes.",
    "Variations: finely chopped red onion, a pinch of dried oregano, or torn burrata on top.",
  ],
})
