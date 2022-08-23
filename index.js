const express=require('express')
const sql=require('sqlite3')
const app=express()
var md = require('markdown-it')();
const SQLite3 = sql.verbose();
const db = new SQLite3.Database('blog.db');
const http=require("http").Server(app)
const io=require("socket.io")(http)
const cookieParser=require("cookie-parser")
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())
const query = (command, method = 'all') => {
    return new Promise((resolve, reject) => {
      db[method](command, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
};
db.serialize(async () => {
    await query(`CREATE TABLE IF NOT EXISTS posts (
            id    INTEGER PRIMARY KEY AUTOINCREMENT,
            title varchar(255) NOT NULL,
            desc  text         NOT NULL,
            md    text         NOT NULL
        );`
    , 'run');
});

app.get('/', (req, res)=>{
    db.serialize(async ()=>{
        let posts = await query('SELECT * FROM posts')
        await res.render('index', {posts: posts})
    })
})
app.post('/test',(req, res)=>{
    db.serialize(async()=>{
        await console.log('post req success')
        let c=await query('select md from posts')
        await res.status(200).send(c).end()
    })
})
app.get('/createpost', (req, res)=>{
    res.render('createpost')
})
app.post('/newpost', (req, res)=>{
    db.serialize(async()=>{
        var n=await md.render(req.body.body)
        await db.run(`
            insert into posts (title, desc, md) 
            values (?, ?, ?);
        `, [req.body.title, req.body.desc, req.body.body])
        await res.sendStatus(200).end()
    })
})
app.listen(process.env.PORT || 6047, ()=>{
    console.log('http://localhost:6047/')
})