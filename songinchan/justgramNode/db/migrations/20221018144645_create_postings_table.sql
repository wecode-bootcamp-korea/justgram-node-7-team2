-- migrate:up
CREATE TABLE IF NOT EXISTS postings
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    contents VARCHAR(2000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

ALTER table postings 
ADD view_cnt 
NUMERIC default 0 not null

-- migrate:down
DROP TABLE postings;

ALTER table postings 
DROP view_cnt 
