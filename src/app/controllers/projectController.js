const express = require('express');

const Event = require('../models/Event');
const Task = require('../models/TaskEvent');

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const events = await Event.find().populate(['user', 'tasks']);

        return response.send({ events });

    } catch (err) {
        return response.status(400).send({ error: 'Error loading event' });
    }
});

router.get('/:eventId', async (request, response) => {
    try {
        const event = await Event.findById(request.params.eventId).populate(['user', 'tasks']);

        return response.send({ event });

    } catch (err) {
        return response.status(400).send({ error: 'Error loading event' });
    }
});

router.post('/', async (request, response) => {
    try {
        const { name, description, tasks } = request.body;

        const event = await Event.create({ name, description, user: request.userId });

        await Promise.all(tasks.map( async task => {
            const eventTask = new TaskEvent({ ...task, event: event._id });

            await eventTask.save();

            event.tasks.push(eventTask);
        }));

        await event.save();

        return response.send({ event });
    
    } catch (err) {
        return response.status(400).send({ error: 'Error creating new event' });
    }
});

router.put('/:eventId', async (request, response) => {
    try {
        const { name, description, tasks } = request.body;

        const event = await Event.findByIdAndUpdate(request.params.eventId, { 
            name, 
            description, 
        }, { new: true });

        event.tasks = [];

        await TaskEvent.remove({ event: event._id });

        await Promise.all(tasks.map( async task => {
            const eventTask = new TaskEvent({ ...task, event: event._id });

            await eventTask.save();

            event.tasks.push(eventTask);
        }));

        await event.save();

        return response.send({ event });
    
    } catch (err) {
        return response.status(400).send({ error: 'Error updating event' });
    }
});

router.delete('/:eventId', async (request, response) => {
    try {
        await Event.findByIdAndRemove(request.params.eventId);

        return response.send();

    } catch (err) {
        return response.status(400).send({ error: 'Error deleting event' });
    }
});

module.exports = app => app.use('/event', router);