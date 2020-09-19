
/**** Javascript : Tic Tac Toe w/ minimax | Author : Joseph Davidson | copyright @ 2016 ****/

// enclosure for game module : prototyple revealing pattern
var T3 = (function () {

    // Game utilities and materials
    var Util = {

        // basic code utility methods
        copy: function (obj) {

            var offspring = [];
            var x = obj.length;
            while (x--) {
                offspring[x] = obj[x];
            }
            return offspring;

        }, // copies an object or an array : returns array
        clone: function (obj) {

            var offspring = {};
            for (var x in obj) {
                offspring[x] = obj[x];
            }
            return offspring;

        }, // copies an object or an array : returns object
        convert: function (gameboard) {

            var values = [];
            var x = gameboard.length;
            while (x--) {
                values[x] = gameboard[x].innerHTML;
            }
            return values;

        }, // returns an array of gameboard values
        indices: function (board) {

            var positions = [];
            var x = 0;
            while (x < 9) {
                if (board[x] === '') { positions[positions.length] = x; }
                x++;
            }
            return positions;

        },// returns an array of board indices with empty values

        // array sorting methods for minimax : uses ( move ) object literals
        sort_mini: function (a, b) {

            if (a.score > b.score) { return 1; }
            else if (a.score < b.score) { return -1; }
            else { return 0; }

        }, // maximixer array sorting method
        sort_maxi: function (a, b) {

            if (a.score < b.score) { return 1; }
            else if (a.score > b.score) { return -1; }
            else { return 0; }
        }, // minimizer array sorting method

        // The UIUX controller for the current game
        UI: {},

        // Patterns for X/O lines in Tic-Tac-Toe // Horizontal, Vertical, and Diagonal
        patterns: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]], // patterns by which markers can be placed to win the game
    };

    // Class : for Tic Tac Toe game
    var Game = function (level, human) {

        this.level = level; // Game Play Level // Win or Tie!, or Lose or Tie!
        this.player = 'X'; // The Marker Chosen for the Human Player
        this.human = human; // Copy of the human for AI simulation
        this.computer = this.human === 'X' ? 'O' : 'X'; // Sets AI to Opposite of Human Marker
        this.board = Util.copy(document.getElementsByClassName('game-square')); // AI Simulation of Game Board
        this.turns = 0; // Actual Game Turns Taken
        this.status = 'new'; // Current Game Status
    };
    // Game Level Currently Set
    Game.numeric_level = function (level) {

        // switch to convert string to numeric level
        switch (level) { case 'Win or Tie!': return 3; case 'Lose or Tie!': return 4; }

    }; // returns numeric representation of game @level : 1-3
    Game.prototype.gameover = function (board) {

        // substitute game for node with board argument
        var board = board ? board : this.node();

        // reference patterns for winning in Util.patterns
        var p = Util.patterns;

        // variable to count how many lines are tied
        var ties = 0;

        // fast reverse loop
        var x = 8;

        // Reverse While Loop has the fastest bench mark in JavaScript for FAST AI thinking
        while (x--) {
            // use smaller variable names ( a, b, c ) to reference 3 squares in pattern
            var a = board[p[x][0]], b = board[p[x][1]], c = board[p[x][2]];

            // pack values into an array for indexing
            var line = Util.convert([a, b, c]);

            // if squares aren't empty and all are the same
            if (a !== '' && a === b && b === c) {
                // game has been won
                return a === this.computer ? 10 - this.turns : -10 + this.turns;
            }
            else if (line.indexOf('X') > -1 && line.indexOf('O') > -1) // find index of both players in array literal
            {
                // line is a tie
                ties++;
            }
        }

        // return 0 if all lines are tied
        if (ties > 7) { return 0; }

        // game has not been won
        return false;

    }; // returns values for gameover on @board or live gameboard
    Game.prototype.is_tie = function () {

        return this.gameover() === 0;

    };

    // Checks and returns boolean true or false for tie
    Game.prototype.live_tie = function () {

        // Gets game squares into array to check values
        var board = document.getElementsByClassName('game-square');

        // Number of tied lines, i.e. Horizontal, Vertical, or Diagonal
        var ties = 0;

        // Each line will be evaluated as X
        var x = Util.patterns.length;

        // Reverse while loop for FAST iteration
        while (x--) {
            var computer = 0, human = 0;
            var y = 3;
            while (y--) {
                var index = Util.patterns[x][y];
                if (board[index].innerHTML === this.human) { human++; }
                if (board[index].innerHTML === this.computer) { computer++; }
            }
            if (computer && human) { ties++; }
        }
        if (ties >= 8) { return true; }
        return false;
    };
    Game.prototype.change_turns = function () {

        // tournary swap X player for O
        this.player = this.player === 'X' ? 'O' : 'X';

        // if each player has taken a turn : update turns
        if (this.player === 'X') { this.turns++; }
    }; // cycles this.player(X,O) and increments this.turns
    Game.prototype.place_marker = function (position) {

        // check that the game is running and that the board position is vacant
        if (this.board[position].innerHTML === '' && this.status === 'running') {
            // set the board position to the player's marker
            this.board[position].innerHTML = this.player;

            // update game turns
            this.change_turns();

            // validate action
            return true;
        }

        // no action taken
        return false;

    }; // places @player marker in @position and ::change_turns()
    Game.prototype.clear_board = function (timing_sec) {

        // cipher this object
        var game = this;

        // correct unidentified timing
        var timing_sec = timing_sec || 0;

        // iterate and clear game board squares
        setTimeout(function () { game.board.forEach(function (square) { square.innerHTML = ''; }); }, timing_sec * 1000);

    }; // clears the game squares after timing
    Game.prototype.node = function () {

        return Util.convert(document.getElementsByClassName('game-square'));

    }; // returns a converted copy of gameboard
    Game.prototype.negamax = function (node, player, depth) {

        // check for terminal state
        var win = this.gameover(node);
        if (win !== false) {
            if (this.level.numeric = 3) {
                return { score: win };
            }
            else {
                return { score: -win };
            }
        } // return win if terminal		
        if (depth === 0) { return { score: 0 }; } // return 0 if at level depth

        // create easy opponent representation variable
        var opponent = player === 'X' ? 'O' : 'X';

        // get available game square indices
        var indices = Util.indices(node);

        // array of tested move indices
        var move_map = [];

        // record of highest score for this state
        var best_score = 0;

        // iterate over squares
        var x = 0; while (x < indices.length) {
            // set position on node to player marker
            node[indices[x]] = player;

            // get score of outcome for move
            var score = this.negamax(node, opponent, depth - 1).score;

            // determine current player being evaluated
            if (player === this.computer) // maximizing player
            {
                if (score > best_score) { best_score = score; }
                move_map[move_map.length] = { score: score, position: indices[x] };
            }
            else // minimizing player
            {
                if (score < best_score) { best_score = score; }
                move_map[move_map.length] = { score: score, position: indices[x] };
            }

            // remove player marker from node
            node[indices[x]] = '';

            // increment x
            x++;
        }

        // get the moves with the best_scores
        if (player === this.computer) {
            // algorith for Hard level 
            if (this.level.string === 'You Lose!') {
                move_map.sort(Util.sort_maxi);
            }
            else // algorithm for Easy level "You Win!"
            {
                move_map.sort(Util.sort_mini);
            }
        }
        else {
            // algorithm for You Lose level 
            if (this.level.string === 'You Lose!') {
                move_map.sort(Util.sort_mini);
            }
            else {
                move_map.sort(Util.sort_maxi);
            }
        }

        // Moves Still left open for the AI to make
        var moves = move_map.filter(function (move) {

            // Scoring for moves based on chances to win in the shortest amount of moves
            return move.score === move_map[0].score;

        });

        // Perform simulation if more than one move exists
        if (moves.length > 1) {
            return { score: move_map[0].score, position: move_map[0].position, moves: moves };
        }
        else {
            return move_map[0] || { score: 0 };
        }

    }; // returns a recursive board rating for a @node at @depth
    Game.prototype.make_move = function () { // uses evaluations and negamax to make move a game.level

        // set negamax argument variables
        var node = this.node();
        var player = this.computer;
        var depth = this.level.numeric * 3; // Number of moves to look ahead for AI

        // increment actual turns
        this.turns++;

        // if the computer is X and it's turn 1
        if (this.computer === 'X' && this.turns === 1) {
            // set index to random number between 0 and max moves
            var index = Math.floor(Math.random() * 9);

            // place marker at random index
            this.place_marker(index);
        }
        else // if not computer is going first
        {/**/
            // get best move or moves using the minimax algorithm
            var move = this.negamax(node, player, depth);

            if (move.position !== undefined) // if there at least is one best move
            {
                // place marker at best position
                this.place_marker(move.position);
            }/**/
        }
        /**/
        // check game board for terminal tie game
        if (this.live_tie()) {
            /* Display Tie Game Message */
            Util.UI.display_message('Tie Game!!!');
            setTimeout(function () { Util.UI.reset_game(); }, 3000); // reset the game after 3 seconds
            /**/
        }
    }; // Ai player makes a move

    var UI = function () {

        // game selection and button elements in an array
        this.selections = Util.copy(document.getElementsByClassName('selection'));
        this.buttons = Util.copy(document.getElementsByClassName('game-button'));

        // cue for locking and unlocking game selection and the gameboard
        this.locked = false;

        // temporary locking for panel intermissions
        this.active = false;

        // the game being played
        this.game = {};
    };
    UI.notify = function () {

        // notify blueprint to reset games on all objects
        this.reset_game(true);

    };
    UI.prototype.activate = function (timing_ms) {

        // cipher this object
        var ui = this;

        // lock activity on panel
        this.active = true;

        // set timer to remove lock
        setTimeout(function () {

            // remove lock
            ui.active = false;

        }, timing_ms);
    };
    UI.prototype.display_message = function (txt) {

        // create new paragraph element
        var p = document.createElement('p');

        // add display-message css class to created element
        p.classList.add('display-message');

        // set position to math on window.innerWidth
        p.style.position = 'absolute';
        p.style.top = '20px';
        p.style.left = window.innerWidth / 2 - 200 + 'px';

        // set text of message to text
        p.innerHTML = txt;

        // post text to document body : .005 sec load/unload time
        document.body.appendChild(p);

        // fade element in / fade element out / remove element from body
        setTimeout(function () { p.style.opacity = 1; p }, 100); // fade in
        setTimeout(function () { p.style.opacity = 0; }, 1100); // fade out
        setTimeout(function () { document.body.removeChild(p); }, 1300); // remove after finished

    };
    UI.prototype.set_innerHTML = function (elem_id, html) {

        // get element by element id
        var elem = document.getElementById(elem_id);

        // fade element to new inner html
        elem.style.opacity = 0; // <- fade out : / change html : | fade in 
        setTimeout(function () { elem.innerHTML = html; elem.style.opacity = 1; }, 1100); // fade timing * 2 + elem loading time
    };
    UI.prototype.new_game = function () {

        // set variables for selections : game AI level, human player marker
        var level = { numeric: Game.numeric_level(this.selections[1].innerHTML), string: this.selections[1].innerHTML };
        var side = this.selections[0].innerHTML;

        // set this.game object to a new game object with the current element selections
        this.game = new Game(level, side);
    };
    UI.prototype.start_game = function () {

        // cipher object's this
        var ui = this;

        // start new game
        this.new_game(); // create new game object
        this.display_message('Start Game.'); // post message to screen
        this.locked = true; // lock the panel
        this.activate(1200); // set temporary lock for start button
        this.set_innerHTML('start-button', 'Reset Game'); // change button inner html
        this.game.status = 'running'; // update the game status
        if (this.game.computer === 'X') { setTimeout(function () { ui.game.make_move(); }, 600); }
    };
    UI.prototype.reset_game = function (bool_standard) {

        // game in progress is reset
        this.locked = false; // unlock the panel
        this.activate(1200); // set temporary lock for reset button
        this.set_innerHTML('start-button', 'Start Game'); // change button inner html
        this.game.clear_board(0.6); // clear the game squares of markers
        this.game = {}; // reset game object

        if (bool_standard) // reset with reset button not gameover
        {
            this.display_message('Game Reset.'); // post message to screen
            this.selections[0].innerHTML = 'X';
            this.selections[1].innerHTML = 'You Lose!';
        }

        return this;
    };
    UI.prototype.load_buttons = function () {

        // cipher this object
        var ui = this;

        // add event listener to side-select button for click event
        this.buttons[0].addEventListener('click', function (e) {

            // check for panel lock and swap selected marker : X or O
            if (!ui.locked) {

                ui.selections[0].innerHTML = ui.selections[0].innerHTML === 'X' ? 'O' : 'X';
                ui.game.human = ui.selections[0].innerHTML;
                ui.game.computer = ui.game.human === 'X' ? 'O' : 'X';
            }
        });

        // add event listener to level-select button for click event
        this.buttons[1].addEventListener('click', function (e) {

            // check for panel lock
            if (!ui.locked) {
                switch (ui.selections[1].innerHTML) {
                    case 'Win or Tie!': ui.selections[1].innerHTML = 'Lose or Tie!'; break;
                    case 'Lose or Tie!': ui.selections[1].innerHTML = 'Win or Tie!'; break;
                }
            }
        });

        // add event listener to start/reset button for click event
        this.buttons[2].addEventListener('click', function (e) {

            if (ui.locked && !ui.active) {
                // game in progress is reset
                ui.reset_game(true);
            }
            else if (!ui.active) {
                // start new game
                ui.start_game();
            }
        });
    };
    UI.prototype.load_squares = function () {

        // cipher this object
        var ui = this;

        // create an array of game board elements
        var board = Util.copy(document.getElementsByClassName('game-square'));

        // iterate over game board elements
        board.forEach(function (square, index) {

            // set listener for on click event
            square.addEventListener('click', function (e) {

                // check that square is vacant
                if (this.innerHTML === '') {
                    // if the panel is locked the game is running : place marker
                    if (ui.locked) { ui.game.place_marker(index); }

                    // create varibale for outcome of gameover check
                    var win;
                    if (ui.game.status === 'running') { win = ui.game.gameover(ui.game.board); }

                    // evaluate game board for win
                    if (win !== false) {
                        // a player has won the game or game is tie
                        if (win === 0) // game is a tie
                        {
                            ui.display_message('Tie Game!!!');
                            setTimeout(function () { ui.reset_game(); }, 3000);
                        }
                        else if (win > 0) {
                            ui.display_message('Computer Wins!!!');
                            setTimeout(function () { ui.reset_game(); }, 3000);
                        }
                        else if (win < 0) {
                            ui.display_message('You Win!!!');
                            setTimeout(function () { ui.reset_game(); }, 3000);
                        }
                    }
                    else {
                        // if no win value yet AI makes move
                        ui.game.make_move();

                        // re evaluate board for gameover variable
                        win = ui.game.gameover();

                        // evaluate game board for win
                        if (win !== false) {
                            // a player has won the game or game is tie
                            if (win === 0) // game is a tie
                            {
                                ui.display_message('Tie Game!!!');
                                setTimeout(function () { ui.reset_game(); }, 3000);
                                setTimeout(function () { ui.reset_game(); }, 6000);
                            }
                            else if (win > 0) {
                                ui.display_message('Computer Wins!!!');
                                setTimeout(function () { ui.reset_game(); }, 3000);
                            }
                            else if (win < 0) {
                                ui.display_message('You Win!!!');
                                setTimeout(function () { ui.reset_game(); }, 3000);
                            }
                        }
                    }
                }
            });
        });
    };
    UI.prototype.init = function () {

        // configure panel buttons
        this.load_buttons();

        // configure gameboard squares
        this.load_squares();

        // set Util.UI to this object
        Util.UI = this;
    };

    // exposure
    return new UI();

})();

T3.init(); // Initialize Game
