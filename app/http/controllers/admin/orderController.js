const order = require("../../../models/order")

const Order = require('../../../models/order')

function orderController() {
  return {
      index(req, res) {
          order.find({ status: { $ne: 'completed' } })
              .sort({ 'createdAt': -1 })
              .populate('customerId', '-password')
              .then(orders => {
                  if (req.xhr) {
                      return res.json(orders);
                  } else {
                      return res.render('admin/orders', { orders });
                  }
              }).catch(error => {
                  return res.render('admin/orders', { order })
              });
      }
  }
}
module.exports = orderController