//202135973 백지연
const db = require('./db');
const sanitizeHtml = require('sanitize-html')


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
        
            var vu = req.params.vu;
            var sql1=`SELECT * FROM boardtype;`
            var sql2=`SELECT * FROM merchandise;`
            db.query(sql1+sql2, (error, mer) => {

                var i = 0;
                var tableData = ``
                if (0 >= mer[1].length) {
                    tableData += `<tr>
                    <td>자료없음</td> 
                    </tr>`
                }
                else {
                    if (vu == 'v') {
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
                    else if (vu == 'u') {
                        if (isOwner) {
                        while (i < mer[1].length) {
                            tableData += `<tr>
                                        <td><a href="/shop/detail/${mer[1][i].mer_id}"><img src="${mer[1][i].image}" style="width:100px;height:150px; "></a></td>
                                        <td>${mer[1][i].name}</td>
                                        <td>${mer[1][i].price}</td>
                                        <td>${mer[1][i].brand}</td> 
                                        <td><a href="/merchandise/update/${mer[1][i].mer_id}">수정</a></td>
                                        <td><a href="/merchandise/delete/${mer[1][i].mer_id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>삭제</a></td>
                                        </tr>`
                            i++;
                        }
                        }

                    }
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        tableData: tableData,
                        boardtype: mer[0],

                    };
                    req.app.render('home', context, (err, html) => {
                        res.send(html)
                    })
                }
            });
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
        var sql2=`SELECT * FROM merchandise;`
        var sql3=`SELECT * FROM code_tbl;`
        db.query(sql1+sql2+sql3, (error, mer) => {
                var category = ``
                var i = 0;

                while (i < mer[2].length) {
                    category += `<option value="${mer[2][i].sub_id}">${mer[2][i].main_name}-${mer[2][i].sub_name}</option>`
                    i++;
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandiseCU.ejs',
                    logined: 'YES',
                    category: category,
                    title: '상품 입력',
                    list: [{}],
                    formType: 'create',
                    boardtype: mer[0],
                };

                req.app.render('home', context, (err, html) => {
                    res.send(html)
                })
            })
    },
    create_process: (req, res, file) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var post = req.body;
        sanitizedCategory = sanitizeHtml(post.category)
        sanitizedName = sanitizeHtml(post.name)
        sanitizePrice = sanitizeHtml(post.price)
        sanitizedStock = sanitizeHtml(post.stock)
        sanitizedBrand = sanitizeHtml(post.brand)
        sanitizedSupplier = sanitizeHtml(post.supplier)
        sanitizedImage = sanitizeHtml(file)
        sanitizedSaleYn = sanitizeHtml(post.sale_yn)
        sanitizedSalePrice = sanitizeHtml(post.sale_price)
        db.query(`INSERT INTO merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price)
                        VALUES(?,?,?,?,?,?,?,?,?)`,
            [sanitizedCategory, sanitizedName, sanitizePrice, sanitizedStock, sanitizedBrand, sanitizedSupplier, sanitizedImage, sanitizedSaleYn, sanitizedSalePrice], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/merchandise/view/v`)
                res.end();
            })
    },
    update: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }

        var id = req.params.merId;
        var sql1=`SELECT * FROM boardtype;`
        var sql2=`SELECT * FROM merchandise where mer_id=${id};`
        var sql3=`SELECT * FROM code_tbl;`
        db.query(sql1+sql2+sql3, (error, mer) => {
                var formData = ``
                var category = ``
                var i = 0;

                while (i < mer[2].length) {
                    category += `<option value="${mer[2][i].sub_id}">${mer[2][i].main_name}-${mer[2][i].sub_name}</option>`
                    i++;
                }

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandiseCU.ejs',
                    logined: 'YES',
                    formData: formData,
                    category: category,
                    title: '상품 수정',
                    list: mer[1],
                    formType: 'update',
                    boardtype: mer[0]
                };
                req.app.render('home', context, (err, html) => {
                    res.send(html)
                })
            })


    },
    update_process: (req, res,file) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var post = req.body;
        sanitizedCategory = sanitizeHtml(post.category)
        sanitizedName = sanitizeHtml(post.name)
        sanitizePrice = sanitizeHtml(post.price)
        sanitizedStock = sanitizeHtml(post.stock)
        sanitizedBrand = sanitizeHtml(post.brand)
        sanitizedSupplier = sanitizeHtml(post.supplier)
        sanitizedImage = sanitizeHtml(file)
        sanitizedSaleYn = sanitizeHtml(post.sale_yn)
        sanitizedSalePrice = sanitizeHtml(post.sale_price)
        sanitizedMerId = sanitizeHtml(post.mer_id)

        console.log(file)

        
        if(file=='No'){
        db.query(`UPDATE merchandise SET category=?, name=?, price=?, stock=?, brand=?, supplier=?, sale_yn=?, sale_price=? where mer_id=?`,
            [sanitizedCategory, sanitizedName, Number(sanitizePrice), Number(sanitizedStock), sanitizedBrand, sanitizedSupplier, sanitizedSaleYn, Number(sanitizedSalePrice), Number(sanitizedMerId)], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/merchandise/view/u`)
                res.end();
            })
        }


        else{db.query(`UPDATE merchandise SET category=?, name=?, price=?, stock=?, brand=?, supplier=?, image=?, sale_yn=?, sale_price=? where mer_id=?`,
            [sanitizedCategory, sanitizedName, Number(sanitizePrice), Number(sanitizedStock), sanitizedBrand, sanitizedSupplier, sanitizedImage, sanitizedSaleYn, Number(sanitizedSalePrice), Number(sanitizedMerId)], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/merchandise/view/u`)
                res.end();
            })
        }
    },
    delete_process: (req, res) => {
        if (authIsOwner(req, res) === false) {
            res.end(`<script type='text/javascript'>alert("접근 권한이 없습니다")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
        }
        var id = req.params.merId
        sanitizeMerId = sanitizeHtml(Number(id))


        db.query(`delete from merchandise where mer_id=?;`,
            [sanitizeMerId], (error, result) => {
                if (error) {
                    throw error;
                }
                res.redirect(`/merchandise/view/u`)
                res.end();
            })
    },

}
