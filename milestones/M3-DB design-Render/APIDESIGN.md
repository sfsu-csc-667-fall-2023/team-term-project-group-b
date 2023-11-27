| Action (in sequence)                         | Inputs/Data                                      | Preconditions                             | Post Conditions                            | API Endpoint       |
|--------------------------------------------- |--------------------------------------------------|------------------------------------------ |------------------------------------------- |------------------- |
| User creates a game with other players       | How many players                                 | Have players together                     | Game created                               | POST /games/:id/…  |
| Initial betting (blind bet)                  | Blind bets from each player                       | Player has chips in pot                   | Fold or blind in                            |                    |
| Dealer deals initial cards on table          | No input from players                             | none                                     | Communal cards dealt                        |                    |
| Deals a 2 card secret hand to each player    | No input from players                             | Player must not have folded               | Players now have 2 card hand face down      |                    |
| Player places bet (or choosing to fold)     | Bet amount from each player; must match or exceed previous players bet or fold. If no players have bet yet, can defer to next player, no bet made | All hands dealt | Players have folded or have placed necessary bets |                    |
| First flip of new card in communal hand (cards on table) | no inputs                             | All players will have bet or folded       | New card is drawn from deck and placed faceup on table |                    |