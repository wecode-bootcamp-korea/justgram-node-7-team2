-- migrate:up
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) unique NOT NULL,
  nickname VARCHAR(50) NULL,
  password VARCHAR(300) NOT NULL,
  profile_image VARCHAR(3000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
);

-- migrate:down

DROP TABLE users;
