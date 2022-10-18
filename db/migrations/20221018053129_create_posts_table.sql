-- migrate:up
CREATE TABLE postings (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  contents VARCHAR(2000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- migrate:down

