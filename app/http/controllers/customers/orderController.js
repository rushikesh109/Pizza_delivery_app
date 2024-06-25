const Order = require('../../../models/order')
const moment = require('moment')
function orderController () {
    return {
        store(req, res) {
            // Validate request
            const { phone, address } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            try {
                const savedOrder =  order.save();
                
                // Populate customerId field
                const placedOrder = Order.populate(savedOrder, { path: 'customerId' });
                
                // Set flash message
                req.flash('success', 'Order placed successfully');
                
                // Clear cart from session
                delete req.session.cart;
                
                // Emit event
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('orderPlaced', placedOrder);
                
                // Redirect to orders page
                return res.redirect('/customer/orders');
            }catch(error){
                req.flash('error', 'something went wrong')
                return res.redirect('/cart')
            }
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } } )
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
    }
}

module.exports = orderController