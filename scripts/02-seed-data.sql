-- Seed Recipes
INSERT INTO recipes (title, slug, description, image_url, category, cook_time, servings, tags, ingredients, directions)
VALUES 
(
  'Paneer Butter Masala',
  'paneer-butter-masala',
  'A rich and creamy North Indian curry made with paneer cheese in a tomato-based sauce.',
  '/images/paneer-butter-masala.jpg',
  'Indian',
  45,
  4,
  '["Indian", "Vegetarian", "Curry"]'::jsonb,
  '["500g paneer, cubed", "2 onions, finely chopped", "3 tomatoes, pureed", "2 tbsp butter", "1 tbsp ginger-garlic paste", "1 tsp red chili powder", "1 tsp garam masala", "1/2 cup cream", "Salt to taste"]'::jsonb,
  '["Heat butter in a pan and add the chopped onions. Sauté until golden brown.", "Add ginger-garlic paste and sauté for another minute.", "Add tomato puree, red chili powder, and salt. Cook until the oil separates.", "Add paneer cubes and gently mix.", "Pour in cream and simmer for 5 minutes.", "Sprinkle garam masala and serve hot with naan or rice."]'::jsonb
),
(
  'Spaghetti Carbonara',
  'spaghetti-carbonara',
  'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
  '/images/spaghetti-carbonara.jpg',
  'Italian',
  30,
  2,
  '["Italian", "Pasta", "Quick"]'::jsonb,
  '["200g spaghetti", "100g pancetta or guanciale, diced", "2 large eggs", "50g Pecorino Romano, grated", "50g Parmigiano Reggiano, grated", "Freshly ground black pepper", "Salt for pasta water"]'::jsonb,
  '["Bring a large pot of salted water to boil and cook spaghetti according to package instructions.", "While pasta cooks, sauté pancetta in a large pan until crispy.", "In a bowl, whisk eggs and mix in the grated cheeses and black pepper.", "Drain pasta, reserving some pasta water, and immediately add to the pan with pancetta.", "Remove pan from heat and quickly stir in the egg and cheese mixture, creating a creamy sauce.", "If needed, add a splash of reserved pasta water to loosen the sauce.", "Serve immediately with extra grated cheese and black pepper."]'::jsonb
),
(
  'Chocolate Cake',
  'chocolate-cake',
  'A decadent and moist chocolate cake perfect for any celebration or dessert craving.',
  '/images/chocolate-cake.jpg',
  'Dessert',
  60,
  8,
  '["Dessert", "Chocolate", "Cake"]'::jsonb,
  '["2 cups all-purpose flour", "3/4 cup cocoa powder", "2 tsp baking soda", "1 tsp baking powder", "1 tsp salt", "2 cups sugar", "2 eggs", "1 cup strong black coffee", "1 cup buttermilk", "1/2 cup vegetable oil", "1 tsp vanilla extract"]'::jsonb,
  '["Preheat oven to 350°F. Grease and flour two 9-inch cake pans.", "Combine flour, cocoa powder, baking soda, baking powder, and salt in a bowl.", "In another bowl, mix sugar, eggs, coffee, buttermilk, oil, and vanilla.", "Combine wet and dry ingredients until smooth.", "Divide batter between pans and bake for 30-35 minutes.", "Cool completely before frosting.", "Spread chocolate frosting between layers and on top."]'::jsonb
);

-- Seed Blogs
INSERT INTO blogs (title, slug, description, image_url, content, author, tags, read_time)
VALUES
(
  'The Art of Mindful Cooking',
  'art-of-mindful-cooking',
  'Discover how cooking can become a form of meditation and mindfulness practice, helping you to be present and find joy in the process.',
  '/images/blog-mindful-cooking.jpg',
  '# The Art of Mindful Cooking

Cooking is more than just preparing food—it''s a practice that can transform your daily routine into a moment of mindfulness and peace.

## The Connection Between Mind and Kitchen

When we cook with intention and presence, we engage all our senses. The aroma of spices, the texture of fresh ingredients, and the warmth of the stove create a multisensory experience that anchors us in the present moment.

## Practical Tips

1. **Start Simple** - Begin with recipes you enjoy
2. **Eliminate Distractions** - Turn off screens and focus
3. **Engage Your Senses** - Notice every smell, taste, and texture
4. **Practice Gratitude** - Thank the ingredients and the process

Cooking mindfully transforms a mundane task into a therapeutic ritual that nourishes both body and soul.',
  'Dhruv Agarwat',
  '["Cooking", "Mindfulness", "Wellness"]'::jsonb,
  5
),
(
  'Digital Wellness in the Modern Age',
  'digital-wellness-modern-age',
  'Understanding how to maintain healthy digital habits while staying connected in our technology-driven world.',
  '/images/blog-digital-wellness.jpg',
  '# Digital Wellness in the Modern Age

In an age where we''re constantly connected, finding balance has become more important than ever.

## The Challenge

Technology has revolutionized how we work, communicate, and learn. However, the constant connectivity can lead to burnout, anxiety, and disconnection from real-world relationships.

## Solutions

- **Set Boundaries** - Establish tech-free times
- **Practice Awareness** - Track your screen time
- **Prioritize Real Connections** - Make time for face-to-face interactions
- **Curate Your Feed** - Follow positive, inspiring content

## The Path Forward

Digital wellness isn''t about rejecting technology—it''s about using it intentionally to enhance our lives rather than control them.',
  'Dhruv Agarwat',
  '["Technology", "Wellness", "Digital"]'::jsonb,
  7
),
(
  'Travel Tales: Finding Magic in Unexpected Places',
  'travel-tales-magic',
  'Exploring the hidden gems and unforgettable experiences that make travel truly transformative.',
  '/images/blog-travel-stories.jpg',
  '# Travel Tales: Finding Magic in Unexpected Places

The best travel memories often come from the moments we didn''t plan—the detours, the local encounters, and the small discoveries that make destinations unforgettable.

## Beyond Tourist Routes

While famous landmarks are worth visiting, the true magic of travel lies in exploring beyond the guidebook. A small café, a local market, or a conversation with a stranger can reveal the soul of a place.

## Stories from the Road

Travel teaches us about ourselves and the world. Every destination has a story, and when we approach travel with curiosity and respect, we become part of that story.

## Planning Your Next Adventure

- Research local culture and customs
- Stay flexible with your itinerary
- Talk to locals and fellow travelers
- Embrace the unexpected

The world is full of wonder—go find it.',
  'Dhruv Agarwat',
  '["Travel", "Adventure", "Culture"]'::jsonb,
  8
);

-- Seed Articles
INSERT INTO articles (title, slug, description, image_url, content, author, tags, read_time)
VALUES
(
  'The Future of Artificial Intelligence in Healthcare',
  'future-ai-healthcare',
  'Exploring how AI technologies are transforming diagnosis, treatment, and patient care in the medical field.',
  '/images/article-ai-healthcare.jpg',
  '# The Future of Artificial Intelligence in Healthcare

Artificial Intelligence is revolutionizing healthcare by improving diagnostics, treatment plans, and patient outcomes.

## Current Applications

**Diagnostic Imaging**: AI algorithms can detect diseases like cancer more accurately than human radiologists in some cases.

**Personalized Medicine**: AI analyzes genetic data to recommend personalized treatment plans.

**Drug Discovery**: Machine learning accelerates the process of identifying new drugs and compounds.

## Challenges Ahead

- Ensuring privacy and security of patient data
- Building trust in AI recommendations
- Addressing bias in training datasets
- Maintaining the human element in healthcare

## The Road Ahead

The future of healthcare isn''t about replacing doctors—it''s about augmenting human expertise with AI capabilities to provide better, faster, and more accurate care.',
  'Dhruv Agarwat',
  '["Technology", "Healthcare", "AI"]'::jsonb,
  12
),
(
  'Understanding Quantum Computing: A Beginner''s Guide',
  'quantum-computing-guide',
  'A simplified explanation of quantum computing principles and their potential impact on computational problems.',
  '/images/article-quantum-computing.jpg',
  '# Understanding Quantum Computing: A Beginner''s Guide

Quantum computing represents a fundamental shift in how we process information and solve complex problems.

## The Basics

Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or "qubits." These qubits can exist in multiple states simultaneously, thanks to a principle called superposition.

## Key Principles

**Superposition**: Qubits can be 0, 1, or both at the same time
**Entanglement**: Qubits can be linked together in ways that classical bits cannot
**Interference**: Quantum algorithms manipulate probabilities to amplify correct answers

## Real-World Applications

- **Cryptography**: Breaking and securing encryption
- **Drug Discovery**: Simulating molecular interactions
- **Optimization**: Solving complex logistical problems
- **Financial Modeling**: Running sophisticated financial simulations

## The Future

Quantum computing is still in its infancy, but its potential to solve previously impossible problems makes it one of the most promising frontiers in technology.',
  'Dhruv Agarwat',
  '["Technology", "Quantum Computing", "Science"]'::jsonb,
  15
),
(
  'Web3 and the Decentralized Internet Future',
  'web3-decentralized-future',
  'Understanding blockchain, cryptocurrencies, and how Web3 is reshaping the internet landscape.',
  '/images/article-web3-future.jpg',
  '# Web3 and the Decentralized Internet Future

Web3 represents a paradigm shift from centralized internet platforms to decentralized, user-owned ecosystems.

## What is Web3?

Web3 is built on blockchain technology and enables users to own their data, content, and digital assets directly, without relying on centralized intermediaries.

## Key Components

**Blockchain**: Immutable ledger technology ensuring transparency and security
**Smart Contracts**: Self-executing code that enables trustless transactions
**Decentralized Applications (dApps)**: Applications running on blockchain networks
**Cryptocurrencies**: Digital assets with real value and ownership

## Benefits and Challenges

**Benefits**: User sovereignty, privacy, transparency, reduced censorship

**Challenges**: Scalability, energy consumption, regulatory uncertainty, user experience

## The Transition

We''re witnessing a gradual transition from Web2''s centralized model to Web3''s decentralized paradigm, creating new opportunities and challenges for businesses, developers, and users.',
  'Dhruv Agarwat',
  '["Technology", "Web3", "Blockchain"]'::jsonb,
  10
);

-- Seed Music
INSERT INTO music (title, slug, image_url, audio_url, artist, album, tags, duration)
VALUES
(
  'Midnight Serenity',
  'midnight-serenity',
  '/images/music-lofi-beats.jpg',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'Dhruv Agarwat',
  'Midnight Sessions',
  '["Lofi", "Instrumental", "Relaxing"]'::jsonb,
  180
),
(
  'Neon Dreams',
  'neon-dreams',
  '/images/music-synthwave.jpg',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'Dhruv Agarwat',
  'Synthwave Vibes',
  '["Synthwave", "Electronic", "80s"]'::jsonb,
  210
),
(
  'Ambient Horizon',
  'ambient-horizon',
  '/images/music-ambient-chill.jpg',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'Dhruv Agarwat',
  'Ambient Collections',
  '["Ambient", "Chill", "Meditative"]'::jsonb,
  240
);
