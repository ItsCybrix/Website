const express =  require('express')

const admin = express.Router()


const db = require('../custom_modules/sql/db_connector')

// === Middleware: check admin ===
function requireAdmin(req, res, next) {
  const user = res.locals.user;

  if (!user) {
    res.redirect('/users/login')
  }

  if (user.level == 'admin' || user.level == 'Owner') {
  next();

  }else{
    res.redirect('/');
  }

}


admin.use(requireAdmin)

admin.get('/', (req, res)=>{
    res.render('admin/admin')
});

admin.get('/PageBuilder', (req, res)=>{
            db.query("SELECT * FROM pages", (err, result) => {
        if (err) {
            console.error("DB error in middleware:", err);
            return res.status(500).send("Server error");
        }



        res.locals.pages = result

        res.render('admin/pageBuilder');


    })
})


admin.get('/pagebuilder/edit/:id', (req, res)=>{
    
                db.query("SELECT * FROM pages WHERE ID=?", [req.params.id], (err, result) => {
        if (err) {
            console.error("DB error in middleware:", err);
            return res.status(500).send("Server error");
        }

        if(result.length === 0){
            res.render('error/404');
        }else{
        res.locals.page = result[0]

        res.render('admin/pageBuilderEditor');
        }

        res.locals.pages = result



    })
})

admin.post('/pagebuilder/edit/:id', (req, res)=>{
                db.query("UPDATE pages SET title=?, url=?, content=? WHERE ID = ?", [req.body.title, req.body.url, req.body.content, req.params.id], function (err2) {
                if (err2) {
                    return res.send("DATABASE ERROR " + err2);
                }



                res.redirect('/admin/pagebuilder'); // or wherever you want after login
            });
})





module.exports = admin