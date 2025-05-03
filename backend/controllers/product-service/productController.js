import { PrismaClient, Prisma } from '@prisma/client'

const normalizeProduct = (product) => ({
    ...product,
    id: product.id.toString(),
    userId: product.userId.toString()
})

const prisma = new PrismaClient()

export const createProduct = async (req, res, next) => {
    try {
        const userId = BigInt(req.userId);
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { name, sku, price } = req.body;

        const product = await prisma.product.create({
            data: {
                userId: userId,
                name: name,
                sku: sku,
                price: price },
        });
        return res.status(201).json(normalizeProduct(product));
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'Product already exists' });
        }
        return next(error);
    }
}

export const getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json(products.map(normalizeProduct));
    } catch (error) {
        next(error);
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const id = BigInt(req.params.id);
        const product = await prisma.product.findUnique({
            where: {
                id: id,
            }
        })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(normalizeProduct(product));
    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const id = BigInt(req.params.id);
        const { name, sku, price } = req.body;
        const updated = await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                name, sku, price,
            }
        });
        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(normalizeProduct(updated));
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const id = BigInt(req.params.id);
        await prisma.product.delete({
            where: {
                id: id,
            }
        })
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}