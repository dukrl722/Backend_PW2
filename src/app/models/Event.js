const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskEvent',
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;