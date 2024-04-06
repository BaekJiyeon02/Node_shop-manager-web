//202135973 백지연

const db = require('./db');
const sanitizeHtml = require('sanitize-html');

function authIsOwner(req, res) {
    if (req.session.class=='01') {
        return true;
    } else {
    }
    return false
}

module.exports = {
    view: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {
            var vu = req.params.vu;
            var sql1=`SELECT * FROM boardtype;`
            var sql2=`SELECT * FROM person;`
            db.query(sql1+sql2, (error, person) => {

                var i = 0;
                var tableData = ``
                if (0 >= person[1].length) {
                    tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
                }
                else {
                    if (vu == 'v') {
                        while (i < person[1].length) {
                            tableData += `<tr>
                                        <td>${person[1][i].loginid}</td>
                                        <td>${person[1][i].password}</td>
                                        <td>${person[1][i].name}</td>
                                        <td>${person[1][i].address}</td>
                                        <td>${person[1][i].tel}</td> 
                                        <td>${person[1][i].birth}</td> 
                                        <td>${person[1][i].class}</td> 
                                        <td>${person[1][i].point}</td> 
                                        </tr>`
                            i++;
                        }
                    }
                    else if (vu == 'u') {
                        console.log()
                        while (i < person[1].length) {
                            tableData += `<tr>
                                        <td>${person[1][i].loginid}</td>
                                        <td>${person[1][i].password}</td>
                                        <td>${person[1][i].name}</td>
                                        <td>${person[1][i].address}</td>
                                        <td>${person[1][i].tel}</td> 
                                        <td>${person[1][i].birth}</td> 
                                        <td>${person[1][i].class}</td> 
                                        <td>${person[1][i].point}</td> 
                                        <td><a href="/person/update/${person[1][i].loginid}">수정</a></td>
                                        <td><a href="/person/delete/${person[1][i].loginid}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></td>
                                        </tr>`
                            i++;
                        }

                    }
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'person.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: person[0]
                };
                req.app.render('home', context, (err, html) => {
                    res.send(html)
                })
            });
        }
    },
    update: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }

        var loginid = req.params.loginid;
        var sql1=`SELECT * FROM boardtype;`
        var sql2=`SELECT * FROM person where loginid='${loginid}';`
        db.query(sql1+sql2, (error, person) => {
            if(error){
                console.log(error)
            }

            console.log(person);
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'personCU.ejs',
                logined: 'YES',
                title: '사용자 수정',
                list: person[1],
                actionLocation: "/person/update_process",
                lockOption:'readonly',
                boardtype:person[0]
            };
            req.app.render('home', context, (err, html) => {
                res.send(html)
            })
        })

    },
    update_process: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var post = req.body;
        sanitizedLoginId = sanitizeHtml(post.id)
        sanitizedPassword = sanitizeHtml(post.pwd)
        sanitizedName = sanitizeHtml(post.name)
        sanitizedAddress = sanitizeHtml(post.add)
        sanitizedTel = sanitizeHtml(post.tel)
        sanitizedBirth = sanitizeHtml(post.birth)
        sanitizedClass = sanitizeHtml(post.class)
        sanitizedPoint = sanitizeHtml(post.point)
        
        console.log(sanitizedClass, sanitizedPoint)
        db.query(`UPDATE person SET  password=?, name=?, address=?, tel=?, birth=?, class=?, point=? where loginid=?`,
            [sanitizedPassword, sanitizedName, sanitizedAddress, sanitizedTel, sanitizedBirth, sanitizedClass, Number(sanitizedPoint), sanitizedLoginId], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/person/view/u`)
                res.end();
            })
    },
    create: (req, res) => {
        db.query('SELECT * FROM boardtype', (error, btype) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var context = {
            menu: 'menuForManager.ejs',
            who: req.session.name,
            body: 'personCU.ejs',
            logined: 'YES',
            title: '사용자 입력',
            list: [{}],
            actionLocation: "/person/create_process",
            lockOption:'',
            boardtype:btype[0]

        };
        req.app.render('home', context, (err, html) => {
            if(err){console.log(err)}
            res.send(html)
        })
    })
    },
    create_process: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var post = req.body;
        sanitizedLoginId = sanitizeHtml(post.id)
        sanitizedPassword = sanitizeHtml(post.pwd)
        sanitizedName = sanitizeHtml(post.name)
        sanitizedAddress = sanitizeHtml(post.add)
        sanitizedTel = sanitizeHtml(post.tel)
        sanitizedBirth = sanitizeHtml(post.birth)
        sanitizedClass = sanitizeHtml(post.class)
        sanitizedPoint = sanitizeHtml(Number(post.point))

        db.query(`INSERT INTO person (loginid, password, name, address, tel, birth, class, point) VALUES(?,?,?,?,?,?,?,?)`,
            [sanitizedLoginId, sanitizedPassword, sanitizedName, sanitizedAddress, sanitizedTel, sanitizedBirth, sanitizedClass, Number(sanitizedPoint)], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/person/view/v`)
                res.end(); 
            })
    },
    delete_process: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var loginId = req.params.loginid
        sanitizeLoginId = sanitizeHtml(loginId)

        db.query(`delete from person where loginId=?;`,
            [sanitizeLoginId], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/person/view/u`)
                res.end();
            })
    },
}
