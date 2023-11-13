const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    endpoint: String,
    expirationTime: Number,
    keys: {
        auth: String,
        p256dh: String
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;