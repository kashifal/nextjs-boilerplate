import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    lowercase: true,
    trim: true
  },
   
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [3, 'Username must be at least 3 characters long']
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    default: 'ACTIVE',
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
}, { timestamps: true });

// Generate referral code before saving
userSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    // Generate a unique 8-character referral code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    // Keep generating until we find a unique code
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateCode();
      const existing = await mongoose.models.User.findOne({ referralCode: code });
      if (!existing) {
        isUnique = true;
      }
    }
    this.referralCode = code;
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 