import * as fs from "fs/promises";
import Exceljs from "exceljs";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { parseStringPromise } from "xml2js";

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
        if (
          (col === "price" || col === "cost_price") &&
          typeof val === "string"
        ) {
          obj[col] = parseFloat(val);
        } else {
          obj[col] = val;
        }
      }
    });
    if (Object.keys(obj).length > 0) {
      records.push(obj);
    }
  });

  let importedCount = 0;
  for (const data of records) {
    data.userId = BigInt(userId);
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

/**
 * Import product data from a CSV file into the database.
 *
 * Reads the CSV file, extracts and normalizes headers, filters valid product fields,
 * and performs upsert or create operations similar to Excel import.
 * Deletes the temporary file after import.
 *
 * @param {string} filePath - Absolute path to the CSV file to import.
 * @param {number|string|BigInt} userId - User ID owning the products.
 * @returns {Promise<number>} Number of records successfully imported.
 */
export async function importProductsFromCsv(filePath, userId) {
  const fileData = await fs.readFile(filePath, "utf8");
  const rows = parse(fileData, { columns: true, skip_empty_lines: true });
  const records = [];
  for (const row of rows) {
    const obj = {};
    Object.keys(row).forEach((header) => {
      const col = normalizeHeader(header);
      const val = row[header];
      if (PRODUCT_FIELDS.has(col) && val != null && val !== "") {
        if (col === "price" || col === "cost_price") {
          obj[col] = parseFloat(val);
        } else {
          obj[col] = val;
        }
      }
    });
    if (Object.keys(obj).length > 0) records.push(obj);
  }

  let importedCount = 0;
  for (const data of records) {
    data.userId = BigInt(userId);
    if (data.id) {
      const idToCheck = BigInt(data.id);
      const existing = await prisma.product.findUnique({
        where: { id: idToCheck },
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

/**
 * Import product data from a Google Sheets URL into the database.
 *
 * Converts the sheet URL to CSV export, fetches the data, parses and imports.
 * @param {string} sheetUrl - Public Google Sheets URL or CSV URL.
 * @param {number|string|BigInt} userId - User ID owning the products.
 * @returns {Promise<number>} Number of records imported.
 */
export async function importProductsFromGoogleSheet(sheetUrl, userId) {
  // Convert Google Sheets URL to CSV export URL if needed
  const csvUrl = sheetUrl.includes("/edit")
    ? sheetUrl.replace(/\/edit.*$/, "/export?format=csv")
    : sheetUrl;
  // Fetch CSV data
  const response = await axios.get(csvUrl);
  const dataText = response.data;
  const rows = parse(dataText, { columns: true, skip_empty_lines: true });
  const records = [];
  for (const row of rows) {
    const obj = {};
    Object.keys(row).forEach((header) => {
      const col = normalizeHeader(header);
      const val = row[header];
      if (PRODUCT_FIELDS.has(col) && val != null && val !== "") {
        if (col === "price" || col === "cost_price") {
          obj[col] = parseFloat(val);
        } else {
          obj[col] = val;
        }
      }
    });
    if (Object.keys(obj).length > 0) records.push(obj);
  }

  let importedCount = 0;
  for (const data of records) {
    data.userId = BigInt(userId);
    if (data.id) {
      const idToCheck = BigInt(data.id);
      const existing = await prisma.product.findUnique({
        where: { id: idToCheck },
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

  return importedCount;
}

/**
 * Import product data from a JSON file into the database.
 *
 * Reads the JSON file (array of objects), normalizes headers,
 * filters valid product fields, and performs upsert/create operations.
 * Deletes the temporary file after import.
 *
 * @param {string} filePath - Absolute path to the JSON file to import.
 * @param {number|string|BigInt} userId - Identifier of the user owning the products.
 * @returns {Promise<number>} Number of records successfully imported.
 */
export async function importProductsFromJson(filePath, userId) {
  const content = await fs.readFile(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(content);
  } catch (err) {
    throw new Error("Geçersiz JSON dosyası.");
  }
  if (!Array.isArray(data)) {
    throw new Error("JSON verisi dizi olmalıdır.");
  }
  const records = [];
  for (const row of data) {
    const obj = {};
    Object.keys(row).forEach((header) => {
      const col = normalizeHeader(header);
      const val = row[header];
      if (PRODUCT_FIELDS.has(col) && val != null) {
        if (col === "price" || col === "cost_price") {
          obj[col] = parseFloat(val);
        } else {
          obj[col] = val;
        }
      }
    });
    if (Object.keys(obj).length > 0) records.push(obj);
  }
  let importedCount = 0;
  for (const dataRec of records) {
    dataRec.userId = BigInt(userId);
    if (dataRec.id) {
      const idToCheck = BigInt(dataRec.id);
      const existing = await prisma.product.findUnique({
        where: { id: idToCheck },
      });
      if (existing) {
        delete dataRec.id;
        await prisma.product.create({ data: dataRec });
        importedCount++;
        continue;
      }
      const id = BigInt(dataRec.id);
      delete dataRec.id;
      await prisma.product.upsert({
        where: { id },
        update: dataRec,
        create: { id, ...dataRec },
      });
    } else {
      await prisma.product.create({ data: dataRec });
    }
    importedCount++;
  }
  await fs.unlink(filePath);
  return importedCount;
}

/**
 * Import product data from an XML file into the database.
 *
 * Reads the XML file, parses it, normalizes headers, filters valid product fields,
 * and performs upsert/create operations similar to other imports.
 * Deletes the temporary file after import.
 *
 * @param {string} filePath - Absolute path to the XML file to import.
 * @param {number|string|BigInt} userId - Identifier of the user owning the products.
 * @returns {Promise<number>} Number of records successfully imported.
 */
export async function importProductsFromXml(filePath, userId) {
  const xmlData = await fs.readFile(filePath, "utf8");
  const parsed = await parseStringPromise(xmlData, { explicitArray: false });
  // Determine rows array
  const rootKey = Object.keys(parsed)[0];
  const root = parsed[rootKey];
  let rows = [];
  if (Array.isArray(root)) {
    rows = root;
  } else if (typeof root === "object") {
    // find first array child
    const arrKey = Object.keys(root).find((k) => Array.isArray(root[k]));
    if (arrKey) rows = root[arrKey];
    else rows = [root];
  }
  const records = [];
  for (const row of rows) {
    const obj = {};
    Object.keys(row).forEach((header) => {
      const col = normalizeHeader(header);
      const val = row[header];
      if (PRODUCT_FIELDS.has(col) && val != null) {
        if (col === "price" || col === "cost_price") {
          obj[col] = parseFloat(val);
        } else {
          obj[col] = val;
        }
      }
    });
    if (Object.keys(obj).length > 0) records.push(obj);
  }
  let importedCount = 0;
  for (const dataRec of records) {
    dataRec.userId = BigInt(userId);
    if (dataRec.id) {
      const idToCheck = BigInt(dataRec.id);
      const existing = await prisma.product.findUnique({
        where: { id: idToCheck },
      });
      if (existing) {
        delete dataRec.id;
        await prisma.product.create({ data: dataRec });
        importedCount++;
        continue;
      }
      const id = BigInt(dataRec.id);
      delete dataRec.id;
      await prisma.product.upsert({
        where: { id },
        update: dataRec,
        create: { id, ...dataRec },
      });
    } else {
      await prisma.product.create({ data: dataRec });
    }
    importedCount++;
  }
  await fs.unlink(filePath);
  return importedCount;
}
