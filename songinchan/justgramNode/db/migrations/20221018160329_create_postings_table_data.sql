-- migrate:up
INSERT INTO postings(user_id, contents) 
VALUES ('1', '작은 성공이 주는 성취감으로 하루를 마무리 할 수 있기를 ❣️');

INSERT INTO postings(user_id, contents) 
VALUES ('1', '오늘은 코딩하기 좋은날 🌷');

INSERT INTO postings(user_id, contents) 
VALUES ('2', 'db 모델링이 정말 재밌어요 ㅎㅎ');

INSERT INTO postings(user_id, contents) 
VALUES ('2', '어려워도 우린 결국 해낼겁니다.');

-- migrate:down

