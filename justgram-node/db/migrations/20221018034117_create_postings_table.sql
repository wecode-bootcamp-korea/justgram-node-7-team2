-- migrate:up
CREATE TABLE postings (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  contents VARCHAR(2000) NULL,
  create_at DATETIME DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);


-- migrate:down

