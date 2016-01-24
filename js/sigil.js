$(function(){

    var startHandSize = 2,
        maxHandSize = 10;

    var cards_to_play = 1.
        damagingA = 0,
        damagingE = 0,
        damagingS = 0,
        destroyingA = 0,
        destroyingE = 0,
        destroyingS = 0,
        discarding = 0,
        shielding = 0,
        deshielding = 0,
        freezing = 0,
        thawing = 0,
        blocking = 0;

    var global_board;

    function update_variable_display(){
        //Update variables
        $('#cards_to_play').text(cards_to_play);
        $('#damagingA').text(damagingA);
        $('#damagingE').text(damagingE);
        $('#damagingS').text(damagingS);
        $('#destroyingA').text(destroyingA);
        $('#destroyingE').text(destroyingE);
        $('#destroyingS').text(destroyingS);
        $('#discarding').text(discarding);
        $('#shielding').text(shielding);
        $('#deshielding').text(deshielding);
        $('#freezing').text(freezing);
        $('#thawing').text(thawing);
        $('#blocking').text(blocking);
    }

    function update_grid_display(){
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                $('#grid_box_' + i + '_' + j).text(global_board.results[i][j]);
            }
        }
    }

    // Array shuffle function
    function shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    // Card object definition
    function Card() {
        this.cardName = '';
        this.cardEffects = [];
        this.cardImage = '';
        this.cardBody = '';

        //Activates card's effects
        this.playCard = function(targetCard, playerNo, board){
            window.console.log($(this));

            if (cards_to_play > 0) {
                // Hide card - should probably delete it here too for card draw reasons
                $(this.cardBody).fadeOut(300); // this is not gonna show unless a time delay is applied on the next part

                // Regex expression definitions
                var deal = new RegExp("^deal$", "i"),       // ^x$ dictates explicit regex matching
                    destroy = new RegExp("^destroy$|^remove$", "i"),
                    draw = new RegExp("^draw$", "i"),
                    one = new RegExp("^a$|^1$", "i"),
                    every = new RegExp("^all$|^every$", "i"),
                    endTurn = new RegExp("^end$", "i"),
                    targetSelf = new RegExp("^your$", "i"),
                    targetEnemy = new RegExp("^enemy$", "i"),
                    freeze = new RegExp("^freeze$", "i"),
                    thaw = new RegExp("^thaw$", "i"),
                    shield = new RegExp("^shield$|^shields$", "i"),
                    block = new RegExp("^block$", "i");
                    //= new RegExp("", "i"),

               /* function setupPlay() { //..... Why is this here?
                    window.console.log("Restoring piece placements");
                    $('.box.flipper:not(.opened)').click(function(){
                        var rows = this.getAttribute('x');
                        var cols = this.getAttribute('y');
                        board.playGame(rows,cols);
                    });
                }*/

                for (var i = 0; i < this.cardEffects.length; i++){
                    window.console.log(this.cardName + ' -> ' + this.cardEffects[i]);
                    var effect = this.cardEffects[i].split(' ');
                    window.console.log(effect);

                    if (effect[0] && effect[0].match(endTurn)) { // End turn
                        window.console.log("End turn");
                        global_board.endTurn();
                    } else if (effect[0] && effect[0].match(deal)) { // Dealing damage
                        if (effect[1] && effect[1].match(one)){ // Damage one
                            if (effect[4] && effect[4].match(targetSelf)){
                                window.console.log("Target self");
                                damagingS = 1;
                            } else if (effect[4] && effect[4].match(targetEnemy)){
                                window.console.log("Target enemy");
                                damagingE = 1;
                            } else {
                                damagingA = 1;
                            }
                        } else if (effect[1] && effect[1].match(every)) { // Damage all
                            // damage everything
                        } else { // else damage many
                            if (effect[4] && effect[4].match(targetSelf)) {
                                window.console.log("Target self");
                                damagingS = effect[1];
                            } else if (effect[4] && effect[4].match(targetEnemy)){
                                window.console.log("Target enemy");
                                damagingE = effect[1];
                            } else {
                                damagingA = effect[1];
                            }
                        }
                    } else if (effect[0] && effect[0].match(destroy)) { // Destroying piece or shield
                        if (effect[2] && effect[2].match(shield)){ //if shield
                            if (effect[1] && effect[1].match(one)){
                                window.console.log("deshield 1");
                                deshielding = 1;
                            } else if (effect[1] && effect[1].match(every)) { // Deshield all
                                window.console.log("Unshielding all!");
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        if (board.results[i][j] === 0) {
                                            board.shield[i][j] = 0;
                                        }
                                    }
                                }
                            } else { //else deshield many
                                window.console.log("deshield lots");
                                deshielding = effect[1];
                            }
                        } else { //
                            if (effect[1] && effect[1].match(one)){
                                if (effect[4] && effect[4].match(targetSelf)) {
                                    window.console.log("Target self");
                                }  else if (effect[4] && effect[4].match(targetEnemy)){
                                    window.console.log("Target enemy");
                                    damagingE = 1;
                                } else {
                                    window.console.log("Destroying one piece");
                                    destroyingA = 1;
                                }
                            } else if (effect[1] && effect[1].match(every)) { // Destroy all
                                window.console.log('Destroy all pieces');
                                var pieces = $('.box.flipper');

                                $(pieces).removeClass('flip');
                                $(pieces).removeClass('opened');
                                $(pieces).removeClass('opened-p1');
                                $(pieces).removeClass('opened-p2');

                                for (var i = 0; i < 4; i++){ 
                                    for (var j = 0; j < 4; j++){
                                        board.results[i][j] = 0;
                                    }
                                }

                            } else { //else many
                                if (effect[4] && effect[4].match(targetSelf)) {
                                    window.console.log("Target self");
                                    destroyingS = effect[1];
                                } else if (effect[4] && effect[4].match(targetEnemy)){
                                    window.console.log("Target enemy");
                                    destroyingE = effect[1];
                                } else {
                                    destroyingA = effect[1];
                                }
                            }
                        }
                    } else if (effect[0] && effect[0].match(draw)){ // Drawing cards
                        if (effect[1] && effect[1].match(one)){ // Resolves 'a'
                            if (eval('player' + playerNo).hand.length < maxHandSize){
                                eval('player' + playerNo).drawCard();
                            }
                        } else { //else many
                            for (var i = 0; i < effect[1]; i++) {
                                if (eval('player' + playerNo).hand.length < maxHandSize){
                                    eval('player' + playerNo).drawCard();
                                }
                            }
                        }
                    } else if (effect[0] && effect[0].match(freeze)){ // Freeze
                        window.console.log(effect[1]);
                        window.console.log(effect[1].match(one));

                        if (effect[1] && effect[1].match(one)){ // Resolves 'a'
                            window.console.log("Doing a single frost... spoopy!");
                            freezing = 1;
                        } else if (effect[1] && effect[1].match(every)){ // Resolves 'all'
                            window.console.log("Freezing all!");
                            for (var i = 0; i < 4; i++) {
                                for (var j = 0; j < 4; j++) {
                                    if (board.results[i][j] === 0) {
                                        board.frost[i][j] = 2;
                                        $('.box.flipper').addClass('frost2');
                                    }
                                }
                            }
                        } else { //else many
                            freezing = effect[1];
                        }
                    } else if (effect[0] && effect[0].match(thaw)){ // Thaw
                        if (effect[1] && effect[1].match(one)){ // Resolves 'a'
                            window.console.log("Doing a shield");
                            thawing = 1;
                        } else if (effect[1] && effect[1].match(every)){ // Resolves 'all'
                            window.console.log("Freezing all!");
                            for (var i = 0; i < 4; i++) {
                                for (var j = 0; j < 4; j++) {
                                    if (board.results[i][j] === 0) {
                                        board.frost[i][j] = 0;
                                    }
                                }
                            }
                        } else { //else many
                            thawing = effect[1];
                        }
                    } else if (effect[0] && effect[0].match(shield)){ // Thaw
                        if (effect[1] && effect[1].match(one)){ // Resolves 'a'
                            window.console.log("Doing a shield");
                            shielding = 1;
                        } else if (effect[1] && effect[1].match(every)){ // Resolves 'all'
                            window.console.log("Freezing all!");
                            for (var i = 0; i < 4; i++) {
                                for (var j = 0; j < 4; j++) {
                                    if (board.results[i][j] === 0) {
                                        board.shields[i][j] = 1;
                                    }
                                }
                            }
                        } else { //else many
                            shielding = effect[1];
                        }
                    } else if (effect[0] && effect[0].match(discarding)){

                    } else {
                        //do nothing
                    } 

                    cards_to_play -= 1;
                    update_variable_display();
                    update_grid_display();
                }

                window.console.log("DaE: " + damagingE + ", DaS: " + damagingS + ", DeE: " + destroyingE + ", DeS: " + destroyingS + ", Sh: " + shielding + ", Fr: " + freezing+ ", Bl: " + blocking);

                this.cardBody.remove();
                delete this;
            } else {
                window.alert("No more cards can be played this turn");
            }
        };

        this.createCard = function(playerNo){
            this.cardBody = jQuery('<div/>', {
                class: 'card drawn ' + this.cardName.toLowerCase().split(' ').join('_')
            });

            jQuery('<div/>', {
                class: 'cardName',
                text: this.cardName
            }).appendTo(this.cardBody);

            jQuery('<div/>', {
                class: 'cardEffects',
                text: this.cardEffects.join([separator = '. ']) + '.'
            }).appendTo(this.cardBody);

            var targetCard = this; //closure
            $(this.cardBody[0]).click(function(){
                targetCard.playCard(targetCard, playerNo, b);
            });
            
            $('.p' + playerNo + '-hand:first').append(this.cardBody);
        };
    }

    function Piece() {
        this.row = -1,
        this.col = -1,
        this.shielded = false; //remove?
    }

    function Player(number) {
        this.playerNo = number,
        this.deck = [],
        this.hand = [],
        this.active = [],
        this.discard = [],
        this.pieces = [];

        /*this.createDeck= function(player){
            $.getJSON( "js/deck_p" + player + ".json", function( data ) {
                var items = [];
                $.each( data, function( key, val ) {
                items.push( "<li id='" + key + "'>" + val + "</li>" );
                });

                $( "<ul/>", {
                "class": "card ",
                html: items.join( "" )
                }).appendTo( "body" );
            });
            this.deck = items;
        };*/

        this.createDeck = function(){
            // Replace the eval statement?
            var tempDeck = JSON.parse(eval("deck_p" + this.playerNo));

            //Create cards
            for (var i = 0; i < tempDeck.length; i++){
                var newCard = new Card();
                newCard.cardName = tempDeck[i];
                
                // Find card description
                for (var j = 0; j < cards.length; j++){
                    if (cards[j].name === newCard.cardName){
                        newCard.cardEffects = cards[j].effects;
                    }
                }

                this.deck.push(newCard);
            }

            this.deck = shuffle(this.deck);
        };

        this.drawCard = function(){
            if (this.deck.length > 0 && this.hand.length < maxHandSize) {
                this.deck[0].createCard(this.playerNo);
                this.hand.push(this.deck[0]);
                this.deck.splice(0,1);

                $('.hand').append();
            }

        };
    }

    function Board() {
        this.results = [];
        this.frost = [];
        this.rock = [];
        this.shields = [];
        this.currentPlayer = 0;

        // Create board
        this.initiateBoard = function(){
            for (var i = 0; i < 4; i++){
                this.results[i] = [];
                this.frost[i] = [];
                this.rock[i] = [];
                this.shields[i] = [];

                for (var j = 0; j < 4; j++){
                    var id = i * 4 + j + 1;

                    this.results[i][j] = 0;
                    this.frost[i][j] = 0;
                    this.rock[i][j] = 0;
                    this.shields[i][j] = 0;
                }
            }

            this.currentPlayer = 1;
        };

        // Changes current turn
        this.endTurn = function(){
            if (this.currentPlayer === 1) {
                this.currentPlayer = -1;
                $('.wrapper').removeClass('p1-turn');
                $('.wrapper').addClass('p2-turn');

                //hide hands
                for (var i = 0; i < player1.hand.length; i++) {
                    player1.hand[i].cardBody.addClass('hidden');
                }
                for (var i = 0; i < player2.hand.length; i++) {
                    player2.hand[i].cardBody.removeClass('hidden');
                }

                player2.drawCard();

            } else {
                this.currentPlayer = 1;
                $('.wrapper').removeClass('p2-turn');
                $('.wrapper').addClass('p1-turn');

                for (var i = 0; i < player2.hand.length; i++) {
                    player2.hand[i].cardBody.addClass('hidden');
                }
                for (var i = 0; i < player1.hand.length; i++) {
                    player1.hand[i].cardBody.removeClass('hidden');
                }

                player1.drawCard();
            
            }

            // Remove fronts
            for (var i = 0; i < 4; i++){
                for (var j = 0; j < 4; j++){
                    if (this.frost[i][j] === 1) {
                        this.frost[i][j] = 0;
                        target = $('div[x="' + i + '"][y="' + j + '"]:first');
                        target.removeClass('frost1');
                    }
                    //this.frost[i][j] = (this.frost[i][j] > 0) ? this.frost[i][j] - 1: 0;
                    if (this.frost[i][j] === 2) {
                        this.frost[i][j] = 1;
                        target = $('div[x="' + i + '"][y="' + j + '"]:first');
                        target.removeClass('frost2');
                        target.addClass('frost1');
                    }

                    //this.rock[i][j] = (this.rock[i][j] > 0) ? this.rock[i][j] - 1: 0;
                }
            }

            cards_to_play = 1,
            damagingA = 0,
            damagingE = 0,
            damagingS = 0,
            destroyingA = 0,
            destroyingE = 0,
            destroyingS = 0,
            discarding = 0,
            shielding = 0,
            deshielding = 0,
            freezing = 0,
            thawing = 0,
            blocking = 0;

            update_variable_display();
        };

        // Handle cell click
        this.updateCell = function(row,col){
            window.console.log('Clicked on ' + this + '/' + $(this));

            if (this.results[row][col] !== 0 || this.frost[row][col] >= 1 || this.rock[row][col] >= 1){
                window.console.log("The cell is occupied!");
                if (this.results[row][col] !== 0) { // Piece
                    if (destroyingA > 0) { //Destroying enemy
                        window.console.log('Destroying any piece');
                        this.results[row][col] = 0;
                        window.console.log(this.results);
                        

                        target = $('div[x="' + row + '"][y="' + col + '"]:first');
                        $(target).removeClass('flip');
                        $(target).removeClass('opened');
                        $(target).removeClass('opened-p1');
                        $(target).removeClass('opened-p2');

                        destroyingA -= 1;
                    } if (destroyingE > 0) { //Destroying enemy
                        if (this.results[row][col] !== this.currentPlayer) {
                            window.console.log('Destroying an enemy');
                            this.results[row][col] = 0;
                            window.console.log(this.results);
                            
                            target = $('div[x="' + row + '"][y="' + col + '"]:first');
                            $(target).removeClass('flip');
                            $(target).removeClass('opened');
                            $(target).removeClass('opened-p1');
                            $(target).removeClass('opened-p2');

                            destroyingE -= 1;
                        }
                    } else if (destroyingS > 0) { //Destroying
                        if (this.results[row][col] === this.currentPlayer) {
                            window.console.log('Destroying own piece');
                            this.results[row][col] = 0;
                            window.console.log(this.results);
                            
                            target = $('div[x="' + row + '"][y="' + col + '"]:first');
                            $(target).removeClass('flip');
                            $(target).removeClass('opened');
                            $(target).removeClass('opened-p1');
                            $(target).removeClass('opened-p2');

                            destroyingS -= 1;
                        }
                    } else if (damagingA > 0) {
                        window.console.log('Damaging any');
                        this.results[row][col] = 0;
                        window.console.log(this.results);
                        
                        target = $('div[x="' + row + '"][y="' + col + '"]:first');
                        $(target).removeClass('flip');
                        $(target).removeClass('opened');
                        $(target).removeClass('opened-p1');
                        $(target).removeClass('opened-p2');

                        damagingA -= 1;
                    } else if (damagingE > 0) {
                        if (this.results[row][col] !== this.currentPlayer) {
                            window.console.log('Damaging enemy');
                            this.results[row][col] = 0;
                            window.console.log(this.results);
                            
                            target = $('div[x="' + row + '"][y="' + col + '"]:first');
                            $(target).removeClass('flip');
                            $(target).removeClass('opened');
                            $(target).removeClass('opened-p1');
                            $(target).removeClass('opened-p2');
    
                            damagingE -= 1;
                        }
                    } else if (damagingS > 0) { //Damaging
                        if (this.results[row][col] === this.currentPlayer) {
                            window.console.log('Damaging own piece');
                            this.results[row][col] = 0;
                            window.console.log(this.results);
                            
                            target = $('div[x="' + row + '"][y="' + col + '"]:first');
                            $(target).removeClass('flip');
                            $(target).removeClass('opened');
                            $(target).removeClass('opened-p1');
                            $(target).removeClass('opened-p2');

                            damagingS -= 1;
                        }
                    } else if (shielding > 0) {
                        shielding -= 1;
                    } else if (deshielding > 0) {
                        deshielding -= 1;
                    }
                } else if (this.frost[row][col] >= 1 && thawing > 0) {
                    window.console.log ("Thawing out a square");
                    target = $('div[x="' + row + '"][y="' + col + '"]:first');
                    $(target).removeClass('frost1');
                    $(target).removeClass('frost2');

                } else if (this.rock[row][col] >= 1 && deblocking > 0) {

                }
            } else { // Cell is empty
                if (freezing > 0) {
                    this.frost[row][col] = 2;
                    target = $('div[x="' + row + '"][y="' + col + '"]:first');
                    target.addClass('frost2'); //does all

                    freezing -= 1;
                } else if (blocking > 0) {
                    board.rock[row][col] = 3;
                    target = $('div[x="' + row + '"][y="' + col + '"]:first');
                    target.addClass('frost2');

                    blocking -= 1;
                } else { //place piece
                    var piece = new Piece();
                    piece.row = row;
                    piece.col = col;
                    piece.square = $("div").find("[x="+row+"]"+"[y="+col+"]");

                    this.results[row][col] = this.currentPlayer;
                    piece.square.addClass("opened flip");
                    //$(piece.square).unbind();
                    
                    if (this.currentPlayer === 1){
                        piece.square.addClass("opened-p1");
                        $(player1.pieces).append(piece);
                    } else {
                        piece.square.addClass("opened-p2");
                        $(player2.pieces).append(piece);
                    }

                    this.endTurn();
                }
            }

            update_variable_display();
            update_grid_display();
        };

        // Return correct piece markerclass
        this.drawMark = function(player){
            return player === 1 ? 'X' : 'O';
        };

        // Turn execution function
        this.playGame = function(row,col){
            window.console.log('playing');
            if (this.determineWinner() === undefined){
                this.updateCell(row, col);
            }

            this.gameOver();
        };

        // Checks for game over
        this.gameOver = function(){
            var that = this;
            if (this.determineWinner() !== undefined){
                setTimeout(function(){ 
                    window.alert("The winner is " + that.drawMark(that.determineWinner())); 
                }, 100);
            }
        };

        //Calls all win condition checks
        this.determineWinner = function(){
            if (this.checkRows() !== undefined){
                return this.checkRows();
            }
            if (this.checkCols() !== undefined){
                return this.checkCols();
            }
            if (this.checkDiagonals() !== undefined){
                return this.checkDiagonals();
            }
        };

        this.checkRows = function(){
            for (var i = 0; i < 4; i++){
                var sum = this.results[i][0] + this.results[i][1] + this.results[i][2] + this.results[i][3];
                if (sum === 4 || sum === -4){
                    return this.results[i][0];
                }
            }
        };

        this.checkCols = function(){
            for (var i = 0; i < 4; i++){
                var sum = this.results[0][i] + this.results[1][i] + this.results[2][i] + this.results[3][i];
                if (sum === 4 || sum === -4){
                    return this.results[0][i];
                }
            }
        };

        this.checkDiagonals = function(){
            // Right-wards diagonal
            var sum = this.results[0][0] + this.results[1][1] + this.results[2][2] + this.results[3][3];
            if (sum === 4 || sum === -4){
                return this.results[1][1];
            }
            // Left-wards diagonal
            sum = this.results[0][3] + this.results[1][2] + this.results[2][1] + this.results[3][0];
            if (sum === 4 || sum === -4){
                return this.results[1][1];
            }
        };
    }

    var b = new Board();
    b.initiateBoard();
    global_board = b;

    var player1 = new Player(1);
    var player2 = new Player(2);
    player1.createDeck();
    player2.createDeck();

    update_variable_display();
    update_grid_display();

    for (var i = 0; i < startHandSize; i++) {
        player1.drawCard();
    }
    for (var i = 0; i < startHandSize; i++) {
        player2.drawCard();
    }

    for (var i = 0; i < player2.hand.length; i++) {
        player2.hand[i].cardBody.addClass('hidden');
    }

    //$(".p1-hand").sortable();
    //$(".p2-hand").sortable();

    $('.box').click(function(){
        var rows = this.getAttribute('x');
        var cols = this.getAttribute('y');
        b.playGame(rows,cols);
    });

    // for (var i = 0; i <  player1.hand.length; i++) {
    //     //Give cards clickable function
    //     (function (iCopy) { //remove function creation from loop?
    //         var card = player1.hand[iCopy];
    //         $(card.cardBody[0]).click(function(){
    //             window.console.log(card);
    //             card.playCard(b.currentPlayer, b);
    //         });
    //     }(i));
    // }

    $('#submitButton').click(function(){
        location.reload();
    });

    $('#endTurnButton').click(function(){
        b.endTurn();
    });

});
