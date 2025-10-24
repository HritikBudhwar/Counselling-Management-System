// // models/UserModel.js

// import db from '../config/db.js';
// import bcrypt from 'bcryptjs';

// const User = {
//   // Create a new user
//   create: async ({ username, email, password, role }) => {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await db.query(
//       "INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)",
//       [username, email, hashedPassword, role || 'student']
//     );
//     return result;
//   },

//   // Find a user by email
//   findByEmail: async (email) => {
//     const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
//     return rows[0]; // returns undefined if not found
//   },

//   // Find a user by ID
//   findById: async (user_id) => {
//     const [rows] = await db.query("SELECT * FROM Users WHERE user_id = ?", [user_id]);
//     return rows[0];
//   }
// };

// export default User;


// import db from '../config/db.js';
// import bcrypt from 'bcryptjs';

// const User = {
//   // Create a new user
//   create: async ({ username, email, password, role }) => {
//     const normalizedEmail = email.toLowerCase(); // normalize email
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await db.query(
//       "INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)",
//       [username, normalizedEmail, hashedPassword, role || 'student']
//     );
//     return result.insertId;
//   },

//   // Find a user by email
//   findByEmail: async (email) => {
//     const normalizedEmail = email.toLowerCase();
//     const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [normalizedEmail]);
//     return rows[0]; // returns undefined if not found
//   },

//   // Find a user by ID
//   findById: async (user_id) => {
//     const [rows] = await db.query("SELECT * FROM Users WHERE user_id = ?", [user_id]);
//     return rows[0];
//   }
// };

// export default User;


// models/UserModel.js
import db from '../config/db.js';

const User = {
  create: async ({ username, email, password, role }) => {
    // password hashing is handled in controller
    const [result] = await db.query(
      "INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username.trim(), email.trim().toLowerCase(), password, role || 'student']
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM Users WHERE email = ?",
      [email.trim().toLowerCase()]
    );
    return rows[0];
  },
};

export default User;


