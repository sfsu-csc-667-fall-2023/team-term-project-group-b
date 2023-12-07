/* eslint-disable camelcase */


exports.shorthands = undefined;


exports.up = pgm => {


 pgm.addConstraint('game_state', 'fk_game_state_id', {
     foreignKeys: {
       columns: 'game_id',
       references: 'games(id)',
       onDelete: 'CASCADE',
     }
   });
   
  pgm.addConstraint('game_users', 'fk_user_id_game_users', {
     foreignKeys: {
       columns: 'user_id',
       references: 'users(id)',
       onDelete: 'CASCADE',
     },
   });
   pgm.addConstraint("game_users", "fk_game_id_game_users", {
     foreignKeys: {
       columns: 'game_id',
       references: 'games(id)',
       onDelete: 'CASCADE',
     }
   });

    pgm.addConstraint('game_cards', 'fk_card_id_game_cards', {
     foreignKeys: {
       columns: 'card_id',
       references: 'cards(id)',
       onDelete: 'CASCADE',
     },
   });
   pgm.addConstraint('game_cards', 'fk_user_id_game_cards', {
     foreignKeys: {
       columns: 'user_id',
       references: 'users(id)',
       onDelete: 'CASCADE',
     },
   });
   
  pgm.addConstraint('games', 'fk_winner_games', {
    foreignKeys: {
      columns: 'winner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

   exports.down = pgm => {
      pgm.dropConstraint('game_state', 'fk_game_state_id');
      pgm.dropConstraint('game_state', 'fk_turn_player_id');
      pgm.dropConstraint("game_state", "fk_hole_cards_id");
      pgm.dropConstraint('game_users', 'fk_user_id_game_users');
      pgm.dropConstraint("game_users", "fk_game_id_game_users");
      pgm.dropConstraint('game_cards', 'fk_card_id_game_cards');
      pgm.dropConstraint('game_cards', 'fk_user_id_game_cards');
      pgm.dropConstraint("games", "fk_winner_games")
    };