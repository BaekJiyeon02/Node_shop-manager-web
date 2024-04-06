//202135973 백지연

const db = require('./db');
const sanitizeHtml = require('sanitize-html');
const { dateOfEightDigit } = require('./template')


function authIsOwner(req, res) {
    if (req.session.class == '01') {
        return true;
    } else {
    }
    return false
}

module.exports = {

    detail: (req, res) => {

        var id = req.params.mer_id;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM merchandise where mer_id=${id};`
        db.query(sql1 + sql2, (error, mer) => {
            var tableData = ``

            if (req.session.class == "01") {


                tableData += `<tr>
                <td rowspan="5">
                <img src="${mer[1][0].image}" style="width:200px;height:300px;">
                </a>
                </td>
                <form action="/purchase/pay_process" method="post">
                <td>${mer[1][0].name}</td>
                <input type="hidden" name="name" value=${mer[1][0].name} >
                <input type="hidden" name="mer_id" value=${mer[1][0].mer_id} >
                </tr>
                <tr>
                <td>가격: ${mer[1][0].price}</td>
                <input type="hidden" name="price" value=${mer[1][0].price} >
                </tr>
                <tr>
                <td name="brand">브랜드: ${mer[1][0].brand}</td>
                <input type="hidden" name="brand" value=${mer[1][0].brand} >
                </tr>
                <tr>
                <td>수량:<input type="number" name="qty" value="1"/></td>
                
                </tr>
                <tr>
                <td ><button type="submit" class="btn btn-outline-primary btn-sm">결제</button>     <a href="/purchase/cart_process/${mer[1][0].mer_id}" type="button" class="btn btn-outline-primary btn-sm">장바구니</a></td>
                </tr>
                </form>
                `
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else if (req.session.class == "02") {


                tableData += `<tr>
                <td rowspan="5">
                <img src="${mer[1][0].image}" style="width:200px;height:300px;">
                </a>
                </td>
                <form action="/purchase/pay_process" method="post">
                <td>${mer[1][0].name}</td>
                <input type="hidden" name="name" value=${mer[1][0].name} >
                <input type="hidden" name="mer_id" value=${mer[1][0].mer_id} >
                </tr>
                <tr>
                <td>가격: ${mer[1][0].price}</td>
                <input type="hidden" name="price" value=${mer[1][0].price} >
                </tr>
                <tr>
                <td name="brand">브랜드: ${mer[1][0].brand}</td>
                <input type="hidden" name="brand" value=${mer[1][0].brand} >
                </tr>
                <tr>
                <td>수량:<input type="number" name="qty" value="1"/></td>
                
                </tr>
                <tr>
                <td ><button type="submit" class="btn btn-outline-primary btn-sm">결제</button>     <a href="/purchase/cart_process/${mer[1][0].mer_id}" type="button" class="btn btn-outline-primary btn-sm">장바구니</a></td>
                </tr>
                </form>
                `
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
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
    pay_process: (req, res) => {
        var post = req.body;

        db.query(`SELECT price from merchandise where mer_id=${post.mer_id}`, (err, mer) => {
            var point = (0.5 * 0.1) * mer[0].price

            sanitizedMerId = sanitizeHtml(post.mer_id)
            sanitizedLoginId = sanitizeHtml(req.session.loginid)
            sanitizedDate = sanitizeHtml(dateOfEightDigit())
            sanitizedPoint = sanitizeHtml(point)
            sanitizedPrice = sanitizeHtml(mer[0].price)
            sanitizedQty = sanitizeHtml(post.qty)
            sanitizedPayYN = sanitizeHtml('Y')
            sanitizedTotal = sanitizeHtml(Number(mer[0].price) * post.qty)



            db.query(`INSERT INTO purchase (loginid, mer_id, date, price, total, point, qty, payYN)
            VALUES(?,?,?,?,?,?,?,?)`,
                [sanitizedLoginId, sanitizedMerId, sanitizedDate, sanitizedPrice, sanitizedTotal, Number(sanitizedPoint), Number(sanitizedQty), sanitizedPayYN], (error, result) => {
                    if (error) {
                        console.log(error)
                        throw error;
                    }
                    if (req.session.class == '01') {
                        res.redirect(`/purchase/manager/purchase`)
                        res.end();
                    }
                    else {
                        res.redirect(`/purchase`)
                        res.end();
                    }

                })
        })
    },
    cancel_process: (req, res) => {
        var id = req.params.purchase_id;
        sanitizedId = sanitizeHtml(id)

        db.query(`UPDATE purchase SET cancel='Y' where purchase_id=?`,
            [sanitizedId], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/purchase`)
                res.end();
            })
    },
    cart_process: (req, res) => {

        var mer_id = req.params.mer_id;
        var id = req.session.loginid;

        sanitizedMerId = sanitizeHtml(mer_id)
        sanitizedLoginId = sanitizeHtml(req.session.loginid)
        sanitizedDate = sanitizeHtml(dateOfEightDigit())


        db.query(`INSERT INTO cart (loginid, mer_id, date)
            VALUES(?,?,?)`,
            [sanitizedLoginId, sanitizedMerId, sanitizedDate], (error, result) => {
                if (error) {
                    console.log(error)
                    throw error;
                }
                if (req.session.class == '01') {
                    res.redirect(`/purchase/manager/cart`)
                    res.end();
                }
                else {
                    res.redirect(`/purchase/cart`)
                    res.end();
                }
            })
    },
    purchase_view: (req, res) => {//구매내역
        var loginid = req.session.loginid

        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT m.image, m.name,p.purchase_id, p.price, p.qty, p.total, p.date, p.qty, p.cancel from purchase p left join merchandise m on m.mer_id=p.mer_id where p.loginid="${loginid}" and p.payYN='Y';`

        db.query(sql1 + sql2, (error, pur) => {
            if(req.session.class=="01" || req.session.class=="02" || req.session.class=="00"){

            var i = 0;
            var tableData = ``;
            var cancelN = '';
            var cancelY = '';
            if (0 >= pur[1].length) {
                tableData += `<tr>
                    <td>구매내역 없음</td> 
                    </tr>`
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: pur[0]
                };

            }
            else {
                tableData += `<thead><td>상품</td><td>상품명</td><td>단가</td><td>구매량</td><td>총금액</td><td>구매일</td><td>취소여부</td>`
                while (i < pur[1].length) {
                    if (pur[1][i].cancel == 'N') {
                        cancelY = `style="display:none;"`
                        cancelN = ``;
                    }
                    else if (pur[1][i].cancel == 'Y') {
                        cancelN = `style="display:none;"`
                        cancelY = ``
                    }
                    tableData += `<tr>
                                <td><a href="/shop/detail/${pur[1][i].mer_id}"><img src="${pur[1][i].image}" style="width:100px;height:150px;"></a></td>
                                <td>${pur[1][i].name}</td>
                                <td>${pur[1][i].price}</td>
                                <td>${pur[1][i].qty}</td>
                                <td>${pur[1][i].total}</td>
                                <td>${pur[1][i].date}</td>
                                <td ${cancelN}><a href="purchase/cancel_process/${pur[1][i].purchase_id}">구매취소</a></td>
                                <td ${cancelY}>취소된상품</td>
                                </tr>`
                    i++;
                }
                if (req.session.class == "01") {
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: 'YES',
                        tableData: tableData,
                        boardtype: pur[0]
                    };
                }
                else if (req.session.class == "00") {
                    var context = {
                        menu: 'menuForMIS.ejs',
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: 'YES',
                        tableData: tableData,
                        boardtype: pur[0]
                    };
                }
                else if (req.session.class == "02") {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: 'YES',
                        tableData: tableData,
                        boardtype: pur[0]
                    };
                }
            }
        }
            else{

                tableData += `<tr>
                        <td>로그인 후 이용해주세요</td> 
                        </tr>`
    
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'NO',
                    tableData: tableData,
                    boardtype: pur[0],
                };
                
            }
            console.log("session:", req.session)
            console.log("context:", context)
            console.log("pur:", pur)
            req.app.render('home', context, (err, html) => {
                if (err) { console.log(err) }
                res.send(html)
            })
        })
    },
    cart_view: (req, res) => { //장바구니 내역
        
        var loginid = req.session.loginid
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT m.image, m.name, c.mer_id, c.cart_id, m.price, c.date from cart c left join merchandise m on m.mer_id=c.mer_id where c.loginid="${loginid}";`
        db.query(sql1 + sql2, (error, cart) => {
            var i = 0;
            var tableData = ``;
            if(req.session.class=="01" || req.session.class=="02" || req.session.class=="00"){
            if (error) {
                console.log(error)
            }



            if (0 >= cart[1].length) {
                tableData += `<tr>
                    <td>장바구니 내역 없음</td> 
                    </tr>`
            }
            else {
                tableData += `<thead><td>구매선택</td><td>상품</td><td>상품명</td><td>단가</td><td>담은날</td><td>수량</td>`
                while (i < cart[1].length) {


                    tableData += `
                                <tr>
                                <td><input type="checkbox" name="checkbox" value="${cart[1][i].cart_id}" ></td>
                                <td><a href="/shop/detail/${cart[1][i].mer_id}" ><img src="${cart[1][i].image}" style="width:100px;height:150px;"></a></td>
                                <input  value="${cart[1][i].mer_id}" name="mer_id" type="hidden">
                                <td>${cart[1][i].name}</td>
                                <input  value="${loginid}" name="loginid" type="hidden">
                                <td>${cart[1][i].price}</td>
                                <input  value="${cart[1][i].price}" name="price" type="hidden">
                                <td>${cart[1][i].date}</td>
                                <input value="${cart[1][i].cart_id}" name="cart_id" type="hidden">
                                <td><input type="number" name="qty" value="1"></td>
                                <td><a href="/purchase/cart/delete/${cart[1][i].cart_id}">삭제</a></td>
                                </tr>
                                `
                    i++;
                }
            }
            if (req.session.class == "01") {
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchaseCart.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: cart[0],

                };
            }
            else if (req.session.class == "00") {
                var context = {
                    menu: 'menuForMIS.ejs',
                    who: req.session.name,
                    body: 'purchaseCart.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: cart[0],

                };
            }
            else if (req.session.class == "02") {
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'purchaseCart.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: cart[0],
                };
            }
        }
        else{

            tableData += `<tr>
                    <td>로그인 후 이용해주세요</td> 
                    </tr>`

            var context = {
                menu: 'menuForCustomer.ejs',
                who: req.session.name,
                body: 'purchase.ejs',
                logined: 'NO',
                tableData: tableData,
                boardtype: cart[0],
            };
            
        }
        req.app.render('home', context, (err, html) => {
    
            if (err) { console.log(err) }
            res.send(html)
        })
    })
    },
    cart_to_purchase: (req, res) => {
        var post = req.body;
        var qtyValue = []
        console.log(post)

        if (!Array.isArray(post.checkbox)) {
            post.checkbox = [post.checkbox];
            console.log("checkbox 배열 수정:", post)
        }
        if (!Array.isArray(post.mer_id)) {
            post.mer_id = [post.mer_id];
            console.log("mer_id 배열 수정:", post)
        }
        if (!Array.isArray(post.qty)) {
            post.qty = [post.qty];
            console.log("qty 배열 수정:", post)
        }
        var x = 0
        while (x < post.checkbox.length) {
            var j = 0;
            while (j <= post.cart_id.length) {
                if (post.cart_id[j] == post.checkbox[x]) {
                    qtyValue.push(j)
                }
                j++
            }
            x++
        }
        var i = 0;
        var q = 0;
        while (i < post.checkbox.length) {
            db.query(`SELECT * from cart where cart_id="${post.checkbox[i]}"`, (err, cart) => {
                db.query(`SELECT * from merchandise where mer_id=${cart[0].mer_id}`, (err, mer) => {

                    if (err) { console.log(err) }
                    var point = (0.5 * 0.1) * mer[0].price
                    var total = Number(mer[0].price) * Number(post.qty[qtyValue[q]])


                    sanitizedMerId = sanitizeHtml(mer[0].mer_id)
                    sanitizedCartId = sanitizeHtml(cart[0].cart_id)
                    sanitizedLoginId = sanitizeHtml(req.session.loginid)
                    sanitizedDate = sanitizeHtml(cart[0].date)
                    sanitizedPoint = sanitizeHtml(point)
                    sanitizedPrice = sanitizeHtml(mer[0].price)
                    sanitizedPayYN = sanitizeHtml('Y')
                    sanitizedTotal = sanitizeHtml(total)
                    sanitizedQty = sanitizeHtml(post.qty[qtyValue[q]])
                    q++;


                    db.query(`INSERT INTO purchase (loginid, mer_id, date, price, total, point, qty, payYN) VALUES(?,?,?,?,?,?,?,?);
                        DELETE FROM cart where cart_id=?;`,
                        [sanitizedLoginId, sanitizedMerId, sanitizedDate, Number(sanitizedPrice), Number(sanitizedTotal), Number(sanitizedPoint), Number(sanitizedQty), sanitizedPayYN, sanitizedCartId], (error, result) => {
                            if (error) {
                                console.log(error)
                                throw error;
                            }
                        })
                })

            })
            i++;
        }
        res.redirect(`/purchase`)
        res.end();

    },
    cart_delete: (req, res) => {
        var id = req.params.cart_id;

        sanitizedCartId = sanitizeHtml(id)


        db.query(`DELETE FROM cart where cart_id=?;`,
            [sanitizedCartId], (error, result) => {
                if (error) {
                    console.log(error)
                    throw error;
                }
                res.redirect(`/purchase/cart`)
                res.end();

            })


    },
    manager_cart: (req, res) => {
        var i = 0;
        var tableData = ``;
        var num = 1;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT DISTINCT loginid from cart;`
        var sql3 = `SELECT m.image, m.name, c.loginid, c.mer_id, c.cart_id, m.price, c.date from cart c left join merchandise m on m.mer_id=c.mer_id;`
        var sql4 = `SELECT loginid from cart;`
        db.query(sql1 + sql2 + sql3 + sql4, (err, cart) => {
            if (0 >= cart[2].length) {
                tableData += `<tr>
                    <td>장바구니 내역 없음</td> 
                    </tr>`
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: cart[0],
                };
            }
            else {
                if (cart[1] == undefined) {
                    num = 3;
                }
                if (err) { console.log(err) }
                while (i < cart[num].length) {

                    tableData += `<tr><td>
                    <details>
                    <summary>${cart[num][i].loginid}</summary>
                    <table class="table table-bordered ">`
                    var j = 0
                    while (j < cart[2].length) {

                        if (cart[2][j].loginid == cart[num][i].loginid) {
                            tableData += `<tr>
                            <td><img src="${cart[2][j].image}"style="width:100px;height:150px;"></a></td>
                            <td> 이름:${cart[2][j].name}</td>
                            <td> 가격:${cart[2][j].price}</td>
                            <td> 날짜:${cart[2][j].date}</td>
                            </tr>`
                        }
                        j++
                    }
                    tableData += ` </tr></table></details></td>
                    </tr>`
                    i++;
                }
                tableData += `<tr><td>아이디를 클릭해주세요</td></tr>`
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: cart[0],

                };
            }
            req.app.render('home', context, (err, html) => {

                if (err) { console.log(err) }
                res.send(html)
            })
        })
    },
    manager_purchase: (req, res) => {
        var i = 0;
        var tableData = ``;
        var num = 1;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT DISTINCT loginid from purchase;`
        var sql3 = `SELECT m.name, p.price, p.date, m.image, p.loginid, p.qty, p.refund from purchase p LEFT JOIN merchandise m on m.mer_id=p.mer_id;`
        var sql4 = `SELECT loginid from purchase;`
        db.query(sql1 + sql2 + sql3 + sql4, (err, pur) => {
            if (0 >= pur[2].length) {
                tableData += `<tr>
                    <td>구매내역 없음</td> 
                    </tr>`
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: pur[0],
                };
            }
            else {
                if (pur[1] == undefined) {
                    num = 3;
                }
                while (i < pur[num].length) {
                    console.log('i', i)
                    tableData += `<tr><td>
                    <details>
                    <summary>${pur[num][i].loginid}</summary>
                    <table class="table table-bordered ">`
                    var j = 0
                    while (j < pur[2].length) {
                        if (pur[2][j].loginid == pur[num][i].loginid) {
                            tableData += `<tr>
                            <td><img src="${pur[2][j].image}"style="width:100px;height:150px;"></a></td>
                            <td> 이름:${pur[2][j].name}</td>
                            <td> 가격:${pur[2][j].price}</td>
                            <td> 날짜:${pur[2][j].date}</td>
                            <td> 수량:${pur[2][j].qty}</td>
                            <td> 구매취소 여부:${pur[2][j].refund}</td>
                            </tr>`
                        }
                        j++
                    }
                    tableData += ` </tr></table></details></td>
                    </tr>`
                    i++;
                }
                tableData += `<tr><td>아이디를 클릭해주세요</td></tr>`
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: pur[0],
                };
            }
            req.app.render('home', context, (err, html) => {

                if (err) { console.log(err) }
                res.send(html)
            })
        })
    },

    cart_add: (req, res) => {
        var idList = ``;
        var merList = ``;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM merchandise;`
        var sql3 = `SELECT * FROM person;`
        db.query(sql1 + sql2 + sql3, (err, pur) => {

            idList+=`<select name="idList" id="idList">`
            var i = 0;
            while (i < pur[2].length) {
                idList += `<option value="${pur[2][i].loginid}">${pur[2][i].loginid}-${pur[2][i].name}</option>`
                i++;
            }
            idList+=`</select>`

            var j = 0;
            while (j < pur[1].length) {
                merList += `<option value="${pur[1][j].mer_id}">${pur[1][j].name}-${pur[1][j].brand}</option>`
                j++;
            }
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'purchaseCU.ejs',
                logined: 'YES',
                title: '장바구니 입력',
                formType: 'cart',
                idList: idList,
                merList: merList,
                boardtype: pur[0],
                count: ``,
                list: [{}]
            };

            req.app.render('home', context, (err, html) => {
                if (err) {
                    console.log(err)
                }
                res.send(html)
            })
        })
    },
    mcart_process: (req, res) => {
        var post = req.body;
        console.log("post", post)

        sanitizedLoginId = sanitizeHtml(post.idList)
        sanitizedMerId = sanitizeHtml(post.merList)
        sanitizedDate = sanitizeHtml(dateOfEightDigit())

        db.query(`INSERT INTO cart (loginid, mer_id, date)
            VALUES(?,?,?)`,
            [sanitizedLoginId, Number(sanitizedMerId), sanitizedDate], (error, result) => {
                if (error) {
                    console.log(error)
                    throw error;
                }
                res.redirect(`/purchase/manager/cart`)
                res.end();
            })
    }, cart_update_view: (req, res) => {
        
        var i = 0;
        var tableData = ``;
        var num = 1;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT DISTINCT loginid from cart;`
        var sql3 = `SELECT m.image, m.name, c.loginid, c.mer_id, c.cart_id, m.price, c.date from cart c left join merchandise m on m.mer_id=c.mer_id;`
        var sql4 = `SELECT loginid from cart;`
        db.query(sql1 + sql2 + sql3 + sql4, (err, cart) => {
            if (0 >= cart[2].length) {
                tableData += `<tr>
                    <td>장바구니 내역 없음</td> 
                    </tr>`
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: cart[0],
                };
            }
            else {
                if (cart[1] == undefined) {
                    num = 3;
                }
                if (err) { console.log(err) }
                while (i < cart[num].length) {

                    tableData += `<tr><td>
                    <details>
                    <summary>${cart[num][i].loginid}</summary>
                    <table class="table table-bordered ">`
                    var j = 0
                    while (j < cart[2].length) {

                        if (cart[2][j].loginid == cart[num][i].loginid) {
                            tableData += `<tr>
                            <td><img src="${cart[2][j].image}"style="width:100px;height:150px;"></a></td>
                            <td> 이름:${cart[2][j].name}</td>
                            <td> 가격:${cart[2][j].price}</td>
                            <td> 날짜:${cart[2][j].date}</td>
                            <td><a href="/purchase/manager/cart/update/${cart[2][j].cart_id}">수정</a></td>
                            <td><a href="/cart/delete/${cart[2][j].cart_id}">삭제</a></td>

                            </tr>`
                        }
                        j++
                    }
                    tableData += ` </tr></table></details></td>
                    </tr>`
                    i++;
                }
                tableData += `<tr><td>아이디를 클릭해주세요</td></tr>`
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: cart[0],

                };
            }
            req.app.render('home', context, (err, html) => {

                if (err) { console.log(err) }
                res.send(html)
            })
        })
    },
    cart_update: (req, res) => {
        var id = Number(req.params.cart_id);
        var idList = ``;
        var merList = ``;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM merchandise;`
        var sql3 = `SELECT * FROM person ;`
        var sql4 =`SELECT * FROM cart WHERE cart_id=${id}`
        db.query(sql1 + sql2 + sql3 + sql4, (err, cart) => {
           
            idList += `<input value="${cart[3][0].loginid}" disabled >
                    <input name="idList" id="idList" value="${id}" type="hidden" >
                    <input name="loginid" id="loginid" value="${cart[3][0].loginid}" type="hidden" >`
            
            var j = 0;
            while (j < cart[1].length) {
                merList += `<option value="${cart[1][j].mer_id}">${cart[1][j].name}-${cart[1][j].brand}</option>`
                j++;
            }
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'purchaseCU.ejs',
                logined: 'YES',
                title: '장바구니 수정',
                formType: 'cart/update',
                idList: idList,
                merList: merList,
                boardtype: cart[0],
                count: ``,
                list: cart[3]
            };

            req.app.render('home', context, (err, html) => {
                if (err) {
                    console.log(err)
                }
                res.send(html)
            })
        })
    },
    cart_update_process:(req,res)=>{
        var post = req.body;
        console.log("post", post)

        sanitizedCartId = sanitizeHtml(post.idList)
        sanitizedMerId = sanitizeHtml(post.merList)
        sanitizedLoginId = sanitizeHtml(post.loginid)


        db.query(`UPDATE cart SET loginid=? ,mer_id=? where cart_id=? `,
            [sanitizedLoginId, Number(sanitizedMerId), Number(sanitizedCartId)], (error, result) => {
                if (error) {
                    console.log(error)
                    throw error;
                }
                res.redirect(`/purchase/manager/cart/update/view`)
                res.end();
            })
    },purchase_update_view:(req,res)=>{

        var i = 0;
        var tableData = ``;
        var num = 1;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT DISTINCT loginid from purchase;`
        var sql3 = `SELECT m.name, p.price, p.date,p.purchase_id, m.image, p.loginid, p.qty, p.refund from purchase p LEFT JOIN merchandise m on m.mer_id=p.mer_id;`
        var sql4 = `SELECT loginid from purchase;`
        db.query(sql1 + sql2 + sql3 + sql4, (err, pur) => {
            if (0 >= pur[2].length) {
                tableData += `<tr>
                    <td>구매내역 없음</td> 
                    </tr>`
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: pur[0],
                };
            }
            else {
                if (pur[1] == undefined) {
                    num = 3;
                }
                while (i < pur[num].length) {
                    console.log('i', i)
                    tableData += `<tr><td>
                    <details>
                    <summary>${pur[num][i].loginid}</summary>
                    <table class="table table-bordered ">`
                    var j = 0
                    while (j < pur[2].length) {
                        if (pur[2][j].loginid == pur[num][i].loginid) {
                            tableData += `<tr>
                            <td><img src="${pur[2][j].image}"style="width:100px;height:150px;"></a></td>
                            <td> 이름:${pur[2][j].name}</td>
                            <td> 가격:${pur[2][j].price}</td>
                            <td> 날짜:${pur[2][j].date}</td>
                            <td> 수량:${pur[2][j].qty}</td>
                            <td><a href="/purchase/manager/purchase/update/${pur[2][j].purchase_id}">수정</a></td>
                            <td> 구매취소 여부:${pur[2][j].refund}</td>
                            </tr>`
                        }
                        j++
                    }
                    tableData += ` </tr></table></details></td>
                    </tr>`
                    i++;
                }
                tableData += `<tr><td>아이디를 클릭해주세요</td></tr>`
            
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: 'YES',
                        tableData: tableData,
                        boardtype: pur[0]
                    };
                }
            

            req.app.render('home', context, (err, html) => {
                if (err) { console.log(err) }
                res.send(html)
            })
        })
    },purchase_update: (req, res) => {
        var id = Number(req.params.purchase_id);
        var idList = ``;
        var merList = ``;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM merchandise;`
        var sql3 = `SELECT * FROM person ;`
        var sql4 =`SELECT * FROM purchase WHERE purchase_id=${id}`
        db.query(sql1 + sql2 + sql3 + sql4, (err, pur) => {
           
            idList += `<input value="${pur[3][0].loginid}" disabled ><br>
                    수량: <input name="qty" value="${pur[3][0].qty}" >
                    <input name="idList" id="idList" value="${id}" type="hidden" >
                    <input name="loginid" id="loginid" value="${pur[3][0].loginid}" type="hidden" >`
            
            var j = 0;
            while (j < pur[1].length) {
                merList += `<option value="${pur[1][j].mer_id}">${pur[1][j].name}-${pur[1][j].brand}</option>`
                j++;
            }
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'purchaseCU.ejs',
                logined: 'YES',
                title: '구매내역 수정',
                formType: 'purchase/update',
                idList: idList,
                merList: merList,
                boardtype: pur[0],
                count: ``,
                list: pur[3]
            };

            req.app.render('home', context, (err, html) => {
                if (err) {
                    console.log(err)
                }
                res.send(html)
            })
        })
    },
    purchase_update_process:(req,res)=>{
        var post = req.body;
        console.log("post", post)

        sanitizedPurchaseId = sanitizeHtml(post.idList)
        sanitizedMerId = sanitizeHtml(post.merList)
        sanitizedLoginId = sanitizeHtml(post.loginid)
        sanitizedQty = sanitizeHtml(post.qty)


        db.query(`UPDATE purchase SET loginid=? ,mer_id=?, qty=? where purchase_id=? `,
            [sanitizedLoginId, Number(sanitizedMerId),Number(sanitizedQty), Number(sanitizedPurchaseId)], (error, result) => {
                if (error) {
                    console.log(error)
                    throw error;
                }
                res.redirect(`/purchase/manager/purchase/update/view`)
                res.end();
            })
    },
    purchase_add: (req, res) => {
        var idList = ``;
        var merList = ``;
        var count = ``;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM merchandise;`
        var sql3 = `SELECT * FROM person;`
        db.query(sql1 + sql2 + sql3, (err, pur) => {


            var i = 0;
            idList+=`<select name="idList" id="idList">`
            while (i < pur[2].length) {
                idList += `<option value="${pur[2][i].loginid}">${pur[2][i].loginid}-${pur[2][i].name}</option>`
                i++;
            }
            idList+=`</select>`
            var j = 0;
            while (j < pur[1].length) {
                merList += `<option value="${pur[1][j].mer_id}">${pur[1][j].name}-${pur[1][j].brand}</option>`
                j++;
            }
            count += `<div class="mb-3">  
                        <label class="form-label" for="merList">수량</label>
                        <input type="number" name="qty" value="1">
                    </div>`
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'purchaseCU.ejs',
                logined: 'YES',
                title: '구매내역 입력',
                formType: 'purchase',
                idList: idList,
                merList: merList,
                boardtype: pur[0],
                count: count,
                list: [{}]
            };

            req.app.render('home', context, (err, html) => {
                if (err) {
                    console.log(err)
                }
                res.send(html)
            })
        })
    },
    mpurchase_process: (req, res) => {
        var post = req.body;

        db.query(`SELECT * FROM merchandise where mer_id=${Number(post.merList)}`, (err, mer) => {
            console.log(post)
            console.log(mer)

            var point = (0.5 * 0.1) * mer[0].price
            var total = Number(mer[0].price) * Number(post.qty)

            sanitizedLoginId = sanitizeHtml(post.idList)
            sanitizedMerId = sanitizeHtml(post.merList)
            sanitizedDate = sanitizeHtml(dateOfEightDigit())
            sanitizedPrice = sanitizeHtml(mer[0].price)
            sanitizedPoint = sanitizeHtml(point)
            sanitizedQty = sanitizeHtml(post.qty)
            sanitizedTotal = sanitizeHtml(total)
            sanitizedPayYN = sanitizeHtml('Y')
            sanitizedCancel = sanitizeHtml('N')
            sanitizedRefund = sanitizeHtml('N')

            db.query(`INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund)
            VALUES(?,?,?,?,?,?,?,?,?,?)`,
                [sanitizedLoginId, Number(sanitizedMerId), sanitizedDate, Number(sanitizedPrice), Number(sanitizedPoint), Number(sanitizedQty), Number(sanitizedTotal), sanitizedPayYN, sanitizedCancel, sanitizedRefund], (error, result) => {
                    if (error) {
                        console.log(error)
                        throw error;
                    }
                    res.redirect(`/purchase/manager/purchase`)
                    res.end();
                })
        })
    }
}

