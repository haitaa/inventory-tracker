import api from "@/app/lib/api";

/**
 * Represents a product entity retrieved from or sent to the API.
 * @property id - Unique identifier for the product.
 * @property name - Descriptive name of the product.
 * @property sku - Stock Keeping Unit, a unique code.
 * @property price - Monetary value of the product.
 */
export interface ProductType {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost_price?: number;
  description?: string;
  barcode?: string;
  imageUrl?: string; 
}

/**
 * Fetches the list of all products from the backend API.
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
 * @returns A promise that resolves to the newly created ProductType object.
 * @throws Will throw an error if the creation request fails.
 */
export const createProduct = async (
  product: Omit<ProductType, "id">,
  // TODO: add token control 
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
 * @returns A promise that resolves to the updated ProductType object.
 * @throws Will throw an error if the update request fails.
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
 * @throws Will throw an error if the deletion request fails.
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};


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

export const deleteProductImage = async (id: string): Promise<void> => {
  const response = await api.delete(`/products/${id}/image`);
  return response.data;
};

   // Backend URL'sini resim yollarına ekleyen yardımcı fonksiyon
   export const getFullImageUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return '';
    // Eğer zaten tam URL ise doğrudan döndür
    if (imageUrl.startsWith('http')) return imageUrl;
    // Değilse backend URL'sini ekle
    return `http://localhost:4000${imageUrl}`;
  };