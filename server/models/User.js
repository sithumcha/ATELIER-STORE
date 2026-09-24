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
      default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVc9DU0FPf5cvkDbLsmajjIhrqxVzcprYSiMVl52H84IrGx-8KX7sAFTfDcCp_Jkh7ui-wjuxF_GCOTmZMC6FFSQ_1xmC1ln7j7_ag4eIyYD3NThID8SC7gXukjhUq_IQNeR0hA7sSSmKgP9OEScujERw4GKLr2iNdYSKBZt0gB_e3seq4o9Q31KXBbs09WpqRULVK9xwvPXKZ0tkFsNYyEjbYKTOi_uwg-44pt2XJPSoz8Q5QI2E',
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
