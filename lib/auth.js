//202135973 백지연
var db = require('./db');
const sanitizeHtml = require('sanitize-html');

function removeSpaces(inputString) {
    return inputString.replace(/\s+/g, '');
  }

module.exports = {
    login: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, btype) => {

            var context = {
                menu: 'menuForCustomer.ejs',
                who: '손님',
                body: 'login.ejs',
                logined: 'NO',
                boardtype:btype
            };
            req.app.render('home', context, (err, html) => {
                if(err){
                    console.log(err)
                }
                res.end(html);
            })
        })
    },
    login_process: (req, res) => {
        var post = req.body;
        console.log(post)
        db.query('select count(*) as num from person where loginid = ? and password = ?', [post.id, post.pwd], (error, results) => {
            if (results[0].num === 1) {
                db.query('select name, class from person where loginid = ? and password = ?', [post.id, post.pwd], (error, result) => {
                    req.session.is_logined = true;
                    req.session.name = result[0].name
                    req.session.class = result[0].class
                    req.session.loginid = post.id
                    res.redirect('/'); 
                })
            }
            else {
                req.session.is_logined = false; req.session.name = '손님'; req.session.class = '99';
                res.redirect('/');
            }
        })
    },
    logout_process: (req, res) => {
        
        req.session.destroy((err) => {
            if(err){
                console.log(err)
            }
            res.redirect('/auth/login');
        })
    },
    join:(req,res)=>{
        var context = {
            menu: 'menuForCustomer.ejs',
            who: '손님',
            body: 'join.ejs',
            logined: 'NO'
        };
        req.app.render('home', context, (err, html) => {
            res.end(html);
        })

    },
    join_process:(req,res)=>{
        console.log(req.body)
        var post = req.body;
        console.log(removeSpaces(post.id));

        // if(post.id.trim()=='' || post.pwd=='' || post.name=='' || post.add || post.tel || post.birth)
        sanitizedLoginId = sanitizeHtml(post.id)
        sanitizedPassword = sanitizeHtml(post.pwd)
        sanitizeName = sanitizeHtml(post.name)
        sanitizedAddress = sanitizeHtml(post.add)
        sanitizedTel = sanitizeHtml(post.tel)
        sanitizedBirth = sanitizeHtml(post.birth)

        db.query(`INSERT INTO person (loginid, password, name, address, tel, birth, class, point)
                        VALUES(?,?,?,?,?,?,'02',0)`,
            [sanitizedLoginId, sanitizedPassword, sanitizeName, sanitizedAddress, sanitizedTel, sanitizedBirth], (error, result) => {
                if (error) {
                    throw error;
                }
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: '손님',
                    body: 'login.ejs',
                    logined: 'NO'
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                })
            })
    }
}