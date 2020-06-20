import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
import db from './db';
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user: { id: string }, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  db.query(
    `
      SELECT * 
      FROM users 
      WHERE id = $1;
    `,
    [id], (err: any, result: any) => {
      if (err) {
        throw Error(err);
      }

      const user = result.rows[0];
      done(null, user);
    }
  );
});


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: `${process.env.DOMAIN}/api/auth/github/callback`
},
  (
    accessToken: any,
    refreshToken: any,
    profile: any,
    done: any
  ) => {
    console.log('profile', profile)
    db.query(
      `
        SELECT * 
        FROM users 
        WHERE gh_id = $1;
      `,
      [profile.id], (err: any, result: any) => {
        if (err) {
          throw Error(err);
        }

        let user = result.rows[0];

        if (result.rows.length === 0) {
          db.query(
            `
              INSERT INTO users (username, gh_id, gh_displayname, gh_avatar, gh_profile_url)
              VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `,
            [
              profile.username,
              profile.id,
              profile.displayName,
              profile.photos[0].value,
              profile.profileUrl
            ], (err: any, result: any) => {
              if (err) {
                throw Error(err);
              }

              user = result.rows[0];
              done(null, user);
            }
          );
        } else {
          user = result.rows[0];
          done(null, user);
        }
      })
  }
));


passport.use(new LocalStrategy((username: string, password: string, done: any) => {
  
  db.query(`
  SELECT * FROM users
  WHERE username = $1;
`, [username], (err: any, result: any) => {
      if (err) {
        return console.log(err)
      }

      if (result.rows.length === 0) {
        return done(null, false);
      }

      const user = result.rows[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err || !isMatch) {
          done(null, false)
        }
        done(null, user)
      })
    })
  }
));