BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Jessie', 'j@gmail.com', 5, '2020-01-25');
INSERT into login (hash, email) values ('$2a$10$hV0AlUVEtoJHMk6Jcz4Oa.51dNepztfRNcAe1Dr42nLvIudRcVmgW', 'j@gmail.com');

COMMIT;