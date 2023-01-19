const mongoose = require('mongoose')
const validator = require('validator')
const id_validator = require ('mongoose-id-validator');
const isUrl = require('validator/lib/isURL'); // This is an external module which can be installed via npm

var ConferenceSchema = new mongoose.Schema({
    conferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        validate: {
          validator: function(v) {
            return mongoose.Types.ObjectId.isValid(v);
          },
          message: props => `${props.value} is not a valid ID!`
        },
    },
    
    id: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
          if (value < 0) {
              throw new Error('invalid id')
          }
      }
  },
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        validate: {
          validator: async function(v) {
            try {
              const { headers } = await rp({
                uri: v,
                method: 'HEAD',
                resolveWithFullResponse: true
              });
              return headers['content-type'].startsWith('image/');
            } catch (err) {
              return false;
            }
          },
          message: props => `${props.value} is not a valid image URL!`
        },
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
          try {
              new URL(value);
          } catch (_) {
              throw new Error('invalid url');
          }
      }
  },

  director: {
    type: String,
    required: true,
    trim: true
},

  series_number: {
    type: Number,
    default: 1,
    validate(value) {
        if (value < 1) {
            throw new Error('series number must be a postive number')
        }
    }
},

// date: {
//   type: String,
//   required: true,
//   validate: {
//       validator: function(v) {
//           const date = validator.toDate(v, 'DD.MM.YYYY')
//           return date != "Invalid Date" && validator.isAfter(date, new Date()) || validator.isEqual(date, new Date())
//       },
//       message: props => `${props.value} is not a valid date or not greater than or equal current date!`
//   }
// },

isSeries: {
  type: Boolean,
  required: true,
  default:false,
  validate: {
      validator: function(v) {
          return v === true || v === false;
      },
      message: props => `${props.value} is not a valid value for isSeries field!`
  }
},
 
    lectures: [{ type: mongoose.Schema.Types.ObjectId,
         ref: 'Lecture'}],
  }, 
  { timestamps: true });
  ConferenceSchema.plugin(id_validator);
  ConferenceSchema.index("completed");
  

const Conference = mongoose.model('Conference', ConferenceSchema);

module.exports = Conference

    



   