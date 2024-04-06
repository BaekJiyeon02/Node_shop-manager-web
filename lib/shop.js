//202135973 백지연
const { list } = require('pm2');
var db = require('./db');
var merchandise = require('./merchandise');
function authIsOwner(req, res) {
    if (req.session.class == '01' || req.session.class =='00') {
        return true;
    } else {
    }
    return false
}
module.exports = {
    home: (req, res) => {

        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM merchandise;`
        db.query(sql1 + sql2, (error, mer) => {

            if (req.session.class === '01') {
                var i = 0;
                var tableData = ``
                if (0 >= mer[1].length) {
                    tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
                }
                else {
                    while (i < mer[1].length) {
                        tableData += `<tr>
                    <td><a href="/shop/detail/${mer[1][i].mer_id}"><img src="${mer[1][i].image}" style="width:100px;height:150px; "></a></td>
                    <td>${mer[1][i].name}</td>
                    <td>${mer[1][i].price}</td>
                    <td>${mer[1][i].brand}</td> 
                    </tr>`
                        i++;
                    }
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };

            }
            else if (req.session.class === '02') {
                var i = 0;
                var tableData = ``
                if (0 >= mer[1].length) {
                    tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
                }
                else {

                    while (i < mer[1].length) {
                        tableData += `<tr>
                                        <td><a href="/shop/detail/${mer[1][i].mer_id}"><img src="${mer[1][i].image}" style="width:100px;height:150px; "></a></td>
                                        <td>${mer[1][i].name}</td>
                                        <td>가격:${mer[1][i].price}</td>
                                        <td>브랜드:${mer[1][i].brand}</td> 
                                        </tr>`
                        i++;
                    }
                }

                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }

            else if (req.session.class === "00") {

                var i = 0;
                var tableData = ``
                if (0 >= mer[1].length) {
                    tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
                }
                else {
                    while (i < mer[1].length) {
                        tableData += `<tr>
                                        <td><a href="/shop/detail/${mer[1][i].mer_id}"><img src="${mer[1][i].image}" style="width:100px;height:150px;"></a></td>
                                        <td>${mer[1][i].name}</td>
                                        <td>가격:${mer[1][i].price}</td>
                                        <td>브랜드:${mer[1][i].brand}</td> 
                                        </tr>`
                        i++;
                    }
                }

                var context = {
                    menu: 'menuForMIS.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }


            else {

                var i = 0;
                var tableData = ``
                if (0 >= mer[1].length) {
                    tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
                }
                else {
                    while (i < mer[1].length) {
                        tableData += `<tr>
                                        <td><a href="/shop/detail/${mer[1][i].mer_id}"><img src="${mer[1][i].image}" style="width:100px;height:150px; "></a></td>
                                        <td>${mer[1][i].name}</td>
                                        <td>${mer[1][i].price}</td>
                                        <td>${mer[1][i].brand}</td> 
                                        </tr>`
                        i++;
                    }
                }

                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: "손님",
                    body: 'merchandise.ejs',
                    logined: 'NO',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            req.app.render('home', context, (err, html) => {
                res.end(html);
            })
        })
    },
    view: (req, res) => {
        var id = req.params.sub_id;
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM merchandise where category=${id};`
        db.query(sql1 + sql2, (error, mer) => {

            if (error) { console.log(error) }
            var i = 0;
            var tableData = ``
            if (0 >= mer[1].length) {
                tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
            }
            while (i < mer[1].length) {
                tableData += `<tr>
                            <td><a href="/shop/detail/${mer[1][i].mer_id}"><img src="${mer[1][i].image}" style="width:100px;height:150px; "></a></td>
                            <td>${mer[1][i].name}</td>
                            <td>가격:${mer[1][i].price}</td>
                            <td>브랜드:${mer[1][i].brand}</td> 
                            </tr>`
                i++;
            }


            if (req.session.class == "01") {
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else if (req.session.class == "02") {
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else if (req.session.class == "00") {
                var context = {
                    menu: 'menuForMIS.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else {
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: "손님",
                    body: 'merchandise.ejs',
                    logined: 'NO',
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
    search: (req, res) => {
        var post = req.body;
        console.log(post.search)
        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `select * from merchandise
        where name like '%${post.search}%' or brand like '%${post.search}%' or supplier like '%${post.search}%'`
        db.query(sql1 + sql2, (error, mer) => {

            if (error) { console.log(error) }
            var i = 0;
            var tableData = ``
            if (0 >= mer[1].length) {
                tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
            }
            while (i < mer[1].length) {
                tableData += `<tr>
                            <td><a href="/shop/detail/${mer[1][i].mer_id}"><img src="${mer[1][i].image}" style="width:100px;height:150px; "></a></td>
                            <td>${mer[1][i].name}</td>
                            <td>가격:${mer[1][i].price}</td>
                            <td>브랜드:${mer[1][i].brand}</td> 
                            </tr>`
                i++;
            }
            if (req.session.class == "01") {
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else if (req.session.class == "02") {
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else if (req.session.class == "00") {
                var context = {
                    menu: 'menuForMIS.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else {
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: "손님",
                    body: 'merchandise.ejs',
                    logined: 'NO',
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
    detail: (req, res) => {
        var id = req.params.mer_id;

        var sql1 = `SELECT * FROM boardtype;`
        var sql2 = `SELECT * FROM merchandise where mer_id=${id};`
        db.query(sql1 + sql2, (error, mer) => {
            var tableData = ``

            if (req.session.class == "01") {
                console.log(mer)

                tableData += `<tr>
                                <td rowspan="4">
                                    <img src="${mer[1][0].image}" style="width:200px; height:300px;">
                                    </a>
                                </td>
                                <td>${mer[1][0].name}</td>
                            </tr>
                            <tr>
                                <td>가격: ${mer[1][0].price}</td>
                            </tr>
                            <tr>
                                <td>브랜드: ${mer[1][0].brand}</td>
                            </tr>
                            <tr>
                                <td><a href="/purchase/detail/${id}" type="button" class="btn btn-outline-primary btn-sm">구매</a>     <a href="/purchase/cart_process/${id}" type="button" class="btn btn-outline-primary btn-sm">장바구니</a></td>
                            </tr>
                            `

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else if (req.session.class == "02") {
                console.log(mer)

                tableData += `<tr>
                                <td rowspan="4">
                                    <img src="${mer[1][0].image}" style="width:200px; height:300px;">
                                    </a>
                                </td>
                                <td>${mer[1][0].name}</td>
                            </tr>
                            <tr>
                                <td>가격: ${mer[1][0].price}</td>
                            </tr>
                            <tr>
                                <td>브랜드: ${mer[1][0].brand}</td>
                            </tr>
                            <tr>
                                <td><a href="/purchase/detail/${id}" type="button" class="btn btn-outline-primary btn-sm">구매</a>     <a href="/purchase/cart_process/${id}" type="button" class="btn btn-outline-primary btn-sm">장바구니</a></td>
                            </tr>
                            `

                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else if (req.session.class == "00") {
                tableData += `<tr>
                <td rowspan="4">
                    <img src="${mer[1][0].image}" style="width:200px; height:300px;">
                    </a>
                </td>
                <td>${mer[1][0].name}</td>
            </tr>
            <tr>
                <td>가격: ${mer[1][0].price}</td>
            </tr>
            <tr>
                <td>브랜드: ${mer[1][0].brand}</td>
            </tr>
            
            `
                var context = {
                    menu: 'menuForMIS.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    tableData: tableData,
                    boardtype: mer[0]
                };
            }
            else {

                tableData += `<tr>
                                <td rowspan="4">
                                    <img src="${mer[1][0].image}" style="width:200px; height:300px;">
                                    </a>
                                </td>
                                <td>${mer[1][0].name}</td>
                            </tr>
                            <tr>
                                <td>가격: ${mer[1][0].price}</td>
                            </tr>
                            <tr>
                                <td>브랜드: ${mer[1][0].brand}</td>
                            </tr>
                            
                            `

                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: "손님",
                    body: 'merchandise.ejs',
                    logined: 'NO',
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
    customeranal: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {
            if (req.session.class === '00') {
                var sql1 = `select * from boardtype;`
                var sql2 = `select address as name ,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate
        from person group by address;`
                db.query(sql1 + sql2, (error, results) => {
                    var context = {
                        /*********** home.ejs에 필요한 변수 ***********/
                        menu: 'menuForMIS.ejs'
                        ,
                        body: 'customerAnal.ejs'
                        ,
                        /*********** menuForMIS.ejs에 필요한 변수 ***********/
                        who: req.session.name,
                        logined: 'YES',
                        boardtype: results[0],
                        /*********** customerAnal.ejs에 필요한 변수 ***********/
                        percentage: results[1],
                        title: '지역별 고객 분포'
                    };
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                    })
                });
            }
        }
        else{
            var sql1 = `select * from boardtype;` ;
            db.query(sql1 + sql2,(error,results)=>{
            var context = {
            /*********** home.ejs에 필요한 변수 ***********/
            menu : 'menuForCustomer.ejs'
            ,
            body : 'merchandise.ejs'
            ,
            /*********** menuForCustomer.ejs에 필요한 변수 ***********/
            who : '손님'
            ,
            logined : 'NO',
            boardtypes : results[0],
            /*********** mechandise.ejs에 필요한 변수 ***********/
            merchandise : results[1],
            vu : 'v'
            };
            req.app.render('home',context, (err, html)=>{
            res.end(html); })
            });
            }
    },
    customercart: (req, res) => {
        var isOwner = authIsOwner(req, res);
        if (isOwner) {
            if (req.session.class === '00') {
                var sql1 = `select * from boardtype;`
                var sql2 = `select m.name as name ,ROUND(( count(*) / ( select count(*) from cart )) * 100, 2) as rate
                from merchandise m inner join cart c ON m.mer_id = c.mer_id group by m.name;`
                db.query(sql1 + sql2, (error, results) => {
                    console.log(results[1])
                    var context = {
                        /*********** home.ejs에 필요한 변수 ***********/
                        menu:'menuForMIS.ejs'
                        ,
                        body:'customerAnal.ejs'
                        ,
                        /*********** menuForMIS.ejs에 필요한 변수 ***********/
                        who: req.session.name,
                        logined: 'YES',
                        boardtype: results[0],
                        /*********** customerAnal.ejs에 필요한 변수 ***********/
                        percentage: results[1],
                        title: '상품별 장바구니 담긴 분포'
                    };
                    req.app.render('home', context, (err, html) => {
                        if(err){console.log(err)}
                        res.end(html);
                    })
                });
            }
        }
        else{
            var sql1 = `select * from boardtype;` ;
            db.query(sql1 + sql2,(error,results)=>{
            var context = {
            /*********** home.ejs에 필요한 변수 ***********/
            menu : 'menuForCustomer.ejs'
            ,
            body : 'merchandise.ejs'
            ,
            /*********** menuForCustomer.ejs에 필요한 변수 ***********/
            who : '손님'
            ,
            logined : 'NO',
            boardtypes : results[0],
            /*********** mechandise.ejs에 필요한 변수 ***********/
            merchandise : results[1],
            vu : 'v'
            };
            req.app.render('home',context, (err, html)=>{
            res.end(html); })
            });
            }
    }
}