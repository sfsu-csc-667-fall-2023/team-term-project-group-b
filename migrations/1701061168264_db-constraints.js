/* eslint-disable camelcase */


exports.shorthands = undefined;


exports.up = pgm => {


 pgm.addConstraint('game_state', 'fk_game_state_id', {
     foreignKeys: {
       columns: 'game_id',
       references: 'game(id)'
     }
   });
 pgm.addConstraint('game_state', 'fk_turn_player_id', {
     foreignKeys: {
       columns: 'turn_player_id',
       references: '"user"(id)'
     }
   });
   pgm.addConstraint("game_state", "fk_hole_cards_id", {
     foreignKeys: {
       columns: 'hole_cards',
       references: 'cards(id)'
     }
   });
    pgm.addConstraint('game_users', 'fk_user_id_game_users', {
     foreignKeys: {
       columns: 'user_id',
       references: '"user"(id)',
     },
   });
   pgm.addConstraint("game_users", "fk_game_id_game_users", {
     foreignKeys: {
       columns: 'game_id',
       references: 'game(id)'
     }
   });
   pgm.addConstraint('game_cards', 'fk_game_id_game_cards', {
     foreignKeys: {
       columns: 'game_id',
       references: 'game(id)',
     },
   });
    pgm.addConstraint('game_cards', 'fk_card_id_game_cards', {
     foreignKeys: {
       columns: 'card_id',
       references: 'cards(id)',
     },
   });
   pgm.addConstraint('game_cards', 'fk_user_id_game_cards', {
     foreignKeys: {
       columns: 'user_id',
       references: '"user"(id)',
     },
   });
   };
   exports.down = pgm => {
      pgm.dropConstraint('game_state', 'fk_game_state_id');
      pgm.dropConstraint('game_state', 'fk_turn_player_id');
      pgm.dropConstraint("game_state", "fk_hole_cards_id");
      pgm.dropConstraint('game_users', 'fk_user_id_game_users');
      pgm.dropConstraint("game_users", "fk_game_id_game_users");
      pgm.dropConstraint('game_cards', 'fk_game_id_game_cards');
      pgm.dropConstraint('game_cards', 'fk_card_id_game_cards');
      pgm.dropConstraint('game_cards', 'fk_user_id_game_cards');
    };