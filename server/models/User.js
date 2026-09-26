// User Database Model
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tier: { type: String, default: 'Patron Tier I' },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Password match kireema (bcrypt.compare)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Password hash kireeme middleware (pre-save hook)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
