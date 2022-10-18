-- migrate:up
INSERT INTO comments(posting_id, comment, user_id) 
VALUES ('1', '작은 성공이 모여 큰 성취가 되니까요!', '3');

INSERT INTO comments(posting_id, comment, user_id) 
VALUES ('4', '같이 힘냅시다', '1');

INSERT INTO comments(posting_id, comment, user_id) 
VALUES ('2', '햇살이 너무 좋아서 코딩하고 싶지 않아요', '2');

INSERT INTO comments(posting_id, comment, user_id) 
VALUES ('2', '지금 비오는걸요', '4');

INSERT INTO comments(posting_id, comment, user_id) 
VALUES ('3', '모델링 최고! 생각하는거 너무 재밌죠', '3');

INSERT INTO comments(posting_id, comment, user_id) 
VALUES ('4', '언제나 길이 있기 마련입니다', '1');

INSERT INTO comments(posting_id, comment, user_id) 
VALUES ('1', '자다가 코딩하는 꿈꿀 것 같아요', '4');

-- migrate:down

