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

        var tiles = $('.box.flipper');
        for (var i = 0; i < 4; i++){
            for (var j = 0; j < 4; j++){
                if (tiles.x === i && tiles.y === j) {
                    tiles.removeClass('frost');
                }

                this.frost[i][j] = (this.frost[i][j] > 0) ? this.frost[i][j] - 1: 0;
                this.rock[i][j] = (this.rock[i][j] > 0) ? this.rock[i][j] - 1: 0;
            }
        }
    };

    // Handle cell click
    this.updateCell = function(row,col){
        if (this.results[row][col] !== 0 || this.frost[row][col] >= 1 || this.rock[row][col] >= 1){
            window.alert("The cell is occupied!");
        } else {

            var piece = new Piece();
            piece.row = row;
            piece.col = col;
            piece.square = $("div").find("[x="+row+"]"+"[y="+col+"]");

            this.results[row][col] = this.currentPlayer;
            piece.square.addClass("opened flip");
            $(piece.square).unbind();
            
            if (this.currentPlayer === 1){
                piece.square.addClass("opened-p1");
                $(player1.pieces).append(piece);
            } else {
                piece.square.addClass("opened-p2");
                $(player2.pieces).append(piece);
                window.console.log(player2.pieces);
            }

            this.endTurn();
        }
    };

    // Return correct piece markerclass
    this.drawMark = function(player){
        return player === 1 ? 'X' : 'O';
    };

    // Turn execution function
    this.playGame = function(row,col){
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

