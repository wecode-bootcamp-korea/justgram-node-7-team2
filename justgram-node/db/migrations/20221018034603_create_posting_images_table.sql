-- migrate:up
CREATE TABLE posting_images (
  id INT AUTO_INCREMENT,
  posting_id INT NOT NULL,
  image_url VARCHAR(3000),
  create_at DATETIME DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (posting_id) REFERENCES postings (id)
);

-- migrate:down

