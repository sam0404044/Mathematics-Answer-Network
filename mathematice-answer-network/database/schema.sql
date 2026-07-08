CREATE TABLE IF NOT EXISTS user_info (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NULL,
  grade TINYINT UNSIGNED NULL,
  school VARCHAR(100) NULL,
  gender VARCHAR(20) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  google_id VARCHAR(255) NULL,
  plan_status TINYINT UNSIGNED NOT NULL DEFAULT 0,
  points INT UNSIGNED NOT NULL DEFAULT 5,
  last_login DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_email (email),
  UNIQUE KEY uq_user_google_id (google_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS questionForTest (
  uid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  question LONGTEXT NOT NULL,
  option_a TEXT NULL,
  option_b TEXT NULL,
  option_c TEXT NULL,
  option_d TEXT NULL,
  option_e TEXT NULL,
  answer JSON NOT NULL,
  explanation LONGTEXT NULL,
  questionYear VARCHAR(100) NOT NULL,
  type ENUM('single', 'multiple') NOT NULL DEFAULT 'single',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (uid),
  KEY idx_question_year (questionYear)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_score_status (
  userid BIGINT UNSIGNED NOT NULL,
  score_now JSON NULL,
  last_quiz JSON NULL,
  last_review JSON NULL,
  last_set JSON NULL,
  wrong_question_set JSON NULL,
  status TINYINT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (userid),
  CONSTRAINT fk_score_user FOREIGN KEY (userid) REFERENCES user_info(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_tree_status (
  userid BIGINT UNSIGNED NOT NULL,
  complete_test INT UNSIGNED NOT NULL DEFAULT 0,
  status TINYINT UNSIGNED AS (LEAST(FLOOR(MOD(complete_test, 25) / 5), 4)) STORED,
  gap TINYINT UNSIGNED AS (5 - MOD(complete_test, 5)) STORED,
  total_tree INT UNSIGNED AS (FLOOR(complete_test / 25)) STORED,
  PRIMARY KEY (userid),
  CONSTRAINT fk_tree_user FOREIGN KEY (userid) REFERENCES user_info(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_answer_record (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  userid BIGINT UNSIGNED NOT NULL,
  answer JSON NOT NULL,
  answer_review JSON NULL,
  cost_time INT UNSIGNED NOT NULL DEFAULT 0,
  question_bank VARCHAR(100) NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_answer_user_time (userid, time),
  CONSTRAINT fk_answer_user FOREIGN KEY (userid) REFERENCES user_info(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_resets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) NOT NULL,
  token CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_password_reset_token (token),
  KEY idx_password_reset_email (email),
  KEY idx_password_reset_expiry (expires_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exam_files (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  exam_year VARCHAR(20) NOT NULL,
  exam_type VARCHAR(50) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INT UNSIGNED NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_exam_filename (filename),
  KEY idx_exam_user (user_id),
  CONSTRAINT fk_exam_user FOREIGN KEY (user_id) REFERENCES user_info(id) ON DELETE CASCADE
) ENGINE=InnoDB;
