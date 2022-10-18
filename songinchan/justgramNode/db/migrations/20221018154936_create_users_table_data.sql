-- migrate:up
INSERT INTO 
users(email, nickname, password, profile_image) 
VALUES ('codeKim@justcode.co.kr', 'kodeKim', 'c0DeK!m', 'http://profile_image_1.jpeg');

INSERT INTO 
users(email, nickname, password, profile_image) 
VALUES ('codeLee@justcode.co.kr', 'kodeLee', 'C0dEL22', 'http://profile_image_2.jpeg');

INSERT INTO 
users(email, nickname, password, profile_image) 
VALUES ('codePark@justcode.co.kr', 'kodePark', 'P@rkCOdE!', 'http://profile_image_3.jpeg');

INSERT INTO 
users(email, nickname, password, profile_image) 
VALUES ('codeChoi@justcode.co.kr', 'kodeChoi', 'ChoiCodDe', 'http://profile_image_4.jpeg');

-- migrate:down


