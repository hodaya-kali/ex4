const mongoose = require('mongoose');
const id_validator = require ('mongoose-id-validator');
var validator = require('validator');
var LectureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return value.length > 2;
            },
            message: 'Name must be longer than 2 characters'
        }
    },
    imageUrl: {
            type: String,
            required: true,
            validate: {
                validator: function(value) {
                    return validator.isURL(value);
                },
                message: '{VALUE} is not a valid url'
            }
        },

site: {
        type: String,
        validate: {
            validator: function(value) {
                return validator.isURL(value);
            },
            message: '{VALUE} is not a valid url'
        }
    },
 
    // author: { type: mongoose.Schema.Types.ObjectId,
    //      ref: 'Conference',required:true},
 }, 
{ timestamps: true });
LectureSchema.plugin(id_validator);
LectureSchema.index("completed");


const Lecture = mongoose.model('Lecture', LectureSchema );

module.exports = Lecture