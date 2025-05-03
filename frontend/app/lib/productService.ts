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
}

/**
 * Fetches the list of all products from the backend API.
 * @returns A promise that resolves to an array of ProductType objects.
 * @throws Will throw an error if the network request fails.
 */
export const getProducts = async (): Promise<ProductType[]> => {
	const response = await api.get<ProductType[]>("/products");
	return response.data;
}

/**
 * Sends a new product to the API for creation.
 * @param product - Product data without an id field.
 * @returns A promise that resolves to the newly created ProductType object.
 * @throws Will throw an error if the creation request fails.
 */
export const createProduct = async (
	product: Omit<ProductType, "id">
): Promise<ProductType> => {
	const response = await api.post("products", product);
	return response.data;
}

/**
 * Updates an existing product by its unique identifier.
 * @param id - The id of the product to update.
 * @param product - Partial product fields to update.
 * @returns A promise that resolves to the updated ProductType object.
 * @throws Will throw an error if the update request fails.
 */
export const updateProduct = async (
	id: string,
	product: Partial<ProductType>
): Promise<ProductType> => {
	const response = await api.put(`products/${id}`, product);
	return response.data;
}

/**
 * Deletes a product from the API by its id.
 * @param id - Unique identifier of the product to delete.
 * @returns A promise that resolves when deletion is successful.
 * @throws Will throw an error if the deletion request fails.
 */
export const deleteProduct = async (id: string): Promise<void> => {
	await api.delete(`products/${id}`);
}