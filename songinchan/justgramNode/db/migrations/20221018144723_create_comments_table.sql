-- migrate:up
CREATE TABLE IF NOT EXISTS comments
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    comment VARCHAR(2000),
    posting_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (posting_id) REFERENCES postings (id)
);

-- migrate:down
DROP TABLE comments;
