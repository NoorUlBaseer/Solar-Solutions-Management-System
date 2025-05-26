// Backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/admin/dashboardController');
const installationController = require('../controllers/admin/installationController');
const analyticsController = require('../controllers/admin/analyticsController');
const userController = require('../controllers/admin/userController');
const sellerController = require('../controllers/admin/sellerController');
const surveyController = require('../controllers/admin/surveyController');
const productController = require('../controllers/admin/productController');
const servicesController = require('../controllers/admin/servicesController');
const securityController = require('../controllers/admin/securityController');
const supportController = require('../controllers/admin/supportController');
const settingsController = require('../controllers/admin/settingsController');
const { protectAdmin, verifyAdminRole } = require('../middleware/authMiddleware');
const orderController = require('../controllers/admin/orderController');

// ... other routes

router.get('/dashboard', dashboardController.getDashboardStats);

router.get('/installations', installationController.getInstallations);
router.get('/installations/:id', installationController.getInstallationDetails);
router.put('/installations/:id/status', installationController.updateInstallationStatus);

router.get('/analytics', analyticsController.getAnalyticsData);

router.get('/users', userController.getUsers);
router.put('/users/:userId/verify', userController.updateUserVerification);
router.get('/users/:userId', userController.getUserDetails);

router.get('/sellers', sellerController.getSellers);
router.get('/sellers/:id', sellerController.getSellerDetails);
router.put('/sellers/:id/verify', sellerController.updateSellerVerification);
router.post('/sellers/:id/schedule-survey', sellerController.scheduleSurvey);

router.get('/userSurveys', surveyController.getUsers);
router.get('/userSurveys/:id', surveyController.getUserDetails);
router.post('/userSurveys/:id/schedule-survey', surveyController.scheduleSurvey);

router.get('/products', productController.getProducts);
router.get('/products/:productId', productController.getProductDetails);
router.put('/products/:productId/verify', productController.updateProductVerification);

router.get('/solutions', servicesController.getSolutions);
router.post('/solutions', servicesController.createSolution);
router.put('/solutions/:id', servicesController.updateSolution);
router.delete('/solutions/:id', servicesController.deleteSolution);

router.get('/escalations', securityController.getEscalations);
router.get('/escalations/:id', securityController.getEscalationDetails);
router.put('/escalations/:id', securityController.updateEscalation);

router.get('/consultations', supportController.getConsultations);
router.post('/consultations/reply', supportController.addReply);
router.delete('/consultations/:consultationId/questions/:questionId', supportController.deleteQuestion);

router.get('/profile', protectAdmin, verifyAdminRole, settingsController.getAdminProfile);
router.get('/discounts', settingsController.getDiscounts);
router.put('/discounts', settingsController.updateDiscounts);

router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderDetails);
router.put('/orders/:id/status', orderController.updateOrderStatus);



module.exports = router;