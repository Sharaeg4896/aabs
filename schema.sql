DROP DATABASE IF EXISTS cpt_DB;
CREATE DATABASE cpt_DB;
use cpt_DB;

CREATE TABLE scans (
	id INT AUTO_INCREMENT NOT NULL,
    type VARCHAR(5) NOT NULL,
	cpt INT NOT NULL,
    description VARCHAR(50) NOT NULL,
    primary key(id)
);