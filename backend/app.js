import express from "express";
import cors from "cors";
import { PORT, NODE_ENV } from "./config/env.js";
import productRouter from "./routes/product-service/productRoute.js";
import inventoryRouter from "./routes/inventory-service/inventoryRoute.js";
import authRouter from "./routes/auth-service/authRoute.js";
import userRouter from "./routes/user-service/userRoute.js";
import fileImportRouter from "./routes/file-service/fileRoute.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/files", fileImportRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/inventory", inventoryRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ${NODE_ENV}`);
});
