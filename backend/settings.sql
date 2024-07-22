CREATE DATABASE pots_pal;
CREATE USER pots_pal_user WITH PASSWORD 'pots_pal';
GRANT ALL PRIVILEGES ON DATABASE pots_pal TO pots_pal_user;
ALTER DATABASE pots_pal OWNER TO pots_pal_user;
