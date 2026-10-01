// User API Routes
import express from 'express';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar, tier, address } = req.body;

    const userExists = await User.findOne({ email: email?.toLowerCase()?.trim() });
    if (userExists) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    const user = await User.create({
      name: name || 'New Collector',
      email: email?.toLowerCase()?.trim(),
      password: password || '123456',
      avatar: avatar || undefined,
      tier: tier || 'Verified Patron',
      address: address || {},
    });

    res.status(201).json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        avatar: user.avatar,
        address: user.address,
      },
      token: generateToken(user._id),
      message: 'Registration successful!',
    });
  } catch (error) {
    res.status(500).json({ message: 'User registration failed', error: error.message });
  }
});

// 2. User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase()?.trim() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          tier: user.tier,
          avatar: user.avatar,
          address: user.address,
        },
        token: generateToken(user._id),
        message: 'Login successful!',
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// 2.5 Google Auth Login / Register
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, avatar, googleId } = req.body;
    const cleanEmail = email ? String(email).toLowerCase().trim() : '';

    if (!cleanEmail) {
      return res.status(400).json({ message: 'Google email is required' });
    }

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const defaultAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || cleanEmail.split('@')[0])}&background=1c1917&color=f5f5f4&bold=true`;
      user = await User.create({
        name: name || cleanEmail.split('@')[0] || 'Google Patron',
        email: cleanEmail,
        password: `g_oauth_${googleId || Date.now()}_${Math.random()}`,
        avatar: defaultAvatar,
        tier: 'Verified Patron',
        address: {},
      });
      console.log(`[GOOGLE AUTH] Created new user: ${user.email}`);
    } else {
      if (avatar && (!user.avatar || user.avatar.includes('ui-avatars.com'))) {
        user.avatar = avatar;
        await user.save();
      }
      console.log(`[GOOGLE AUTH] Logged in existing user: ${user.email}`);
    }

    res.json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        tier: user.tier || 'Verified Patron',
        avatar: user.avatar,
        address: user.address || {},
      },
      token: generateToken(user._id),
      message: 'Google Sign-In successful!',
    });
  } catch (error) {
    console.error('Google Auth Route Error:', error);
    res.status(500).json({ message: 'Google Auth failed', error: error.message });
  }
});

// 3. Update Profile (PUT /api/users/update-profile or /api/users/profile)
const handleUpdateProfile = async (req, res) => {
  try {
    const { id, email, name, avatar, tier, address } = req.body;
    let user = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(id);
    }
    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (user) {
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase().trim();
      if (avatar) user.avatar = avatar;
      if (tier) user.tier = tier;
      if (address) user.address = { ...user.address, ...address };

      await user.save();
      return res.json({
        message: 'Profile updated in MongoDB successfully',
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          tier: user.tier,
          avatar: user.avatar,
          address: user.address,
        },
      });
    } else {
      // Create user if not in DB yet
      const newUser = await User.create({
        name: name || 'Verified Patron',
        email: email ? email.toLowerCase().trim() : 'patron@atelierstore.com',
        password: 'password123',
        avatar: avatar || undefined,
        tier: tier || 'Verified Patron',
        address: address || {},
      });

      return res.status(201).json({
        message: 'Profile saved to MongoDB database successfully',
        user: {
          id: newUser._id,
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          tier: newUser.tier,
          avatar: newUser.avatar,
          address: newUser.address,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user profile', error: error.message });
  }
};

router.put('/update-profile', handleUpdateProfile);
router.put('/profile', handleUpdateProfile);

// 4. User Profile (Protected Route)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
});

// 5. All Users (Admin Registry)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// 6. Delete User
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

export default router;
