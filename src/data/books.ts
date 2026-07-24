export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
  cover: { bg: string; accent: string };
};

export const categories = [
  "All",
  "Educational",
  "Fiction",
  "Children's Books",
  "Science",
  "Technology",
  "Business",
  "Religious",
  "History",
];

export const books: Book[] = [
  { id: "1", title: "Citizenship and Heritage Studies", author: "Dr. TNJ Umunnakwe", description: "A comprehensive guide to abstract algebra for university students.", price: 5000, category: "Educational", rating: 4.8, inStock: true, cover: { bg: "#1B5E20", accent: "#A5D6A7" } },
  { id: "2", title: "The Silent Library", author: "Nadia Kwame", description: "A gripping literary novel about memory, loss, and books that speak.", price: 18.5, category: "Fiction", rating: 4.6, inStock: true, cover: { bg: "#2E7D32", accent: "#FFF3E0" } },
  { id: "3", title: "Little Explorers ABC", author: "Sam Rivers", description: "Colorful alphabet adventure for early readers ages 3-6.", price: 12.99, category: "Children's Books", rating: 4.9, inStock: true, cover: { bg: "#FFB300", accent: "#1B5E20" } },
  { id: "4", title: "The Physics of Everything", author: "Prof. Ethan Wells", description: "From quantum fields to cosmology — a unified journey.", price: 42.0, category: "Science", rating: 4.7, inStock: true, cover: { bg: "#0D47A1", accent: "#A5D6A7" } },
  { id: "5", title: "Clean Systems Architecture", author: "Priya Ramanathan", description: "Design principles for scalable, maintainable software.", price: 39.99, category: "Technology", rating: 4.8, inStock: true, cover: { bg: "#212121", accent: "#2E7D32" } },
  { id: "6", title: "The Founder's Compass", author: "Marcus Bello", description: "Strategy, resilience, and leadership for first-time founders.", price: 24.99, category: "Business", rating: 4.5, inStock: true, cover: { bg: "#4A148C", accent: "#FFD54F" } },
  { id: "7", title: "Whispers of Grace", author: "Rev. Joanna Adeyemi", description: "Daily reflections on faith, hope, and gratitude.", price: 16.0, category: "Religious", rating: 4.9, inStock: true, cover: { bg: "#6D4C41", accent: "#FFF8E1" } },
  { id: "8", title: "Empires of the Sahel", author: "Dr. Kofi Mensah", description: "The rise and legacy of West African civilizations.", price: 29.5, category: "History", rating: 4.7, inStock: true, cover: { bg: "#B71C1C", accent: "#FFCCBC" } },
  { id: "9", title: "Everyday Calculus", author: "Dr. Lin Chen", description: "Intuitive calculus with real-world applications.", price: 27.5, category: "Educational", rating: 4.6, inStock: true, cover: { bg: "#00695C", accent: "#B2DFDB" } },
  { id: "10", title: "Where the Rivers Meet", author: "Isabelle Duarte", description: "A sweeping family saga across three generations.", price: 21.0, category: "Fiction", rating: 4.4, inStock: true, cover: { bg: "#37474F", accent: "#CFD8DC" } },
  { id: "11", title: "The Curious Robot", author: "Tomas Fields", description: "An adorable STEM adventure for children ages 5-9.", price: 14.5, category: "Children's Books", rating: 4.8, inStock: true, cover: { bg: "#E64A19", accent: "#FFECB3" } },
  { id: "12", title: "AI for Practitioners", author: "Dr. Yuki Tanaka", description: "Deploying machine learning systems in the real world.", price: 44.0, category: "Technology", rating: 4.7, inStock: false, cover: { bg: "#1A237E", accent: "#A5D6A7" } },
];
