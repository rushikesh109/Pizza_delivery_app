//const Order = require("../../../models/order");
//const Customer = require('../models/customer');

// const orderController = () => ({
//     async index(req, res) {
//         try {
//             const orders = await Order.find({ status: { $ne: 'completed' } })
//                 .sort({ createdAt: -1 })
//                 .populate('customerId', '-password')
//                 .exec();

//             if (req.xhr) {
//                 return res.json(orders);
//             } else {
//                 return res.render('admin/orders', { orders });
//             }
//         } catch (err) {
//             console.error('Error fetching orders:', err);
//             return res.status(500).json({ error: 'Failed to fetch orders' });
//         }
//     }
// });

// module.exports = orderController;
// const order = require("../../../models/order")

// const Order = require('../../../models/order')

// function orderController() {
//     return {
//         index(req, res) {
//            order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
//                if(req.xhr) {
//                    return res.json(orders)
//                } else {
//                 return res.render('admin/orders')
//                }
//            })
//         }
//     }
// }

// module.exports = orderController;


// const Order = require('../../../models/order')

// function orderController() {
//     return {
//         async index(req, res) {
//             try {
//                 const orders = await Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }})
//                                            .populate('customerId', '-password')
//                                            .execPopulate();
//                 if(req.xhr) {
//                     return res.json(orders);
//                 } else {
//                     return res.render('admin/orders');
//                 }
//             } catch (err) {
//                 // Handle error
//                 console.error(err);
//                 return res.status(500).send('Internal Server Error');
//             }
//         }
//     }
// } 

// module.exports = orderController;

const Order = require('../../../models/order')

function orderController() {
    return {
        index(req, res) {
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }})
                 .populate('customerId', '-password')
                 .exec((err, orders) => {
                     if (err) {
                         console.error(err);
                         return res.status(500).send('Internal Server Error');
                     }
                     if (req.xhr) {
                         return res.json(orders);
                     } else {
                         return res.render('admin/orders');
                     }
                 });
        }
    }
} 

module.exports = orderController;
