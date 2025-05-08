import express from "express";
import {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
} from "../../controllers/component-service/componentController.js";

import {
  getAllComponentCategories,
  getComponentCategoryById,
  createComponentCategory,
  updateComponentCategory,
  deleteComponentCategory,
} from "../../controllers/component-service/componentCategoryController.js";

import {
  getComponentVersions,
  getComponentVersionById,
  getLatestComponentVersion,
  createComponentVersion,
  updateComponentVersion,
  deleteComponentVersion,
} from "../../controllers/component-service/componentVersionController.js";

import {
  getPageSections,
  getChildSections,
  getPageSectionById,
  createPageSection,
  updatePageSection,
  deletePageSection,
  updateSectionOrder,
} from "../../controllers/component-service/pageSectionController.js";

const router = express.Router();

// Bileşen kategorisi rotaları
router.get("/categories", getAllComponentCategories);
router.get("/categories/:id", getComponentCategoryById);
router.post("/categories", createComponentCategory);
router.put("/categories/:id", updateComponentCategory);
router.delete("/categories/:id", deleteComponentCategory);

// Bileşen rotaları
router.get("/components", getAllComponents);
router.get("/components/:id", getComponentById);
router.post("/components", createComponent);
router.put("/components/:id", updateComponent);
router.delete("/components/:id", deleteComponent);

// Bileşen versiyon rotaları
router.get("/components/:componentId/versions", getComponentVersions);
router.get(
  "/components/:componentId/versions/latest",
  getLatestComponentVersion
);
router.get("/versions/:id", getComponentVersionById);
router.post("/components/:componentId/versions", createComponentVersion);
router.put("/versions/:id", updateComponentVersion);
router.delete("/versions/:id", deleteComponentVersion);

// Sayfa bölümü rotaları
router.get("/pages/:pageId/sections", getPageSections);
router.get("/sections/:id", getPageSectionById);
router.get("/sections/:sectionId/children", getChildSections);
router.post("/pages/:pageId/sections", createPageSection);
router.put("/sections/:id", updatePageSection);
router.delete("/sections/:id", deletePageSection);
router.put("/pages/:pageId/section-order", updateSectionOrder);

export default router;
