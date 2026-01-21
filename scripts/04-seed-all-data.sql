-- Seed Recipes
INSERT INTO recipes (title, slug, description, image_url, category, cook_time, servings, tags, ingredients, directions) VALUES
(
  'Paneer Butter Masala',
  'paneer-butter-masala',
  'A rich and creamy North Indian curry made with paneer cheese in a tomato-based sauce.',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop',
  'Indian',
  45,
  4,
  '["Indian", "Vegetarian", "Curry"]',
  '["500g paneer, cubed", "2 onions, finely chopped", "3 tomatoes, pureed", "2 tbsp butter", "1 tbsp ginger-garlic paste", "1 tsp red chili powder", "1 tsp garam masala", "1/2 cup cream", "Salt to taste"]',
  '["Heat butter in a pan and add the chopped onions. Sauté until golden brown.", "Add ginger-garlic paste and sauté for another minute.", "Add tomato puree, red chili powder, and salt. Cook until the oil separates.", "Add paneer cubes and gently mix.", "Pour in cream and simmer for 5 minutes.", "Sprinkle garam masala and serve hot with naan or rice."]'
),
(
  'Spaghetti Carbonara',
  'spaghetti-carbonara',
  'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
  'https://images.unsplash.com/photo-1621996346565-431f63602f41?w=500&h=500&fit=crop',
  'Italian',
  30,
  2,
  '["Italian", "Pasta", "Quick"]',
  '["200g spaghetti", "100g pancetta or guanciale, diced", "2 large eggs", "50g Pecorino Romano, grated", "50g Parmigiano Reggiano, grated", "Freshly ground black pepper", "Salt for pasta water"]',
  '["Bring a large pot of salted water to boil and cook spaghetti according to package instructions.", "While pasta cooks, sauté pancetta in a large pan until crispy.", "In a bowl, whisk eggs and mix in the grated cheeses and black pepper.", "Drain pasta, reserving some pasta water, and immediately add to the pan with pancetta.", "Remove pan from heat and quickly stir in the egg and cheese mixture, creating a creamy sauce.", "If needed, add a splash of reserved pasta water to loosen the sauce.", "Serve immediately with extra grated cheese and black pepper."]'
),
(
  'Chocolate Lava Cake',
  'chocolate-lava-cake',
  'A decadent chocolate cake with a molten center, perfect for dessert lovers.',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',
  'Dessert',
  20,
  2,
  '["Dessert", "Chocolate", "Baking"]',
  '["100g dark chocolate (70% cocoa)", "100g butter", "2 eggs", "2 egg yolks", "25g sugar", "30g flour", "Pinch of salt", "Butter for greasing"]',
  '["Preheat oven to 200°C and butter 2 ramekins.", "Melt chocolate and butter together over a double boiler.", "Whisk eggs, egg yolks, and sugar until pale and thick.", "Fold chocolate mixture into eggs, then gently fold in flour and salt.", "Divide batter between ramekins.", "Bake for 12-14 minutes until edges are set but center is soft.", "Serve immediately with vanilla ice cream."]'
);

-- Seed Blogs
INSERT INTO blogs (title, slug, description, image_url, content, author, tags, read_time) VALUES
(
  'The Art of Mindful Cooking',
  'art-of-mindful-cooking',
  'Discover how cooking can become a form of meditation and mindfulness practice.',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
  'Cooking is more than just preparing food. It is a meditative practice that brings us into the present moment. Learn how to transform your kitchen into a sanctuary of peace and mindfulness.',
  'Dhruv Agarwat',
  '["Cooking", "Mindfulness", "Wellness"]',
  5
),
(
  'Digital Wellness in the Modern Age',
  'digital-wellness-modern-age',
  'Understanding how to maintain mental health while staying connected online.',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
  'In an age of constant connectivity, taking care of our digital wellness is crucial. Explore practical strategies to balance your online and offline life.',
  'Dhruv Agarwat',
  '["Technology", "Wellness", "Mental Health"]',
  8
),
(
  'Travel Stories: Exploring Hidden Gems',
  'travel-stories-hidden-gems',
  'A collection of travel stories from unexplored destinations around the world.',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop',
  'Travel opens our minds to new cultures and perspectives. Join us on journeys to hidden gems that most travelers miss.',
  'Dhruv Agarwat',
  '["Travel", "Adventure", "Culture"]',
  10
);

-- Seed Articles
INSERT INTO articles (title, slug, description, image_url, content, author, tags, read_time) VALUES
(
  'The Future of AI in Healthcare',
  'future-ai-healthcare',
  'Exploring how artificial intelligence is transforming medical diagnosis and treatment.',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop',
  'Artificial intelligence is revolutionizing healthcare through improved diagnostics, personalized treatment plans, and enhanced patient outcomes. Discover the latest advancements in AI-powered medicine.',
  'Dhruv Agarwat',
  '["Technology", "Healthcare", "AI"]',
  12
),
(
  'Understanding Quantum Computing',
  'understanding-quantum-computing',
  'A beginner-friendly guide to quantum computing principles and applications.',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=500&h=500&fit=crop',
  'Quantum computing represents a fundamental shift in computational power. Learn about qubits, superposition, and how quantum computers will solve complex problems.',
  'Dhruv Agarwat',
  '["Technology", "Science", "Computing"]',
  15
),
(
  'Web3 and the Decentralized Future',
  'web3-decentralized-future',
  'Understanding blockchain technology and the future of decentralized applications.',
  'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=500&fit=crop',
  'Web3 promises a more decentralized internet where users have control over their data and digital assets. Explore the technologies driving this transformation.',
  'Dhruv Agarwat',
  '["Technology", "Blockchain", "Web3"]',
  14
);

-- Seed Music
INSERT INTO music (title, slug, image_url, tags, artist, album, duration, audio_url) VALUES
(
  'Midnight Serenity',
  'midnight-serenity',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
  '["Lofi", "Instrumental", "Relaxing"]',
  'Dhruv Agarwat',
  'Midnight Sessions',
  180,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
),
(
  'Neon Dreams',
  'neon-dreams',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
  '["Synthwave", "Electronic", "Chill"]',
  'Dhruv Agarwat',
  'Cyber Nights',
  210,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
),
(
  'Ambient Bliss',
  'ambient-bliss',
  'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=crop',
  '["Ambient", "Meditation", "Peaceful"]',
  'Dhruv Agarwat',
  'Zen Moments',
  240,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
);

-- Seed Photography
INSERT INTO photography (title, description, image_url, location, tags, camera, lens) VALUES
(
  'Mountain Sunrise',
  'A breathtaking sunrise captured at the peak of a snow-covered mountain.',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop',
  'Swiss Alps',
  '["Landscape", "Nature", "Sunrise"]',
  'Canon EOS R5',
  'RF 24-70mm f/2.8'
),
(
  'Urban Nightlife',
  'The vibrant colors and energy of the city at night captured in a single frame.',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=400&fit=crop',
  'Tokyo, Japan',
  '["Street", "Urban", "Night"]',
  'Sony A7IV',
  'Sony 35mm f/1.4'
),
(
  'Forest Serenity',
  'A peaceful walk through an ancient forest with towering trees and dappled light.',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=700&fit=crop',
  'Black Forest, Germany',
  '["Landscape", "Nature", "Forest"]',
  'Nikon Z9',
  'Nikon Z 24-70mm f/2.8'
);

-- Seed Projects
INSERT INTO projects (title, slug, description, details, image_url, technologies, gallery_urls, github_url, live_url, status, start_date, team_size) VALUES
(
  'Personal Portfolio CMS',
  'personal-portfolio-cms',
  'A full-stack content management system for managing recipes, blogs, articles, and media.',
  'A comprehensive CMS built with Next.js and Supabase that allows complete management of recipes, blogs, articles, photography, and projects. Features include real-time data sync, responsive design, media storage, and an intuitive admin dashboard with password protection.',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
  '["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "React"]',
  '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop"]',
  'https://github.com/dhruvagrawat/portfolio-cms',
  'https://dhruvagrawat.com',
  'In Progress',
  '2024-01-01',
  1
),
(
  'E-Commerce Platform',
  'ecommerce-platform',
  'A modern e-commerce platform with payment integration and inventory management.',
  'Built a scalable e-commerce platform featuring product catalog, shopping cart, secure payment processing with Stripe, and real-time inventory management. Includes admin dashboard for order tracking and analytics.',
  'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=500&fit=crop',
  '["React", "Node.js", "PostgreSQL", "Stripe", "Redux"]',
  '["https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop"]',
  'https://github.com/dhruvagrawat/ecommerce',
  'https://ecommerce-demo.dhruvagrawat.com',
  'Completed',
  '2023-06-01',
  3
),
(
  'Music Streaming App',
  'music-streaming-app',
  'A Spotify-like music streaming application with playlist management.',
  'Developed a music streaming platform with user authentication, playlist creation, and recommendation algorithms. Includes social features like sharing and collaborative playlists.',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
  '["React Native", "Firebase", "Node.js", "MongoDB", "WebSocket"]',
  '["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1510915360229-cc91b635b814?w=400&h=300&fit=crop"]',
  'https://github.com/dhruvagrawat/music-streaming',
  'https://music-app.dhruvagrawat.com',
  'In Progress',
  '2024-02-15',
  2
);
