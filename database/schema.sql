CREATE DATABASE gamevault;

-- Conecte-se ao banco gamevault antes de executar os comandos abaixo

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    developer VARCHAR(150),
    publisher VARCHAR(150),
    release_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE platforms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE game_platforms (
    game_id BIGINT NOT NULL,
    platform_id BIGINT NOT NULL,
    
    PRIMARY KEY (game_id, platform_id),
    
    CONSTRAINT fk_game_platforms_game 
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
        
    CONSTRAINT fk_game_platforms_platform 
        FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

CREATE TABLE user_games (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    platform_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL, 
    rating INT CHECK (rating >= 1 AND rating <= 5),
    hours_played INT DEFAULT 0,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_user_games_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        
    CONSTRAINT fk_user_games_game 
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
        
    CONSTRAINT fk_user_games_platform 
        FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
        
    CONSTRAINT unique_user_game_platform UNIQUE (user_id, game_id, platform_id)
);