import * as fs from "fs/promises";
import Exceljs from "exceljs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCT_FIELDS = new Set([
  "id",
  "userId",
  "name",
  "sku",
  "price",
  "cost_price",
  "description",
  "barcode",
]);

/**
 * Normalize a header string for use as a database column.
 *
 * Trims whitespace, converts to lowercase, and replaces spaces with underscores.
 *
 * @param {string|number} header - The original header value from Excel.
 * @returns {string} The normalized header suitable for database column naming.
 */
function normalizeHeader(header) {
  return header.toString().trim().toLowerCase().replace(/\s+/g, "_");
}

/**
 * Import product data from an Excel file into the database.
 *
 * Reads the first worksheet in the given file path, extracts and normalizes headers,
 * filters valid product fields, and performs upsert or create operations.
 * If a record's ID already exists in the database, assigns a new ID to avoid conflict.
 * Deletes the temporary file after import.
 *
 * @param {string} filePath - Absolute path to the Excel file to import.
 * @param {number|string|BigInt} userId - Identifier of the user owning the products.
 * @returns {Promise<number>} The number of records successfully imported.
 * @throws {Error} If file read, parsing, or database operations fail.
 */
export async function importProductsFromExcel(filePath, userId) {
  const workbook = new Exceljs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];

  const headerRow = sheet.getRow(1);
  const headers = headerRow.values.slice(1).map(normalizeHeader);

  const records = [];
  sheet.eachRow((row, idx) => {
    if (idx === 1) return;
    const obj = {};
    headers.forEach((col, i) => {
      const val = row.getCell(i + 1).value;
      if (PRODUCT_FIELDS.has(col) && val != null) {
        obj[col] = val;
      }
    });
    if (Object.keys(obj).length > 0) {
      records.push(obj);
    }
  });

  let importedCount = 0;
  for (const data of records) {
    data.userId = userId;
    if (data.id) {
      const idToCheck = BigInt(data.id);
      const existing = await prisma.product.findUnique({
        where: {
          id: idToCheck,
        },
      });
      if (existing) {
        delete data.id;
        await prisma.product.create({ data });
        importedCount++;
        continue;
      }
      const id = BigInt(data.id);
      delete data.id;
      await prisma.product.upsert({
        where: { id },
        update: data,
        create: { id, ...data },
      });
    } else {
      await prisma.product.create({ data });
    }
    importedCount++;
  }

  await fs.unlink(filePath);

  return importedCount;
}
