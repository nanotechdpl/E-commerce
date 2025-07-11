const express = require('express');

const {
 createOrder,
  getAllOrders,
  getOrderByID,
  removeOrder,
  updateOrder
} = require("../controller/visaTravelling.order.controller");

const router = express.Router();

router.post('/',  createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderByID);
router.put('/:id',  updateOrder);
router.delete('/:id',  removeOrder);


module.exports = router;