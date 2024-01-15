
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3003;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MySQL
const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'root_password', // Use your MySQL root password
  database: 'etudiant',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Création d'une table pour les étudiants
const createStudentsTable = `
  CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(255) NOT NULL
  )
`;

pool.query(createStudentsTable)
  .then(() => console.log('Table created'))
  .catch((err) => console.error('Error creating table:', err));

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.render('index', { students: rows });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Une erreur est survenue lors de la récupération des étudiants.');
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { name, age, email } = req.body;

  // Validation des données 
  if (!name || !age || !email) {
    return res.status(400).send('Tous les champs sont obligatoires.');
  }

  // Insertion d'un nouvel étudiant
  try {
    await pool.execute('INSERT INTO students (name, age, email) VALUES (?, ?, ?)', [name, age, email]);
    res.redirect('/');
  } catch (error) {
    console.error('Error inserting student:', error);
    res.status(500).send('Une erreur est survenue lors de l\'inscription.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



//================================================

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const ejs = require('ejs');

// const app = express();
// const port = 3000;

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));

// //Connexion à MongoDB
// mongoose.connect('mongodb://localhost:27017/etudiant', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // useCreateIndex: true,      
//   // useFindAndModify: false, 
// });

// // Création d'un schéma de modèle pour la collection
// const studentSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   email: String,
// });

// // Création d'un modèle basé sur le schéma
// const Student = mongoose.model('Student', studentSchema);

// app.get('/', async (req, res) => {
//   const students = await Student.find();
//   res.render('index', { students });
// });

// app.get('/register', (req, res) => {
//   res.render('register');
// });

// app.post('/register', async (req, res) => {
//   const { name, age, email } = req.body;

//   // Validation des données 
//   if (!name || !age || !email) {
//     return res.status(400).send('Tous les champs sont obligatoires.');
//   }

//   // Création d'un nouvel étudiant
//   const newStudent = new Student({ name, age, email });

//   try {
//     await newStudent.save();
//     res.redirect('/');
//   } catch (error) {
//     res.status(500).send('Une erreur est survenue lors de l\'inscription.');
//   }
// });


// // app.get('/', (req, res) => {
// //   res.send('Hello Docker!');
// // });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
