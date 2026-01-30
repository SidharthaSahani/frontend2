import { useState, useEffect } from 'react';
import { menuApi, FoodMenuItem } from '../lib/api';
import { ChefHat } from 'lucide-react';

export default function FoodMenu() {
  const [foodItems, setFoodItems] = useState<FoodMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodItems();
    // For our API, we'll poll for changes every 30 seconds
    const interval = setInterval(fetchFoodItems, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchFoodItems = async () => {
    try {
      const allItems = await menuApi.getAll();
      const data = allItems.filter((item: FoodMenuItem) => item.available);
      setFoodItems(data);
    } catch (error) {

    }
    setLoading(false);
  };

  const filteredItems = selectedCategory === 'all' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    if (category === 'all') return 'All Items';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const CATEGORIES = ['all', 'appetizer', 'main', 'dessert', 'beverage'];

  return (
    <div className="mt-8 sm:mt-10 space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-2 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg">
          <ChefHat className="text-primary-600" size={20} />
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">Our Menu</h2>
      </div>

      <div className="card p-4">
        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5 $ {
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-elegant'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              {selectedCategory === category && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-neutral-600">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4 animate-pulse">
              <svg className="w-6 h-6 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p>Loading menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p>No items available in this category.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-elegant-lg transition-all duration-300 flex-shrink-0 w-64 transform hover:-translate-y-1">
                <div className="w-full h-48 flex items-center justify-center bg-neutral-50 p-2">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-contain transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&h=600&q=80';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-neutral-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mb-3 sm:mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl sm:text-2xl font-bold text-primary-600">
                      Rs.{item.price.toFixed(2)}
                    </span>
                    <span className={`badge ${item.category === 'appetizer' ? 'badge-accent' : item.category === 'main' ? 'badge-primary' : 'badge-secondary'}`}>
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
