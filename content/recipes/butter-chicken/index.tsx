import type { RecipeMeta } from "@/content/types"

export const metadata: RecipeMeta = {
  slug: "butter-chicken",
  title: "Butter Chicken (Murgh Makhani)",
  description:
    "The classic North Indian curry — tender chicken in a velvety tomato-cream sauce with warm spices. Rich, comforting, and surprisingly simple.",
  date: "2025-03-05",
  category: "Indian",
  tags: ["Indian", "Chicken", "Curry", "Dinner"],
  prepTime: 20,
  cookTime: 40,
  servings: 4,
  coverImage: "/placeholder.svg?height=500&width=1000&text=Butter+Chicken",
  ingredients: [
    "700g boneless chicken thighs",
    "1 cup plain yogurt",
    "2 tsp garam masala",
    "1 tsp turmeric",
    "1 tsp kashmiri chili powder",
    "1 tbsp ginger-garlic paste",
    "2 tbsp butter",
    "1 tbsp oil",
    "1 large onion, finely chopped",
    "400g crushed tomatoes",
    "1 tsp cumin seeds",
    "1 tsp coriander powder",
    "200ml heavy cream",
    "1 tbsp honey",
    "Salt to taste",
    "Fresh cilantro to garnish",
  ],
}

export default function Content() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-3">Marinate the Chicken</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>
            Mix yogurt, garam masala, turmeric, chili powder, ginger-garlic paste, and a pinch of
            salt in a bowl.
          </li>
          <li>
            Add the chicken thighs, coat well, cover, and refrigerate for at least 30 minutes (or
            overnight for best results).
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Cook the Chicken</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Heat 1 tbsp oil in a heavy pan over high heat until smoking.</li>
          <li>
            Add the marinated chicken in a single layer and sear for 3–4 minutes per side until
            charred in spots and cooked through. Set aside.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Make the Sauce</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>In the same pan, melt butter over medium heat. Add cumin seeds and let them sizzle.</li>
          <li>Add onion and cook until deep golden — about 10 minutes. Don&apos;t rush this step.</li>
          <li>Stir in coriander powder and cook 1 minute.</li>
          <li>Add crushed tomatoes and cook on medium-low for 15 minutes until the sauce darkens and oil separates.</li>
          <li>Blend until smooth (use an immersion blender or transfer carefully to a jug blender).</li>
          <li>Return to heat, pour in cream, add honey, and season with salt.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Combine and Finish</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Slice the cooked chicken and add it to the sauce.</li>
          <li>Simmer together for 5 minutes so the chicken absorbs the flavours.</li>
          <li>Finish with a small knob of butter stirred in off the heat.</li>
          <li>Garnish with fresh cilantro and serve with naan or basmati rice.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Chicken thighs stay more tender than breasts — highly recommended.</li>
          <li>Kashmiri chili gives colour without excessive heat. Substitute with mild paprika if unavailable.</li>
          <li>The sauce freezes well — make a double batch and freeze half for busy nights.</li>
        </ul>
      </section>
    </div>
  )
}
