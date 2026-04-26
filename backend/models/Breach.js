const mongoose = require('mongoose');

const breachSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  breaches: [{
    name: {
      type: String,
      required: true
    },
    domain: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    compromisedData: [{
      type: String
    }],
    isResolved: {
      type: Boolean,
      default: false
    }
  }],
  checkedAt: {
    type: Date,
    default: Date.now
  },
  totalBreaches: {
    type: Number,
    default: 0,
    min: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Breach', breachSchema);