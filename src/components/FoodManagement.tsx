// ============================================
// FILE 1: frontend/src/components/FoodManagement.tsx - FIXED
// ============================================
import { useState, useEffect } from 'react';
import { menuApi, FoodMenuItem, API_BASE_URL } from '../lib/api';
import { Plus, Trash2, Edit2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

interface FoodFormData {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  available: boolean;
}

const initialFormData: FoodFormData = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  category: 'main',
  available: true,
};

export default function FoodManagement() {
  const [foodItems, setFoodItems] = useState<FoodMenuItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FoodFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadImage(file);
    }
  };

  // ✅ FIXED: Get token from adminToken, not auth
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // ✅ FIXED: Get token from adminToken
      const token = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {};
      
      // Only add Authorization if token exists AND is a valid JWT format
      if (token && token.split('.').length === 3) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      

      
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      

      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload failed:', errorText);
        throw new Error(`Image upload failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();

      
      // Handle different response formats
      const imageUrl = data.url || data.data?.url || data.imageUrl;
      if (!imageUrl) {
        throw new Error('No image URL in response');
      }
      
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    setIsRefreshing(true);
    try {
      const data = await menuApi.getAll();

      setFoodItems(data);
    } catch (error) {
      console.error('❌ Fetch error:', error);
      toast.error('Failed to fetch food items. Please check your connection.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchFoodItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a food name');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    if (!formData.image_url) {
      toast.error('Please upload an image');
      return;
    }
    
    setLoading(true);

    const dataToSubmit = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: formData.image_url,
      category: formData.category,
      available: formData.available,
    };

    try {
      if (editingId) {
        await menuApi.update(editingId, dataToSubmit);
        setEditingId(null);
        toast.success('Menu item updated successfully!');
      } else {
        await menuApi.create(dataToSubmit);
        toast.success('Menu item added successfully!');
      }
      setFormData(initialFormData);
      setImagePreview(null);
      setShowAddForm(false);
      fetchFoodItems();
    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error('Failed to save food item. Please try again.');
    }
    setLoading(false);
  };

  const handleEdit = (item: FoodMenuItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image_url: item.image_url,
      category: item.category,
      available: item.available,
    });
    setImagePreview(item.image_url);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await menuApi.delete(id);
      fetchFoodItems();
      toast.success('Menu item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete menu item. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl sm:text-xl font-bold text-gray-800">Food Menu Management</h3>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="admin-btn admin-btn-secondary admin-btn-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => {
              if (showAddForm) {
                handleReset();
              } else {
                setShowAddForm(true);
              }
            }}
            className="admin-btn admin-btn-primary admin-btn-md"
          >
            <Plus size={30} />
            {showAddForm ? 'Cancel' : 'Add Menu Item'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <h4 className="font-semibold text-gray-800 text-lg">
            {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="e.g., Grilled Salmon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="appetizer">Appetizer</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Brief description of the food item"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rs) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Available for ordering</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            {isUploading && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                Uploading image...
              </p>
            )}
            {(imagePreview || formData.image_url) && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <img
                  src={imagePreview || formData.image_url}
                  alt="Preview"
                  className="w-full h-32 object-contain rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isUploading}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Image</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Name</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Category</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Price</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Status</th>
              <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                  <div className="flex items-center justify-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-lg border border-gray-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=200&h=200';
                      }}
                    />
                  </div>
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                  <div>
                    <div className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {item.description}
                    </div>
                  </div>
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 capitalize text-sm sm:text-base">
                  {item.category}
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 font-semibold text-orange-600 text-sm sm:text-base">
                  Rs.{item.price.toFixed(2)}
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                  <span
                    className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      item.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Edit Item"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {foodItems.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No menu items yet. Add your first item to get started.
          </div>
        )}
      </div>
    </div>
  );
}