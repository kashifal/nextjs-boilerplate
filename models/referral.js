import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'STAKED', 'REWARDED'],
    default: 'PENDING'
  },
  stakeAmount: {
    type: Number,
    default: 0
  },
  reward: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Referral = mongoose.models.Referral || mongoose.model('Referral', referralSchema);
export default Referral; 