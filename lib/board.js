//202135973 백지연

const db = require('./db');
const sanitizeHtml = require('sanitize-html');
const { type } = require('express/lib/response');
const { dateOfEightDigit } = require('./template')

function authIsOwner(req, res) {
    if (req.session.class == '01') {
        return true;
    } else {
    }
    return false
}

module.exports = {
    type_view: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {

            db.query('SELECT * FROM boardtype', (error, btype) => {

                var i = 0;
                var tableData = ``
                tableData += `
                            <thead>
                            <td>제목</td><td>페이지당 글 수 </td><td>설명</td><td>일반 사용자 쓰기 가능 여부</td><td>댓글 가능 여부</td>
                            </thead>`

                if (0 >= btype.length) {
                    tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
                }
                else {
                    while (i < btype.length) {
                        tableData += `
                                        <tr>
                                        <td>${btype[i].title}</td>
                                        <td>${btype[i].numPerPage}</td> 
                                        <td>${btype[i].description}</td>
                                        <td>${btype[i].write_YN}</td>
                                        <td>${btype[i].re_YN}</td>
                                        <td><a href="/board/type/update/${btype[i].type_id}">수정</a></td>
                                        <td><a href="/board/type/delete/${btype[i].type_id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></td>
                                        </tr>`
                        i++;
                    }
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'boardtype.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: btype
                };
                req.app.render('home', context, (err, html) => {
                    res.send(html)
                })
            });
        }
    },


    type_create: (req, res) => {
        if (authIsOwner(req, res) === false) {

            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
            <!--
            setTimeout("location.href='http://localhost:3000/'",1000);
            //-->
            </script>`)
        }
        db.query('SELECT * FROM boardtype', (error, btype) => {
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'boardtypeCU.ejs',
                logined: 'YES',
                cu: 'C',
                boardtype: btype,
            };
            req.app.render('home', context, (err, html) => {
                res.send(html)
            })
        })

    },
    type_create_process: (req, res) => {

        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var post = req.body;
        sanitizedTitle = sanitizeHtml(post.title)
        sanitizedDescription = sanitizeHtml(post.description)
        sanitizedWriteYN = sanitizeHtml(post.write_YN)
        sanitizedReYN = sanitizeHtml(post.re_YN)
        sanitizedNumPerPage = sanitizeHtml(post.numPerPage)


        db.query(`INSERT INTO boardtype (title, description, write_YN, re_YN, numPerPage)
                        VALUES(?,?,?,?,?)`,
            [sanitizedTitle, sanitizedDescription, sanitizedWriteYN, sanitizedReYN, Number(sanitizedNumPerPage)], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/board/type/view`)
                res.end();
            })
    },
    type_update: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var id = req.params.type_id;


        db.query('SELECT * FROM boardtype where type_id=?', [id], (error, btype) => {

            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'boardtypeCU.ejs',
                logined: 'YES',
                cu: 'U',
                boardtype: btype,

            };
            req.app.render('home', context, (err, html) => {
                res.send(html)
            })
        })

    },
    type_update_process: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var post = req.body;
        console.log(post)

        sanitizedTitle = sanitizeHtml(post.title)
        sanitizedDescription = sanitizeHtml(post.description)
        sanitizedWriteYN = sanitizeHtml(post.write_YN)
        sanitizedReYN = sanitizeHtml(post.re_YN)
        sanitizedNumPerPage = sanitizeHtml(post.numPerPage)
        sanitizedTypeId = sanitizeHtml(post.type_id)


        db.query(`UPDATE boardtype SET title=?, description=?, write_YN=?, re_YN=?, numPerPage=? where type_id=?`,
            [sanitizedTitle, sanitizedDescription, sanitizedWriteYN, sanitizedReYN, Number(sanitizedNumPerPage), Number(sanitizedTypeId)], (error, result) => {
                if (error) {


                    throw error;
                }
                res.redirect(`/board/type/view`)
                res.end();
            })
    },
    type_delete_process: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var id = req.params.type_id
        sanitizeTypeId = sanitizeHtml(id)

        db.query(`delete from boardtype where type_id=?;`,
            [sanitizeTypeId], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/board/type/view`)
                res.end();
            })
    },
    view: (req, res) => {

        var tableData = ``
        var sntzedTypeId = sanitizeHtml(req.params.type_id);

        var pNum = req.params.pNum;
        var sql1 = `select * from boardtype;`
        var sql2 = `select * from boardtype where type_id = ${sntzedTypeId};`
        var sql3 = `select count(*) as total from board where type_id = ${sntzedTypeId};`
        db.query(sql1 + sql2 + sql3, (error, results) => {
            /******페이지 기능 구현 *********/
            var numPerPage = results[1][0].numPerPage;
            var offs = (pNum - 1) * numPerPage;
            var totalPages = Math.ceil(results[2][0].total / numPerPage);


            db.query(`select b.board_id as board_id, b.title as title, b.date as date, p.name as name
                    from board b inner join person p on b.loginid = p.loginid
                    where b.type_id = ? ORDER BY date asc, board_id desc LIMIT ? OFFSET ?`,
                [sntzedTypeId, numPerPage, offs], (err, boards) => {

                    tableData += `
                    <h1>${results[1][0].title}</h1>
                    <thead>
                    <td>작성자</td><td>제목</td><td>날짜</td>
                    </thead>`
                    var i = 0;
                    while (i < boards.length) {
                        tableData += `
                        <tr>
                        <td>${boards[i].name}</td> 
                        <td><a href="/board/detail/${boards[i].board_id}/${sntzedTypeId}">${boards[i].title}</a</td>
                        <td>${boards[i].date}</td>
                        </tr>`
                        i++;
                    }
                    if (req.session.class == '01') {
                        var context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'board.ejs',
                            logined: 'YES',
                            tableData: tableData,
                            boardtype: results[0],
                            totalPages: totalPages,
                            btname: results,
                            pNum: pNum,
                            btnYN: true
                        };
                    }
                    else if (req.session.class == '02') {
                        var btn = true;
                        if (results[1][0].write_YN == 'N') {
                            btn = false;
                        }
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'board.ejs',
                            logined: 'YES',
                            tableData: tableData,
                            boardtype: results[0],
                            totalPages: totalPages,
                            btname: results,
                            pNum: pNum,
                            btnYN: btn
                        };
                    }
                    else if(req.session.class=="00"){
                        var context = {
                            menu: 'menuForMIS.ejs',
                            who: req.session.name,
                            body: 'board.ejs',
                            logined: 'YES',
                            tableData: tableData,
                            boardtype: results[0],
                            totalPages: totalPages,
                            btname: results,
                            pNum: pNum,
                            btnYN: false
                        };
                    }
                    else {
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: "손님",
                            body: 'board.ejs',
                            logined: 'NO',
                            tableData: tableData,
                            boardtype: results[0],
                            totalPages: totalPages,
                            btname: results,
                            pNum: pNum,
                            btnYN: false
                        };
                    }
                    req.app.render('home', context, (err, html) => {
                        res.send(html)
                    })
                })
        })
    },
    create: (req, res) => {
        var id = req.params.type_id;
        console.log(id)
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM boardtype where type_id=${id}`
        db.query(sql1 + sql2, (error, btype) => {
            if (req.session.class == '01') {
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'boardCRU.ejs',
                    logined: 'YES',
                    boardtype: btype[0],
                    loginid: req.session.loginid,
                    btname: btype[1],
                    title: '생성',
                    disabledOption: '',
                    writer: req.session.name,
                    list: [{}],
                    btn: {
                        name: '생성',
                        location: `/board/create_process`,
                        method: 'POST'
                    },
                    sessionClass: req.session.class,
                    sessionId:req.session.loginid,
                };
            }
            else if (req.session.class == '02') {
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'boardCRU.ejs',
                    logined: 'YES',
                    boardtype: btype[0],
                    loginid: req.session.loginid,
                    btname: btype[1],
                    title: '생성',
                    disabledOption: '',
                    writer: req.session.name,
                    list: [{}],
                    btn: {
                        name: '생성',
                        location: `/board/create_process`,
                        method: 'POST'
                    },
                    sessionClass: req.session.class,
                    sessionId:req.session.loginid,
                };

            }

            req.app.render('home', context, (err, html) => {
                if (err) {
                    console.log(err)
                }
                res.send(html)
            })
        })

    },
    create_process: (req, res) => {
        var post = req.body;
        sanitizedTitle = sanitizeHtml(post.title)
        sanitizedContent = sanitizeHtml(post.content)
        sanitizedWriter = sanitizeHtml(post.writer)
        sanitizedTypeId = sanitizeHtml(post.type_id)
        sanitizedLoginId = sanitizeHtml(post.loginid)
        sanitizedDate = sanitizeHtml(dateOfEightDigit())


        db.query(`INSERT INTO board (type_id, loginid, title, date, content)
                        VALUES(?,?,?,?,?)`,
            [Number(sanitizedTypeId), sanitizedLoginId, sanitizedTitle, sanitizedDate, sanitizedContent], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/board/view/${sanitizedTypeId}/1`)
                res.end();
            })
    },
    detail: (req, res) => {

        var boardId = req.params.board_id;
        var typeId = req.params.type_id;

        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM boardtype where type_id=${typeId};`
        var sql3 = `SELECT * FROM board where board_id=${boardId};`
        db.query(sql1 + sql2 + sql3, (error, results) => {
            db.query(`SELECT * FROM person where loginid='${results[2][0].loginid}'`, (error, per) => {
                if (req.session.class == '01') {
                    /*
                    btname: board type의 이름과 아이디를 추출
                    disabledOption: 생성, 디테일, 수정에서 활성화 Input 조절 
                    writer: 작성자
                    list: value 채우는 용
                    */
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtype: results[0],
                        loginid: per[0].loginid,
                        btname: results[1],
                        title: '상세보기',
                        disabledOption: 'disabled',
                        writer: per[0].name,
                        list: results[2],
                        btn: {
                            name: '목록',
                            location: `/board/view/${results[1][0].type_id}/1`,
                            method: 'GET'
                        },
                        sessionClass: req.session.class,
                        sessionId:req.session.loginid,
                    };
                }
                else if (req.session.class == '02') {
                    /*
                    btname: board type의 이름과 아이디를 추출
                    disabledOption: 생성, 디테일, 수정에서 활성화 Input 조절 
                    writer: 작성자
                    list: value 채우는 용
                    */
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtype: results[0],
                        loginid: per[0].loginid,
                        btname: results[1],
                        title: '상세보기',
                        disabledOption: 'disabled',
                        writer: per[0].name,
                        list: results[2],
                        btn: {
                            name: '목록',
                            location: `/board/view/${results[1][0].type_id}/1`,
                            method: 'GET'
                        },
                        sessionClass: req.session.class,
                        sessionId:req.session.loginid,
                    };
                }
                else if(req.session.class=="00"){
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtype: results[0],
                        loginid: per[0].loginid,
                        btname: results[1],
                        title: '상세보기',
                        disabledOption: 'disabled',
                        writer: per[0].name,
                        list: results[2],
                        btn: {
                            name: '목록',
                            location: `/board/view/${results[1][0].type_id}/1`,
                            method: 'GET'
                        },
                        sessionClass: req.session.class,
                        sessionId:req.session.loginid,
                    };
                }
                else{
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: "손님",
                        body: 'boardCRU.ejs',
                        logined: 'NO',
                        boardtype: results[0],
                        loginid: per[0].loginid,
                        btname: results[1],
                        title: '상세보기',
                        disabledOption: 'disabled',
                        writer: per[0].name,
                        list: results[2],
                        btn: {
                            name: '목록',
                            location: `/board/view/${results[1][0].type_id}/1`,
                            method: 'GET'
                        },
                        sessionClass: req.session.class,
                        sessionId:req.session.loginid,
                    };
                }

                req.app.render('home', context, (err, html) => {
                    if(err){
                        console.log(err)
                    }
                    res.send(html)
                })
            })
        })

    },
    update: (req, res) => {
        var boardId = req.params.board_id;
        var typeId = req.params.type_id;

        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM boardtype where type_id=${typeId};`
        var sql3 = `SELECT * FROM board where board_id=${boardId};`
        db.query(sql1 + sql2 + sql3, (error, results) => {
            db.query(`SELECT * FROM person where loginid='${results[2][0].loginid}'`, (error, per) => {
                if (req.session.class == '01') {
                /*
                btname: board type의 이름과 아이디를 추출
                disabledOption: 생성, 디테일, 수정에서 활성화 Input 조절 
                    writer: 작성자
                    list: value 채우는 용
                    */
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        boardtype: results[0],
                        loginid: per[0].loginid,
                        btname: results[1],
                        title: '수정',
                        disabledOption: '',
                        writer: per[0].name,
                        list: results[2],
                        btn: {
                            name: '수정',
                            location: `/board/update_process`,
                            method: 'POST'
                        },
                        sessionClass: req.session.class,
                        sessionId:req.session.loginid,
                    };
                }else if (req.session.class == '02') {
                    /*
                    btname: board type의 이름과 아이디를 추출
                    disabledOption: 생성, 디테일, 수정에서 활성화 Input 조절 
                        writer: 작성자
                        list: value 채우는 용
                        */
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'boardCRU.ejs',
                            logined: 'YES',
                            boardtype: results[0],
                            loginid: per[0].loginid,
                            btname: results[1],
                            title: '수정',
                            disabledOption: '',
                            writer: per[0].name,
                            list: results[2],
                            btn: {
                                name: '수정',
                                location: `/board/update_process`,
                                method: 'POST'
                            },
                            sessionClass: req.session.class,
                            sessionId:req.session.loginid,
                        };
                    }

                    req.app.render('home', context, (err, html) => {
                        res.send(html)
                    })
                })
            })
    },
    update_process: (req, res) => {

        var post = req.body;
        sanitizedTitle = sanitizeHtml(post.title)
        sanitizedContent = sanitizeHtml(post.content)
        sanitizedWriter = sanitizeHtml(post.writer)
        sanitizedTypeId = sanitizeHtml(post.type_id)
        sanitizedLoginId = sanitizeHtml(post.loginid)
        sanitizedBoardId = sanitizeHtml(post.board_id)
        sanitizedDate = sanitizeHtml(dateOfEightDigit())

        db.query(`UPDATE board SET title=?, date=?, content=? where board_id=?`,
            [sanitizedTitle, sanitizedDate, sanitizedContent, sanitizedBoardId], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/board/view/${sanitizedTypeId}/1`)
                res.end();
            })

    },
    delete_process: (req, res) => {
        var boardId = req.params.board_id
        var typeId = req.params.type_id
        sanitizeBoardId = sanitizeHtml(boardId)
        sanitizeTypeId = sanitizeHtml(typeId)

        db.query(`delete from board where board_id=?;`,
            [sanitizeBoardId], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/board/view/${sanitizeTypeId}/1`)
                res.end();
            })
    }
}
