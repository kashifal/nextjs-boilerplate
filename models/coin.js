import mongoose from 'mongoose';

// Duration sub-schema for the array of durations and percentages
const durationSchema = new mongoose.Schema({
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  percentage: {
    type: String,
    required: [true, 'Percentage is required']
  }
});

// Main coin schema
const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Coin name is required'],
    trim: true,
    unique: true,
    index: true
  },
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    trim: true,
    unique: true,
    index: true
  },
  logoUrl: {
    type: String,
    default: null
  },
  qrcode: {
    type: String,
    default: null
  },
  durationDays: {
    type: Number,
    required: [true, 'Duration days is required'],
    default: 14,
    min: [1, 'Duration days must be at least 1']
  },
  apy: {
    type: Number,
    required: [true, 'APY is required'],
    default: 12.2,
    min: [0, 'APY cannot be negative']
  },
  durations: {
    type: [durationSchema],
    default: [],
    validate: {
      validator: function(array) {
        return array.length > 0;
      },
      message: 'At least one duration is required'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  symbol: {
    type: String,
    required: true
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  versionKey: false // Removes the __v field
});

// Remove these index declarations since we already have index: true in the schema fields
// coinSchema.index({ name: 1 });
// coinSchema.index({ walletAddress: 1 });
coinSchema.index({ createdAt: -1 });

// Create the model if it doesn't exist, otherwise use the existing one
const Coin = mongoose.models.Coin || mongoose.model('Coin', coinSchema);

export default Coin;
