import { PrismaClient } from "@prisma/client";
import Exceljs from "exceljs";

const prisma = new PrismaClient();

/**
 * Export products as CSV file
 */
export async function exportProductsToCsv(res, userId) {
  const products = await prisma.product.findMany({
    where: { userId: BigInt(userId) },
  });
  const headers = [
    "id",
    "name",
    "sku",
    "price",
    "cost_price",
    "description",
    "barcode",
  ];
  const rows = products.map((p) =>
    headers
      .map((h) => {
        const val = p[h];
        return val != null ? `"${val}"` : "";
      })
      .join(",")
  );
  const csv = headers.join(",") + "\n" + rows.join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment;filename=products.csv");
  res.send(csv);
}

/**
 * Export products as JSON file
 */
export async function exportProductsToJson(res, userId) {
  const products = await prisma.product.findMany({
    where: { userId: BigInt(userId) },
  });
  const data = products.map((p) => ({
    id: p.id.toString(),
    name: p.name,
    sku: p.sku,
    price: p.price,
    cost_price: p.cost_price,
    description: p.description,
    barcode: p.barcode,
  }));
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment;filename=products.json");
  res.send(JSON.stringify(data, null, 2));
}

/**
 * Export products as Excel file
 */
export async function exportProductsToExcel(res, userId) {
  const products = await prisma.product.findMany({
    where: { userId: BigInt(userId) },
  });
  const workbook = new Exceljs.Workbook();
  const sheet = workbook.addWorksheet("Products");
  sheet.columns = [
    { header: "ID", key: "id", width: 20 },
    { header: "Name", key: "name", width: 30 },
    { header: "SKU", key: "sku", width: 20 },
    { header: "Price", key: "price", width: 15 },
    { header: "Cost Price", key: "cost_price", width: 15 },
    { header: "Description", key: "description", width: 40 },
    { header: "Barcode", key: "barcode", width: 20 },
  ];
  products.forEach((p) => {
    sheet.addRow({
      id: p.id.toString(),
      name: p.name,
      sku: p.sku,
      price: p.price,
      cost_price: p.cost_price,
      description: p.description,
      barcode: p.barcode,
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment;filename=products.xlsx");
  res.send(buffer);
}

/**
 * Export products as XML file
 */
export async function exportProductsToXml(res, userId) {
  const products = await prisma.product.findMany({
    where: { userId: BigInt(userId) },
  });
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += "<products>";
  products.forEach((p) => {
    xml += "<product>";
    xml += `<id>${p.id}</id>`;
    xml += `<name>${p.name}</name>`;
    xml += `<sku>${p.sku}</sku>`;
    xml += `<price>${p.price}</price>`;
    xml += `<cost_price>${p.cost_price ?? ""}</cost_price>`;
    xml += `<description>${p.description ?? ""}</description>`;
    xml += `<barcode>${p.barcode ?? ""}</barcode>`;
    xml += "</product>";
  });
  xml += "</products>";
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Content-Disposition", "attachment;filename=products.xml");
  res.send(xml);
}
