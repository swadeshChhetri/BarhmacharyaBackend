// ─────────────────────────────
// External libraries
// ─────────────────────────────
import express from "express";

// ─────────────────────────────
// Auth & User-related modules
// ─────────────────────────────
import authRoutes from "../modules/userAuth/auth.routes.js";
import postRoutes from "../modules/post/post.routes.js";
import uploadRoutes from "../upload/upload.routes.js";
import videoRoutes from "../modules/video/video.routes.js";
import productRoutes from "../modules/product/product.routes.js";
// import corporateAuthRoutes from "../modules/corporateAuth/corporateAuth.routes.js";

// ─────────────────────────────
// Core business modules
// ─────────────────────────────
// import leadRoutes from "../modules/lead/lead.routes.js";
// import leadSourceRoutes from "../modules/leadSource/leadSource.routes.js";
// import customerRoutes from "../modules/customer/customer.routes.js";
// import serviceRoutes from "../modules/service/service.routes.js";
// import serviceAttributeRoutes from "../modules/serviceAttributes/serviceAttributes.routes.js";
// import categoryRoutes from "../modules/category/category.routes.js";
// import orderRoutes from "../modules/orders/order.routes.js";
// import payoutRoutes from "../modules/payouts/payout.routes.js";

// ─────────────────────────────
// Agent & Corporate domains
// ─────────────────────────────
// import agentModule from "../modules/agent/agent.module.js";
// import agentKYCModule from "../modules/agentKYC/agentKYC.module.js";
// import agentBookingRoutes from "../modules/agentBookings/agentBooking.routes.js";
// import corporateModule from "../modules/corporate/corporate.module.js";

// ─────────────────────────────
// Analytics / Dashboard / Reports
// ─────────────────────────────
// import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
// import analyticsRoutes from "../modules/analytics/analytics.routes.js";
// import reportRoutes from "../modules/reports/report.routes.js";

// ─────────────────────────────
// Admin modules
// ─────────────────────────────
// import adminRoutes from "../modules/admin/admin.routes.js";
// import adminAgentRoutes from "../modules/admin/agents/admin-agent.routes.js";

// ─────────────────────────────
// Middlewares
// ─────────────────────────────
// import { verifyUserAuth } from "../middlewares/verifyUserAuth.js";
// import { optionalAuth } from "../middlewares/optionalAuth.js";
// import { isAdmin, isAgent } from "../middlewares/roleMiddleware.js";


const router = express.Router();

/* =========================
   PUBLIC / AUTH
========================= */
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/uploads", uploadRoutes);
router.use("/videos", videoRoutes);
// router.use("/corporate-auth", corporateAuthRoutes);

/* =========================
   AGENT (MODULE FIRST)
========================= */
// agent routes replaced by agent module
// router.use("/agent", agentModule);

// agent KYC (agent-side)
// router.use("/agent/kyc", agentKYCModule);

// agent bookings (explicit guard)
// router.use("/agent", verifyUserAuth, isAgent, agentBookingRoutes);

/* =========================
   CORE BUSINESS
========================= */

// router.use("/leads", verifyUserAuth, leadRoutes);
// router.use("/services", optionalAuth, serviceRoutes);

// router.use("/categories", categoryRoutes);
// router.use("/category", optionalAuth, categoryRoutes);
// router.use("/leadSource", leadSourceRoutes);

/* =========================
CORPORATE
========================= */
// corporate module mount (module should apply verifyUserAuth internally)
// router.use("/corporate", corporateModule);

/* =========================
ADMIN (GENERAL)
========================= */
// router.use("/admin", verifyUserAuth, isAdmin, adminRoutes);
// router.use("/admin/admin-agents", verifyUserAuth, isAdmin, adminAgentRoutes);
// router.use("/admin/agent/kyc", verifyUserAuth, isAdmin, agentKYCModule);

/* =========================
ADMIN (STRICT / DOMAIN-SPECIFIC)
========================= */
// router.use("/admin/agents", verifyUserAuth, isAdmin, agentModule);
// router.use("/admin/services", verifyUserAuth, isAdmin, serviceRoutes);
// router.use("/admin/service-attributes", verifyUserAuth, serviceAttributeRoutes);
// router.use("/admin/categories", verifyUserAuth, isAdmin, categoryRoutes);
// router.use("/admin/customers", verifyUserAuth, isAdmin, customerRoutes);
// router.use("/admin/corporates", verifyUserAuth, isAdmin, corporateModule);
// router.use("/admin/dashboard", verifyUserAuth, isAdmin, dashboardRoutes);
// router.use("/admin/analytics", verifyUserAuth, isAdmin, analyticsRoutes);
// router.use("/admin/payouts", verifyUserAuth, isAdmin, payoutRoutes);
// router.use("/admin/reports", verifyUserAuth, isAdmin, reportRoutes);
// router.use("/admin/orders", verifyUserAuth, isAdmin, orderRoutes);
router.use("/admin/products", productRoutes);

export default router;
