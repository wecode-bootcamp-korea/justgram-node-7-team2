-- migrate:up
CREATE TABLE IF NOT EXISTS posting_images
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    posting_id INT NOT NULL,
    image_url VARCHAR(3000),    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (posting_id) REFERENCES postings (id)
);


-- migrate:down
DROP TABLE posting_images;
