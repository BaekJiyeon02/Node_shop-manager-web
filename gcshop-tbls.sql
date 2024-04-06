use webdb2023;
/*******************************************************/

drop table person;
drop table code_tbl;
drop table merchandise;
drop table board;
drop table boardtype;
drop table purchase;
drop table cart;



/*******************************************************/

select * from person;

create table person (
loginid varchar(10) not null,
password varchar(10) not null,
name varchar(20) not null,
address varchar(50) null,
tel varchar(13) not null, 
birth varchar(8) not null, 
class varchar(2) not null, /*00 : CEO, 01 : 관리자, 02 : 일반고객 */
point int, 
PRIMARY KEY(loginid)
);

insert into person
values('bhwang99','bhwang99','왕보현','서울','010-8340-3779','00000000','01',0);

insert into person
values('webuser','webuser','웹유저','인천','031-750-5750','00000000','02',0);

insert into person
values('bbc','bbc','백지연','서울','010-3068-5161','00000000','02',0);

insert into person
values('mis','mis','경영자','성남','031-750-5330','00000000','00',0);
commit;
/****************************************************/


create table code_tbl (
main_id varchar(4) not null,
sub_id varchar(4) not null,
main_name varchar(100) not null,
sub_name varchar(100) not null,
start varchar(8) not null,
end varchar(8) not null,
PRIMARY KEY(main_id,sub_id)
);

select * from code_tbl ;

insert into code_tbl
values('0000','0001','상품','의류','20231001','20301231'); 

insert into code_tbl
values('0000','0002','상품','식품','20231103','20301231'); 

insert into code_tbl
values('0000','0003','상품','가전','20231106','20301231'); 


/****************************************************/

create table merchandise (
mer_id int NOT NULL auto_increment,
category varchar(4) not null,
name varchar(100) not null,
price int not null,
stock int not null, 
brand varchar(100) not null, 
supplier varchar(100) not null, 
image varchar(50), 
sale_yn varchar(1),
sale_price int,
PRIMARY KEY(mer_id)
);


insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0001','티셔츠',3000,1,'스튜디오톰보이','스튜디오톰보이','/images/womenCloth1.png','N',3000);

insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0001','코트',6000,1,'스튜디오톰보이','스튜디오톰보이','/images/womenCloth2.png','N',6000);

insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0001','떡볶이 코트',5000,1,'스튜디오톰보이','스튜디오톰보이','/images/womenCloth3.png','N',5000);

insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0001','코트',4000,1,'스튜디오톰보이','스튜디오톰보이','/images/womenCloth4.png','N',4000);

insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0002','말차 케이크',1000,1,'누데이크','누데이크','/images/cakeFood.png','N',1000);


select * from merchandise;
/****************************************************/
create table boardtype (
type_id int NOT NULL auto_increment,
title varchar(200) not null,
description varchar(400) ,
write_YN varchar(1) not null,
re_YN varchar(1) not null,
numPerPage int not null,
PRIMARY KEY(type_id)
);

select * from boardtype;

INSERT INTO boardtype (title, numPerPage, description, write_YN, re_YN) VALUES('공지사항',4,'학생들에게 공지할 것','N','N');
INSERT INTO boardtype (title, numPerPage, description, write_YN, re_YN) VALUES('Q&A',2,'학생들이 질문 할 것','Y','N');

/***************************************************/

create table board (
board_id int NOT NULL auto_increment,
type_id int ,
p_id int, 
loginid varchar(10) NOT NULL,
title varchar(200) ,
date varchar(30) NOT NULL,
content text,
PRIMARY KEY(board_id)
);


INSERT INTO board (type_id, loginid, title, date, content) VALUES('1','bhwang99','첫번째입니다', '2023.11.10 : 18시 4분 3초','테스트');
INSERT INTO board (type_id, loginid, title, date, content) VALUES('1','bhwang99','두번째입니다', '2023.11.10 : 18시 4분 3초','테스트');
INSERT INTO board (type_id, loginid, title, date, content) VALUES('1','bhwang99','세번째입니다', '2023.11.10 : 18시 4분 3초','테스트');
INSERT INTO board (type_id, loginid, title, date, content) VALUES('1','bhwang99','네번째입니다', '2023.11.10 : 18시 4분 3초','테스트');
INSERT INTO board (type_id, loginid, title, date, content) VALUES('1','bhwang99','다섯번째입니다', '2023.11.10 : 18시 4분 3초','테스트');
INSERT INTO board (type_id, loginid, title, date, content) VALUES('1','bhwang99','여섯번째입니다', '2023.11.10 : 18시 4분 3초','테스트');

INSERT INTO board (type_id, loginid, title, date, content) VALUES('2','webuser','테스트임다', '2023.11.10 : 18시 4분 3초','테스트');
INSERT INTO board (type_id, loginid, title, date, content) VALUES('2','webuser','테스트임다', '2023.11.10 : 19시 4분 3초','테스트');
INSERT INTO board (type_id, loginid, title, date, content) VALUES('2','bhwang99','관리자 테스트입니다', '2023.11.17 : 18시 4분 3초','테스트');

select * from board;
commit;

/***************************************************/

create table purchase (
purchase_id int NOT NULL auto_increment,
loginid varchar(10) NOT NULL,
mer_id int NOT NULL ,
date varchar(30) NOT NULL,
price int,
point int,
qty int,
total int,
payYN  varchar(1) NOT NULL default 'N',
cancel varchar(1) NOT NULL default 'N',
refund varchar(1) NOT NULL default 'N',
PRIMARY KEY(purchase_id)
);

select * from purchase;

INSERT INTO purchase (loginid, mer_id, date, price, total, point, qty, payYN) VALUES('webuser',1,'2023.11.10 : 18시 4분 3초',3000,6000,30,2,'Y');



/***************************************************/


create table cart (
cart_id int NOT NULL auto_increment,
loginid varchar(10) NOT NULL,
mer_id int NOT NULL,
date varchar(30) NOT NULL,
PRIMARY KEY(cart_id)
);


INSERT INTO cart (loginid, mer_id, date) VALUES ('bhwang99',1,'2023.11.18 : 18시 4분 3초');
INSERT INTO cart (loginid, mer_id, date) VALUES ('webuser',1,'2023.11.15 : 18시 4분 3초');
INSERT INTO cart (loginid, mer_id, date) VALUES ('webuser',2,'2023.11.16 : 18시 4분 3초');
INSERT INTO cart (loginid, mer_id, date) VALUES ('webuser',3,'2023.11.17 : 18시 4분 3초');



