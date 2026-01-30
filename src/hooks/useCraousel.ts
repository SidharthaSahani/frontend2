// ============================================
// FILE: hooks/useCraousel.ts - NO AUTO-REFRESH
// Carousel images don't change frequently, so no auto-refresh needed
// ============================================
import { useState, useEffect } from 'react';
import { carouselService, type CarouselImage } from '../services/carouselService';
import { toast } from 'react-toastify';

export const useCarousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await carouselService.getImages();
      setImages(data);
    } catch (err) {
      // Log error for debugging
      console.error('❌ Error fetching carousel images:', err);
      setError('Failed to fetch carousel images');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const newImages = await carouselService.uploadImage(file);
      setImages(newImages);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      // Log error for debugging
      console.error('❌ Error uploading image:', err);
      setError('Failed to upload image');
      toast.error('Failed to upload image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const newImages = await carouselService.deleteImage(id);
      setImages(newImages);
      toast.success('Image deleted successfully!');
    } catch (err) {
      // Log error for debugging
      console.error('❌ Error deleting image:', err);
      setError('Failed to delete image');
      toast.error('Failed to delete image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateImage = async (id: string, file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const newImages = await carouselService.updateImage(id, file);
      setImages(newImages);
      toast.success('Image updated successfully!');
    } catch (err) {
      // Log error for debugging
      console.error('❌ Error updating image:', err);
      setError('Failed to update image');
      toast.error('Failed to update image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount only (no auto-refresh for carousel)
  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    error,
    fetchImages, // Manual refresh available
    uploadImage,
    deleteImage,
    updateImage
  };
};