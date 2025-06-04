import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import { Express, Request, Response } from 'express';
import { storage } from './storage';
import { generateToken } from './auth';

// You'll need to add these environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID || '';
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID || '';
const APPLE_KEY_ID = process.env.APPLE_KEY_ID || '';
const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:5000';

export const setupOAuth = (app: Express) => {
  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google Strategy
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${CALLBACK_URL}/api/auth/google/callback`,
      scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
        
        if (!user) {
          // Create new user
          user = await storage.createUser({
            username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || '',
            email: profile.emails?.[0]?.value || '',
            password: '', // Empty password for OAuth users
            credits: 100, // Give new users free credits
            premium: false,
            plan: 'basic',
            profileImageUrl: profile.photos?.[0]?.value,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }));
  }

  // Apple Strategy
  if (APPLE_CLIENT_ID && APPLE_TEAM_ID && APPLE_KEY_ID && APPLE_PRIVATE_KEY) {
    passport.use(new AppleStrategy({
      clientID: APPLE_CLIENT_ID,
      teamID: APPLE_TEAM_ID,
      keyID: APPLE_KEY_ID,
      privateKeyString: APPLE_PRIVATE_KEY,
      callbackURL: `${CALLBACK_URL}/api/auth/apple/callback`,
      scope: ['name', 'email']
    }, async (req, accessToken, refreshToken, idToken, profile, done) => {
      try {
        // Apple profile is different from Google, we need to parse it
        const appleInfo = profile as any;
        const email = appleInfo.email;
        const name = appleInfo.name?.firstName 
          ? `${appleInfo.name.firstName} ${appleInfo.name.lastName || ''}`
          : email.split('@')[0];
        
        // Check if user exists
        let user = await storage.getUserByEmail(email);
        
        if (!user) {
          // Create new user
          user = await storage.createUser({
            username: name,
            email: email,
            password: '', // Empty password for OAuth users
            credits: 100, // Give new users free credits
            premium: false,
            plan: 'basic',
            profileImageUrl: '', // Apple doesn't provide a profile image
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }));
  }

  // Initialize passport
  app.use(passport.initialize());
  
  // Google auth routes
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req: Request, res: Response) => {
      // Create JWT token
      const token = generateToken((req.user as any).id);
      
      // Set token cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Redirect to home page
      res.redirect('/');
    }
  );
  
  // Apple auth routes
  app.get('/api/auth/apple',
    passport.authenticate('apple')
  );

  app.post('/api/auth/apple/callback',
    passport.authenticate('apple', { failureRedirect: '/login' }),
    (req: Request, res: Response) => {
      // Create JWT token
      const token = generateToken((req.user as any).id);
      
      // Set token cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // Redirect to home page
      res.redirect('/');
    }
  );
};