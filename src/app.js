const express = require('express');
const app = express();
const path = require('path');
const userAuth = require('./auth');
const db = require('./db_conn');
const bcrypt = require('bcryptjs')

const port = 8000;

const views_path = path.join(__dirname, '../public/views')
app.set('views', views_path);
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    try {
        res.status(200).render('login', {message: ''})
    } catch (error) {
        console.log(error);
    }
})

app.get('/register', async (req, res) => {
    try {
        res.render('register', {message: ''});
    } catch (error) {
        console.log(error);
    }
})

app.get('/index/:id', async(req,res)=>{
    try {
        res.status(200).render('index')
    } catch (error) {
        console.log(error);
    }
})

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, conPassword } = req.body
        db.query('SELECT email FROM users WHERE email = ?', [email], (error, result) => {
            if (error) {
                console.log(error);
            } if (result.length > 0) {
                return res.render('register', {message : 'email already exist'})
            }else if(password != conPassword){
                return res.render('register', {message: 'Password do not match'})
            }
            userAuth(password, (cb)=>{
                db.query('INSERT INTO users SET ?', {name: name, email:email, password: cb}, (error, result)=>{
                    if(error){
                        console.log(error)
                    }else{
                        console.log(result)
                        return res.redirect('/')
                    }
                })
            })
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/', async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        db.query('SELECT * FROM users WHERE email = ?', [email], (error, result) => {
            if (error) {
                console.log(error);
            } 
            bcrypt.compare(password,result[0].password, function(err,results){
                if(err){
                    console.log(err)
                }
                if(results){
                    return res.status(200).redirect(`/index/${result[0].id}`)
                }
                else{
                    return res.status(500).render('login', {message: 'Incorrect Cedentials'})
                }
            })
            })
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Server is running at port:${port}`);
})