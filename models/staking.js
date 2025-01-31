import mongoose from "mongoose";

const stakingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coin',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration must be at least 1 day']
  },
  apy: {
    type: Number,
    required: true
  },
  autoStaking: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  dailyProfits: {
    type: [{
      date: Date,
      profit: Number
    }],
    default: []
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

const Staking = mongoose.models.Staking || mongoose.model('Staking', stakingSchema);

export default Staking;