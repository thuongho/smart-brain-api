BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Jessie', 'jessie@gmail.com', 5, '2020-01-25');
INSERT into login (hash, email) values ('$2a$10$mXGNv6tzFP.WfghUfy/08ujGySORWO7YXhoL8l.d6VIRVOyKBymDe', 'jessie@gmail.com');

COMMIT;