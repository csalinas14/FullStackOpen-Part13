CREATE TABLE blogs ( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes int DEFAULT 0);
insert into blogs (author, url , title) values ('Me', 'www.test.com', 'First');
insert into blogs (author, url, title) values ('Me', 'www.wow.com', 'Second');