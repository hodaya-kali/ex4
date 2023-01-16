const mongoose = require('mongoose');
const id_validator = require ('mongoose-id-validator');

var TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Conference',required:true},
}, { timestamps: true });
TaskSchema.plugin(id_validator);
TaskSchema.index("completed");


const Task = mongoose.model('Task', TaskSchema );

module.exports = Task