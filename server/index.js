const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const Subscription = require('./models/Subscription');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://michael:ar1ZwZi207mryMUB@pwa-db.3vsizg6.mongodb.net/pwa')
    .then(() => console.log("connected to mongodb"))
    .catch((error) => console.log(error));


const app = express();

app.use(cors())
app.use(express.json());

const publicVapidKey = "BAqAYADAWIdDqVw6ISqz69hzlH14yR4r8GtX-9fBqAENXOqo36kYKNV__1VXmzRxJC_jn2xniGKg2I-d84uUzt8";
const privateVapidKey = "4j6Cm5cguJM-bAJMMzjPQNuLnUcapYbA1UnPfj5yojg";
webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

app.post('/subscribe', async (req, res) => {
    const existingSubscription = await Subscription.findOne({ 'keys.auth': req.body.keys.auth });

    if (existingSubscription) {
        return res.status(400).send('Subscription already exist');
    }

    const subscription = new Subscription(req.body);
    subscription.save();

    res.status(200).json({});
})

app.post('/send-notif', async (req, res) => {
    try {
        const payload = {
            notification: {
                title: req.body.title,
                body: req.body.body,
                icon: req.body.icon
            }
        }

        const subscriptions = await Subscription.find({});

        if (subscriptions.length === 0) {
            return res.status(404).send('Aucune subscription trouvée.');
        }

        const sendNotifications = subscriptions.map(async (subscription) => {
            try {
                await webpush.sendNotification(subscription, JSON.stringify(payload));
            } catch (error) {
                console.error('Erreur lors de l\'envoi de la notification à une subscription :', error);
            }
        });
        await Promise.all(sendNotifications);

        res.status(200).json({ message: 'Notifications envoyées avec succès à toutes les subscriptions.' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi des notifications :', error);
        res.status(500).send('Erreur lors de l\'envoi des notifications.');
    }
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
})