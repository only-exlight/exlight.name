CREATE TABLE photos 
(
    id SERIAL PRIMARY KEY,
	img_url VARCHAR(1000) NOT NULL,
	photo_description VARCHAR(1000),
	views INTEGER DEFAULT 0
)