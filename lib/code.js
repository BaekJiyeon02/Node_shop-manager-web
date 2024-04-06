//202135973 백지연

const db = require('./db');
const sanitizeHtml = require('sanitize-html');
const { type } = require('express/lib/response');
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
            var sql2=`SELECT * FROM code_tbl;`
            db.query(sql1+sql2, (error, code) => {

                var i = 0;
                var tableData = ``
                console.log(code[1])
                if (0 >= code[1].length) {
                    tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
                }
                else {
                    if (vu == 'v') {
                        while (i < code.length) {
                            tableData += `<tr>
                                        <td>${code[1][i].main_id}</td>
                                        <td>${code[1][i].main_name}</td>
                                        <td>${code[1][i].sub_id}</td>
                                        <td>${code[1][i].sub_name}</td>
                                        <td>${code[1][i].start}</td> 
                                        <td>${code[1][i].end}</td> 
                                        </tr>`
                            i++;
                        }
                    }
                    else if (vu == 'u') {
                        while (i < code.length) {
                            tableData += `<tr>
                                        <td>${code[1][i].main_id}</td>
                                        <td>${code[1][i].main_name}</td>
                                        <td>${code[1][i].sub_id}</td>
                                        <td>${code[1][i].sub_name}</td>
                                        <td>${code[1][i].start}</td> 
                                        <td>${code[1][i].end}</td> 
                                        <td><a href="/code/update/${code[1][i].main_id}/${code[1][i].sub_id}">수정</a></td>
                                        <td><a href="/code/delete/${code[1][i].main_id}/${code[1][i].sub_id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></td>
                                        </tr>`
                            i++;
                        }

                    }
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'code.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: code[0]
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
        var sub_id = req.params.sub;
        var main_id = req.params.main;
        var sql1=`SELECT * FROM boardtype;`
        var sql2=`SELECT * FROM code_tbl where sub_id=${sub_id} and main_id=${main_id};`
        db.query(sql1+sql2, (error, code) => {
            var i = 0;

            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'codeCU.ejs',
                logined: 'YES',
                title: '코드 수정',
                list: code[1],
                formType: 'update',
                type: 'hidden',
                labelType: 'style="display: none;"',
                boardtype: code[0]

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
        sanitizedMainName = sanitizeHtml(post.main_name)
        sanitizedSubName = sanitizeHtml(post.sub_name)
        sanitizedStart = sanitizeHtml(post.start)
        sanitizedEnd = sanitizeHtml(post.end)
        sanitizedSaleSubId = sanitizeHtml(post.sub_id)
        sanitizedSaleMainId = sanitizeHtml(post.main_id)

        db.query(`UPDATE code_tbl SET main_name=?, sub_name=?, start=?, end=? where sub_id=? and main_id=?`,
            [sanitizedMainName, sanitizedSubName, sanitizedStart, sanitizedEnd, sanitizedSaleSubId, sanitizedSaleMainId], (error, result) => {
                if (error) {
                   

                    throw error;
                }
                res.redirect(`/code/view/u`)
                res.end();
            })
    },
    create: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var sql1=`SELECT * FROM boardtype;`
        db.query(sql1, (error, code) => {
            console.log(code[0])
        var context = {
            menu: 'menuForManager.ejs',
            who: req.session.name,
            body: 'codeCU.ejs',
            logined: 'YES',
            title: '코드 입력',
            list: [{}],
            formType: 'create',
            type: 'text',
            labelType: '',
            boardtype:code[0]
        };
        req.app.render('home', context, (err, html) => {
            if(err){
                console.log(err)
            }
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
        sanitizedMainId = sanitizeHtml(post.main_id)
        sanitizedMainName = sanitizeHtml(post.main_name)
        sanitizedSubId = sanitizeHtml(post.sub_id)
        sanitizedSubName = sanitizeHtml(post.sub_name)
        sanitizedStart = sanitizeHtml(post.start)
        sanitizedEnd = sanitizeHtml(post.end)

        db.query(`INSERT INTO code_tbl (main_Id, sub_Id, main_name, sub_name, start, end)
                        VALUES(?,?,?,?,?,?)`,
            [sanitizedMainId, sanitizedSubId,sanitizedMainName, sanitizedSubName, sanitizedStart, sanitizedEnd], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/code/view/v`)
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
        var mainId = req.params.main
        var subId = req.params.sub
        sanitizeMerId = sanitizeHtml(mainId)
        sanitizeSubId = sanitizeHtml(subId)


        db.query(`delete from code_tbl where main_id=? and sub_id=?;`,
            [sanitizeMerId, sanitizeSubId], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/code/view/u`)
                res.end();
            })
    },
}
