-- migrate:up
INSERT INTO posting_images(posting_id, image_url) 
VALUES ('1', 'http://posting_1_image_1.jpeg');

INSERT INTO posting_images(posting_id, image_url) 
VALUES ('1', 'http://posting_1_image_2.jpeg');

INSERT INTO posting_images(posting_id, image_url) 
VALUES ('2', 'http://posting_1_image_2.jpeg');

INSERT INTO posting_images(posting_id, image_url) 
VALUES ('3', 'http://posting_2_image_1.jpeg');

INSERT INTO posting_images(posting_id, image_url) 
VALUES ('3', 'http://posting_3_image_1.jpeg');

INSERT INTO posting_images(posting_id, image_url) 
VALUES ('3', 'http://posting_3_image_2.jpeg');

INSERT INTO posting_images(posting_id, image_url) 
VALUES ('4', 'http://posting_4_image_1.jpeg');

-- migrate:down

