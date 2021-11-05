const express = require('express');
const bcrypt = require('bcryptjs');
const mailer = require('../../modules/mailer');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async (request, response) => {

    const { email } = request.body;

    try {

        if (await User.findOne({ email })) {
            return response.status(400).send({ error: 'User already exists' })
        }

        const user = await User.create(request.body);

        user.password = undefined;

        response.send({ 
            user, 
        });

    } catch (err) {
        return response.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (request, response) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email }).select('+password');

    console.log(user);

    if (!user) {
        return response.status(400).send({ error: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
        return response.status(400).send({ error: 'Invalid password' });
    }

    user.password = undefined;

    response.send({ 
        user, 
    });
});

router.post('/forgot_password', async (request, response) => {
    const { email } = request.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return response.status(400).send({ error: 'User not found' });
        }


        const now = new Date();
        now.setHours(now.setHours() + 1);

        mailer.sendMail({
            to: email,
            from: '',
            template: 'auth/forgot_password',
            context: { /*variaveis*/ }
        }, (err) => {
            if (err) {
                return response.status(400).send({ error: 'Cannot send forgot password email' });
            }

            return response.send()
        });

    } catch (err) {
        res.status(400).send({ error: 'Error on forgot password, try again' });
    }
});

router.post('/reset_password', async (request, response) => {
    const { email, password } = request.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return response.status(400).send({ error: 'User not found' });
        }

        user.password = password;

        await user.save();

        response.send();

    } catch (err) {
        response.status(400).send({ error: 'Cannot reset password, try again' });
    }
})

module.exports = app => app.use('/auth', router);