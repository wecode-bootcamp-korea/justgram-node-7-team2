-- migrate:up
CREATE TABLE comments (
  id INT AUTO_INCREMENT,
  comment VARCHAR(2000),
  posting_id INT NOT NULL,
  user_id INT NOT NULL,
  create_at DATETIME DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (posting_id) REFERENCES postings (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- migrate:down

