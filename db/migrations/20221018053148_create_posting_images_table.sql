-- migrate:up
CREATE TABLE posting_images (
  id INT NOT NULL AUTO_INCREMENT,
  posting_id INT NOT null,
  image_url VARCHAR(3000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (posting_id) REFERENCES postings (id)
);

-- migrate:down

