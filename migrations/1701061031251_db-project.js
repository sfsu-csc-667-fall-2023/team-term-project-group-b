exports.shorthands = undefined;

exports.up = (pgm) => {
// Create ENUM types
pgm.createType("suits", ["diamonds", "hearts", "clubs", "spades"]);
pgm.createType("trophies", ["3_streak", "5_streak", "10_streak"]);

// Create "user" table
pgm.createTable("users", {
id: { type: "id", primaryKey: true },
username: { type: "varchar(255)", notNull: true },
password: { type: "varchar(255)", notNull: true },
email: { type: "varchar(255)", notNull: true },
profile_image: "varchar(255)",
bio: {type: "varchar(255)", default: ""},
created_at: {
  type: "timestamp",
  notNull: true,
  default: pgm.func("now()"),
},
updated_at: { type: "timestamp", default: pgm.func("now()")},
trophies: { type: "trophies"},
});

// Create "game" table
pgm.createTable("game", {
id: { type: "id", primaryKey: true },
players_allowed: { type: "int", notNull: true },
password: { type: "varchar(100)", notNull: true },
started_at: { type: "timestamp", notNull: true },
created_at: {
  type: "timestamp",
  notNull: true,
  default: pgm.func("now()"),
},
updated_at: { type: "timestamp", notNull: true },
});

pgm.createTable("games", {
  id: "id",
  game_socket_id: {
    type: "varchar",
    notNull: true,
  },
  created_at: {
    type: "timestamp",
    notNull: true,
    default: pgm.func("current_timestamp"),
  },
  initialized: {type: "boolean", default: false},
  current_seat: {type: "int"},
});

// Create "game_state" table
pgm.createTable("game_state", {
  game_id: { type: "int", notNull: true , unique: true},
  round_number: { type: "int", notNull: true },
  turn_player_id: { type: "int", notNull: true },
  turn_number: "int",
  pot: {type:"int", notNull: true, default: 0},
  hole_cards: "int",
});

// Create "game_users" table
pgm.createTable("game_users", {
  user_id: { type: "int", notNull: true },
  game_id: { type: "int", notNull: true },
  ready: { type: "boolean", default: false},
  seat: {type:"int", notNull: true},
  chips: { type: "int", notNull: true, default: 0},
  folded: {type:"boolean", default: false},
});

// Create "cards" table
pgm.createTable("cards", {
  id: { type: "id", primaryKey: true },
  value: {type: "int", notNull: true},
  suit: {type: "int", notNull: true},
});

//(cards table)
const sql = "INSERT INTO cards (suit, value) VALUES";
const values = [];

for (let suit = 0; suit < 4; suit++) {
  for (let value = 1; value <= 13; value++) {
      values.push(`(${suit}, ${value})`);
  }
}

const query = `${sql} ${values.join(",")}`;

pgm.sql(query);

// Create "game_cards" table
pgm.createTable("game_cards", {
  game_id: "int",
  card_id: "int",
  user_id: "int",
  card_order: "int",
  seat: "int",
});

exports.down = (pgm) => {
// Drop tables
  pgm.dropTable("game_cards");
  pgm.dropTable("cards");
  pgm.dropTable("game_users");
  pgm.dropTable("game_state");
  pgm.dropTable("game");
  pgm.dropTable("games");
  pgm.dropTable("users");

// Drop ENUM types
  pgm.dropType("trophies");
  pgm.dropType("suits");
};
}