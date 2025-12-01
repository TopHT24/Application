const products = [
    // Iran Category
    {
        id: 1,
        name: "Persian Carpet",
        category: "Iran",
        img: "/images/IranCarpet.webp",
        description: "Beautifully handcrafted Persian carpet with intricate traditional patterns.",
        price: 500,
        madeBy: "Iranian Artisans",
        stock: 15,
        tags: ["carpet", "traditional", "home-decor"]
    },
    {
        id: 2,
        name: "Iranian Ceramic Tiles",
        category: "Iran",
        img: "/images/IranTiles.webp",
        description: "Exquisite Iranian ceramic tiles with traditional Isfahan patterns.",
        price: 150,
        madeBy: "Masters from Isfahan",
        stock: 30,
        tags: ["tiles", "ceramic", "decorative"]
    },
    {
        id: 3,
        name: "Persian Miniature Painting",
        category: "Iran",
        img: "/images/IranPainting.webp",
        description: "Hand-painted Persian miniature art on camel bone.",
        price: 280,
        madeBy: "Tehran Artists",
        stock: 8,
        tags: ["art", "painting", "collectible"]
    },
    
    // Caribbean Category
    {
        id: 4,
        name: "Jamaican Basket",
        category: "Caribbean",
        img: "/images/CaribbeanBasket.webp",
        description: "Handwoven basket made with natural fibers using traditional techniques.",
        price: 50,
        madeBy: "Artisans in Jamaica",
        stock: 25,
        tags: ["basket", "woven", "natural"]
    },
    {
        id: 5,
        name: "Caribbean Shell Necklace",
        category: "Caribbean",
        img: "/images/CaribbeanNecklace.webp",
        description: "Unique shell necklace crafted by hand with natural Caribbean shells.",
        price: 75,
        madeBy: "Local craftsmen in Haiti",
        stock: 40,
        tags: ["jewelry", "shells", "handmade"]
    },
    {
        id: 6,
        name: "Caribbean Drum",
        category: "Caribbean",
        img: "/images/CaribbeanDrum.webp",
        description: "Traditional handcrafted Caribbean drum made from local wood.",
        price: 120,
        madeBy: "Cuban Artisans",
        stock: 12,
        tags: ["music", "instrument", "traditional"]
    },
    
    // Taiwanese Category
    {
        id: 7,
        name: "Taiwanese Tea Set",
        category: "Taiwanese",
        img: "/images/TaiwanTeaSet.webp",
        description: "Elegant handcrafted Taiwanese tea set with traditional designs.",
        price: 180,
        madeBy: "Taipei Ceramicists",
        stock: 20,
        tags: ["tea", "ceramic", "traditional"]
    },
    {
        id: 8,
        name: "Taiwan Souvenir Magnet",
        category: "Taiwanese",
        img: "/images/TaiwanMagnet.webp",
        description: "Handmade decorative magnet featuring Taipei landmarks.",
        price: 15,
        madeBy: "Local craftsmen in Taipei",
        stock: 100,
        tags: ["souvenir", "magnet", "decorative"]
    },
    {
        id: 9,
        name: "Taiwanese Bamboo Craft",
        category: "Taiwanese",
        img: "/images/TaiwanBamboo.webp",
        description: "Beautiful bamboo handicraft using traditional weaving techniques.",
        price: 95,
        madeBy: "Artisans in Nantou",
        stock: 18,
        tags: ["bamboo", "traditional", "eco-friendly"]
    }
];

// Helper functions
const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
};

const getProductsByCategory = (category) => {
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

const getAllCategories = () => {
    return [...new Set(products.map(p => p.category))];
};

const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some(tag => tag.includes(lowerQuery))
    );
};

const getSuggestions = (productId, limit = 3) => {
    const product = getProductById(productId);
    if (!product) return [];
    
    // Suggest products from same category
    return products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, limit);
};

module.exports = {
    products,
    getProductById,
    getProductsByCategory,
    getAllCategories,
    searchProducts,
    getSuggestions
};
