-- migrate:up
CREATE TABLE users (
  id INT AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  nickname VARCHAR(50),
  password VARCHAR(300) NOT NULL,
  profile_image VARCHAR(3000),
  create_at DATETIME DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- migrate:down

