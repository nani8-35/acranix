import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'acranix_super_secret_jwt_key_2026';
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Interface definitions
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface PasswordResetRecord {
  id: string;
  email: string;
  otp: string; // 6-digit OTP
  expiresAt: number;
  verified: boolean;
  resetToken?: string;
  attempts: number;
  createdAt: number;
}

export interface JoinSubmissionRecord {
  id: string;
  name: string;
  email: string;
  discipline: string;
  portfolioOrGithub: string;
  message: string;
  submittedAt: string;
  isRead: boolean;
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  notes?: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  passwordResetRequests: PasswordResetRecord[];
  submissions: JoinSubmissionRecord[];
}

// Ensure data folder and db file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getDefaultDatabase(): DatabaseSchema {
  const adminPasswordHash = bcrypt.hashSync('logiN@12', 10);
  const userPasswordHash = bcrypt.hashSync('Password123!', 10);

  return {
    users: [
      {
        id: 'usr_admin_akash',
        name: 'Akash Yeginati',
        email: 'akashyeginati@acranix.com',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        createdAt: '2026-01-15T09:00:00.000Z',
      },
      {
        id: 'usr_regular_akash',
        name: 'Akash',
        email: 'akash@gmail.com',
        passwordHash: userPasswordHash,
        role: 'USER',
        createdAt: '2026-02-10T11:00:00.000Z',
      },
    ],
    passwordResetRequests: [],
    submissions: [
      {
        id: 'sub_init_01',
        name: 'David Chen',
        email: 'david.chen@mit.edu',
        discipline: 'AI Systems & Reasoning Architecture',
        portfolioOrGithub: 'https://github.com/dchen-reasoning',
        message: 'Exploring deterministic cognitive branch pruning and low-latency inference pipelines. Interested in collaborating on ACRANIX core engine.',
        submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        isRead: false,
        status: 'new',
      },
      {
        id: 'sub_init_02',
        name: 'Sarah Jenkins',
        email: 's.jenkins@stanford.edu',
        discipline: 'Human-Computer Interface Design',
        portfolioOrGithub: 'https://sarahj.design',
        message: 'Passionate about designing human-AI cognitive interfaces that reduce executive load during complex decision making.',
        submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        isRead: false,
        status: 'new',
      },
    ],
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      const loadedUsers = (parsed.users || []) as UserRecord[];
      
      // Ensure admin user akashyeginati@acranix.com exists and has password logiN@12
      const adminIdx = loadedUsers.findIndex(
        (u) => u.email.toLowerCase() === 'akashyeginati@acranix.com'
      );
      const adminPasswordHash = bcrypt.hashSync('logiN@12', 10);

      if (adminIdx >= 0) {
        loadedUsers[adminIdx].passwordHash = adminPasswordHash;
        loadedUsers[adminIdx].role = 'ADMIN';
      } else {
        loadedUsers.push({
          id: 'usr_admin_akash',
          name: 'Akash Yeginati',
          email: 'akashyeginati@acranix.com',
          passwordHash: adminPasswordHash,
          role: 'ADMIN',
          createdAt: '2026-01-15T09:00:00.000Z',
        });
      }

      const database: DatabaseSchema = {
        users: loadedUsers,
        passwordResetRequests: parsed.passwordResetRequests || [],
        submissions: parsed.submissions || [],
      };
      saveDatabase(database);
      return database;
    }
  } catch (err) {
    console.error('Failed reading DB file, initializing default:', err);
  }

  const defaultDb = getDefaultDatabase();
  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed saving database:', err);
  }
}

// In-memory reference with automatic persistence
let db = loadDatabase();

// In-memory rate limiting map for OTP requests: email -> lastRequestedTimestamp
const otpRateLimitMap = new Map<string, number>();

// Extend Express Request interface for Auth
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
  };
}

// Authentication Middleware
function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token' });
    }
    req.user = decoded as AuthRequest['user'];
    next();
  });
}

// Admin Authorization Middleware
function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access denied. Administrator privileges required.',
        requiresAdmin: true,
      });
    }
    next();
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // -------------------------------------------------------------
  // 1. HEALTH & METADATA
  // -------------------------------------------------------------
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      system: 'ACRANIX Core Intelligence Backend',
      timestamp: new Date().toISOString(),
    });
  });

  // -------------------------------------------------------------
  // 2. AUTHENTICATION ENDPOINTS
  // -------------------------------------------------------------

  // POST /api/auth/signup
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Profile Name is required.' });
      }

      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email Address is required.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const normalizedEmail = email.trim().toLowerCase();

      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long.',
        });
      }

      // Check for duplicate registration
      const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existingUser) {
        return res.status(409).json({
          error: 'An account with this email address already exists. Please sign in.',
        });
      }

      // Determine role: Founder email gets ADMIN, otherwise USER
      const role: 'USER' | 'ADMIN' =
        normalizedEmail === 'akashyeginati@acranix.com' ? 'ADMIN' : 'USER';

      // Secure password hash
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const newUser: UserRecord = {
        id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role,
        createdAt: new Date().toISOString(),
      };

      db.users.push(newUser);
      saveDatabase(db);

      // Generate JWT session token
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Account created successfully.',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      });
    } catch (err) {
      console.error('Signup error:', err);
      return res.status(500).json({ error: 'Internal server error during account creation.' });
    }
  });

  // POST /api/auth/signin
  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return res.status(401).json({
          error: 'No account found with this email. Please check your email or create an account.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password. Please try again.' });
      }

      // Check if admin role needs to be maintained for founder
      if (normalizedEmail === 'akashyeginati@acranix.com' && user.role !== 'ADMIN') {
        user.role = 'ADMIN';
        saveDatabase(db);
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Sign in successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      console.error('Signin error:', err);
      return res.status(500).json({ error: 'Internal server error during sign in.' });
    }
  });

  // GET /api/auth/me - Verify session
  app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res) => {
    const user = db.users.find((u) => u.id === req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  });

  // POST /api/auth/update-profile
  app.post('/api/auth/update-profile', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { name, email } = req.body;
      const user = db.users.find((u) => u.id === req.user?.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (name && name.trim()) {
        user.name = name.trim();
      }

      if (email && email.trim()) {
        const normalized = email.trim().toLowerCase();
        const existing = db.users.find((u) => u.email.toLowerCase() === normalized && u.id !== user.id);
        if (existing) {
          return res.status(409).json({ error: 'Email already in use by another account.' });
        }
        user.email = normalized;
      }

      saveDatabase(db);

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Profile updated successfully.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      console.error('Update profile error:', err);
      return res.status(500).json({ error: 'Failed to update profile.' });
    }
  });

  // -------------------------------------------------------------
  // 3. FORGOT PASSWORD & OTP WORKFLOW
  // -------------------------------------------------------------

  // Step 1: POST /api/auth/forgot-password/send-otp
  app.post('/api/auth/forgot-password/send-otp', (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email address is required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        // Return 404 with friendly message
        return res.status(404).json({
          error: 'No account registered with this email address.',
        });
      }

      // Rate limiting: 60 seconds minimum interval
      const lastRequest = otpRateLimitMap.get(normalizedEmail);
      const now = Date.now();
      if (lastRequest && now - lastRequest < 60000) {
        const waitSeconds = Math.ceil((60000 - (now - lastRequest)) / 1000);
        return res.status(429).json({
          error: `Please wait ${waitSeconds} seconds before requesting a new verification code.`,
          retryAfter: waitSeconds,
        });
      }

      // Generate secure 6-digit OTP
      const otpNumber = crypto.randomInt(100000, 999999);
      const otpString = otpNumber.toString();
      const expiresAt = now + 10 * 60 * 1000; // 10 minutes validity

      // Invalidate previous active OTPs for this email
      db.passwordResetRequests = db.passwordResetRequests.filter(
        (r) => r.email.toLowerCase() !== normalizedEmail || r.verified
      );

      const resetRecord: PasswordResetRecord = {
        id: `rst_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        email: normalizedEmail,
        otp: otpString,
        expiresAt,
        verified: false,
        attempts: 0,
        createdAt: now,
      };

      db.passwordResetRequests.push(resetRecord);
      saveDatabase(db);
      otpRateLimitMap.set(normalizedEmail, now);

      console.log(`[ACRANIX Security Engine] 6-digit OTP generated for ${normalizedEmail}: ${otpString} (Valid for 10 mins)`);

      return res.json({
        message: 'We sent a 6-digit verification code to your email.',
        email: normalizedEmail,
        expiresInSeconds: 600,
        // In local/sandbox preview environment, we provide the test notification so you can test smoothly
        devHintOtp: otpString,
      });
    } catch (err) {
      console.error('Send OTP error:', err);
      return res.status(500).json({ error: 'Failed to dispatch verification code.' });
    }
  });

  // Step 2: POST /api/auth/forgot-password/verify-otp
  app.post('/api/auth/forgot-password/verify-otp', (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and 6-digit OTP are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedOtp = otp.toString().trim();

      const record = db.passwordResetRequests.find(
        (r) => r.email.toLowerCase() === normalizedEmail && !r.verified
      );

      if (!record) {
        return res.status(400).json({
          error: 'No active password reset request found. Please request a new code.',
        });
      }

      if (Date.now() > record.expiresAt) {
        return res.status(400).json({
          error: 'Verification code has expired. Please request a new OTP.',
          expired: true,
        });
      }

      // Check max attempts (5 maximum)
      if (record.attempts >= 5) {
        return res.status(429).json({
          error: 'Too many incorrect attempts. Please request a new verification code.',
        });
      }

      record.attempts += 1;

      if (record.otp !== normalizedOtp) {
        saveDatabase(db);
        return res.status(400).json({
          error: 'Invalid 6-digit verification code. Please check and try again.',
          attemptsRemaining: 5 - record.attempts,
        });
      }

      // OTP Validated! Issue single-use reset token
      const resetToken = `tok_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
      record.verified = true;
      record.resetToken = resetToken;
      saveDatabase(db);

      return res.json({
        message: 'OTP verified successfully.',
        resetToken,
      });
    } catch (err) {
      console.error('Verify OTP error:', err);
      return res.status(500).json({ error: 'Failed to verify code.' });
    }
  });

  // Step 3: POST /api/auth/forgot-password/reset-password
  app.post('/api/auth/forgot-password/reset-password', async (req, res) => {
    try {
      const { email, resetToken, newPassword } = req.body;

      if (!email || !resetToken || !newPassword) {
        return res.status(400).json({
          error: 'Email, verification token, and new password are required.',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long.',
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Find verified reset record
      const recordIndex = db.passwordResetRequests.findIndex(
        (r) =>
          r.email.toLowerCase() === normalizedEmail &&
          r.verified &&
          r.resetToken === resetToken
      );

      if (recordIndex === -1) {
        return res.status(403).json({
          error: 'Invalid or expired password reset session. Please request a new OTP.',
        });
      }

      const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Hash new password
      const newHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = newHash;

      // Invalidate the reset request so it cannot be reused
      db.passwordResetRequests.splice(recordIndex, 1);
      saveDatabase(db);

      return res.json({
        message: 'Your password has been reset successfully.',
        success: true,
      });
    } catch (err) {
      console.error('Reset password error:', err);
      return res.status(500).json({ error: 'Failed to reset password.' });
    }
  });

  // -------------------------------------------------------------
  // 4. JOIN US SUBMISSIONS (PUBLIC INTAKE)
  // -------------------------------------------------------------

  // POST /api/submissions - Public visitor form submission
  app.post('/api/submissions', (req, res) => {
    try {
      const { name, email, discipline, portfolioOrGithub, message } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required.' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email is required.' });
      }

      const newSubmission: JoinSubmissionRecord = {
        id: `sub_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        discipline: discipline || 'AI Systems & Reasoning Architecture',
        portfolioOrGithub: (portfolioOrGithub || '').trim(),
        message: (message || '').trim(),
        submittedAt: new Date().toISOString(),
        isRead: false,
        status: 'new',
      };

      db.submissions.unshift(newSubmission);
      saveDatabase(db);

      console.log(`[ACRANIX Intake] New Join Us submission received from ${newSubmission.name} (${newSubmission.email})`);

      return res.status(201).json({
        message: 'Application recorded successfully.',
        submissionId: newSubmission.id,
      });
    } catch (err) {
      console.error('Submission intake error:', err);
      return res.status(500).json({ error: 'Failed to record submission.' });
    }
  });

  // -------------------------------------------------------------
  // 5. ADMIN-ONLY SUBMISSIONS & INBOX ENDPOINTS
  // -------------------------------------------------------------

  // GET /api/admin/submissions - Protected (ADMIN only)
  app.get('/api/admin/submissions', requireAdmin, (req: AuthRequest, res) => {
    const sorted = [...db.submissions].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    const unreadCount = sorted.filter((s) => !s.isRead).length;

    return res.json({
      submissions: sorted,
      totalCount: sorted.length,
      unreadCount,
    });
  });

  // GET /api/admin/stats - Protected (ADMIN only)
  app.get('/api/admin/stats', requireAdmin, (req: AuthRequest, res) => {
    const unreadCount = db.submissions.filter((s) => !s.isRead).length;
    return res.json({
      totalSubmissions: db.submissions.length,
      unreadCount,
      totalUsers: db.users.length,
    });
  });

  // PATCH /api/admin/submissions/:id - Protected (ADMIN only)
  app.patch('/api/admin/submissions/:id', requireAdmin, (req: AuthRequest, res) => {
    const { id } = req.params;
    const { isRead, status, notes } = req.body;

    const submission = db.submissions.find((s) => s.id === id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    if (typeof isRead === 'boolean') {
      submission.isRead = isRead;
    }

    if (status && ['new', 'reviewed', 'contacted', 'archived'].includes(status)) {
      submission.status = status;
    }

    if (notes !== undefined) {
      submission.notes = notes;
    }

    saveDatabase(db);

    const unreadCount = db.submissions.filter((s) => !s.isRead).length;
    return res.json({
      message: 'Submission updated.',
      submission,
      unreadCount,
    });
  });

  // POST /api/admin/submissions/mark-all-read - Protected (ADMIN only)
  app.post('/api/admin/submissions/mark-all-read', requireAdmin, (req: AuthRequest, res) => {
    db.submissions.forEach((s) => {
      s.isRead = true;
    });
    saveDatabase(db);
    return res.json({ message: 'All submissions marked as read.', unreadCount: 0 });
  });

  // DELETE /api/admin/submissions/:id - Protected (ADMIN only)
  app.delete('/api/admin/submissions/:id', requireAdmin, (req: AuthRequest, res) => {
    const { id } = req.params;
    const initialLength = db.submissions.length;
    db.submissions = db.submissions.filter((s) => s.id !== id);

    if (db.submissions.length === initialLength) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    saveDatabase(db);
    const unreadCount = db.submissions.filter((s) => !s.isRead).length;
    return res.json({
      message: 'Submission deleted.',
      unreadCount,
      totalCount: db.submissions.length,
    });
  });

  // -------------------------------------------------------------
  // 6. VITE MIDDLEWARE / PRODUCTION STATIC FALLBACK
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ACRANIX] Server operational at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
