import api from "@/app/lib/api";
import { ProductType, ProductStatusEnum, ProductVisibilityEnum } from "@/types/schema";

/**
 * Fetches the list of all products from the backend API.
 * @param token - JWT token for authorization
 * @returns A promise that resolves to an array of ProductType objects.
 * @throws Will throw an error if the network request fails.
 */
export const getProducts = async (token: string): Promise<ProductType[]> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get<ProductType[]>("/products", { headers });
  return response.data;
};

/**
 * Sends a new product to the API for creation.
 * @param product - Product data without an id field.
 * @param image - Optional image file to upload with the product
 * @returns A promise that resolves to the newly created ProductType object.
 * @throws Will throw an error if the creation request fails.
 */
export const createProduct = async (
  product: Omit<ProductType, "id">,
  image?: File,
): Promise<ProductType> => {
  if (!image) {
    const response = await api.post("/products", product);
    return response.data;
  } else {
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    formData.append("image", image);

    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};

/**
 * Updates an existing product by its unique identifier.
 * @param id - The id of the product to update.
 * @param product - Partial product fields to update.
 * @param image - Optional image file to update the product's image
 * @returns A promise that resolves to the updated ProductType object.
 * @throws Will throw an error if the update request fails or if user is not the owner.
 */
export const updateProduct = async (
  id: string,
  product: Partial<ProductType>,
  image?: File,
): Promise<ProductType> => {
  if (!image) {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } else {
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    formData.append("image", image);
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};

/**
 * Deletes a product from the API by its id.
 * @param id - Unique identifier of the product to delete.
 * @returns A promise that resolves when deletion is successful.
 * @throws Will throw an error if the deletion request fails or if user is not the owner.
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

/**
 * Uploads an image for an existing product.
 * @param id - Unique identifier of the product to add image to
 * @param image - The image file to upload
 * @returns A promise that resolves to the updated ProductType object with new image URL
 * @throws Will throw an error if the upload fails or if user is not the owner
 */
export const uploadProductImage = async (id: string, image: File): Promise<ProductType> => {
  const formData = new FormData();
  formData.append("image", image);
  const response = await api.post(`/products/${id}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Removes the image from an existing product.
 * @param id - Unique identifier of the product to remove image from
 * @returns A promise that resolves to void when deletion is successful
 * @throws Will throw an error if the deletion fails or if user is not the owner
 */
export const deleteProductImage = async (id: string): Promise<void> => {
  const response = await api.delete(`/products/${id}/image`);
  return response.data;
};

/**
 * Converts a relative image path to a full URL including backend address.
 * @param imageUrl - The relative image URL or null/undefined
 * @returns A full URL string or empty string if input is null/undefined
 */
export const getFullImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '';
  // Eğer zaten tam URL ise doğrudan döndür
  if (imageUrl.startsWith('http')) return imageUrl;
  // Değilse backend URL'sini ekle
  return `http://localhost:4000${imageUrl}`;
};

/**
 * Fetches product statistics from the API.
 * @param token - Optional JWT token for authorization to get user-specific stats
 * @returns A promise that resolves to an object containing product statistics
 * @throws Will throw an error if the request fails
 */
export const getProductStats = async (token?: string): Promise<{ totalProducts: number }> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/products/stats', { headers });
  return response.data;
};