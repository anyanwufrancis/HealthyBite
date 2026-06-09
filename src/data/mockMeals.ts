export type Meal = {
  _id?: string;
  title: string;
  content: string;
  price: string | number;
  img: string;
  category?: string;
};

export const MOCK_MEALS: Meal[] = [
  {
    title: "Grilled Chicken Bowl",
    content: "Grilled chicken, brown rice, broccoli, cherry tomatoes, and avocado",
    price: 12.99,
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    category: "popular"
  },
  {
    title: "Salmon & Quinoa",
    content: "Roasted salmon, quinoa, asparagus and mixed greens.",
    price: 13.99,
    img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
    category: "popular"
  },
  {
    title: "Vegan Buddha Bowl",
    content: "Chickpea, quinoa, avocado, sweet potatoes, and mixed veggies",
    price: 11.99,
    img: "https://donutfollowthecrowd.com/wp-content/uploads/2024/12/Sweet-Potato-Quinoa-Bowl3.jpg",
    category: "vegan"
  },
  {
    title: "Turkey & Sweet Potato",
    content: "Lean ground turkey, roasted sweet potatoes, and green beans",
    price: 11.99,
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400",
    category: "popular"
  },
  {
    title: "Shrimp Avocado Bowl",
    content: "Grilled shrimp, avocado, cucumber, edamame, and sesame dressing",
    price: 14.49,
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    category: "seafood"
  },
  {
    title: "Beef Stir-Fry Bowl",
    content: "Lean beef, bell peppers, broccoli, carrots, and brown rice",
    price: 13.49,
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    category: "meat"
  },
  {
    title: "Mediterranean Falafel Bowl",
    content: "Falafel, hummus, tabbouleh, feta, olives, and tahini",
    price: 12.49,
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    category: "vegan"
  },
  {
    title: "Tofu Veggie Power Bowl",
    content: "Crispy tofu, kale, roasted beets, quinoa, and lemon tahini",
    price: 11.49,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    category: "vegan"
  },
  {
    title: "Berry Nut Acai Bowl",
    content: "Acai base topped with mixed berries, granola, and honey",
    price: 9.99,
    img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
    category: "dessert"
  }
];
