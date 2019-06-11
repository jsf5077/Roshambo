//////////////////////////////  Start Global Elements  //////////////////////////////
// My web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAyFOsHWx5X57F6qslGTSi1dzJz8tKrres",
    authDomain: "rock-paper-scissors-c8ebe.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-c8ebe.firebaseio.com",
    projectId: "rock-paper-scissors-c8ebe",
    storageBucket: "rock-paper-scissors-c8ebe.appspot.com",
    messagingSenderId: "830919806790",
    appId: "1:830919806790:web:5866e7d2a9f1c9a2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variables for the database.
var db = firebase.database();
//create player references for the database
var playersData = db.ref("/players/");
//create chat refences for the database
var chatData = db.ref("/chat");
// connectionsRef references a specific location in our database.
var connectionsRef = db.ref("/connections");

var playersData = db.ref("/choices");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = db.ref(".info/connected");


//variables to initiate players of the game
var playerOne = null;
var playerTwo = null;
var visitor = null;
var name = "";
var message = "";

var playerOneName = "";
var playerTwoName = "";

var playerNum = "";


$("#visitLogIn").hide();
$("#RPS").hide();

//////////////////////////////  End Global Elements  //////////////////////////////

//////////////////////////////  Start Chat Function  //////////////////////////////

$("#submit").on("click", function(event) {
    event.preventDefault();

    // Puts out an alert if name is blank
    if ($("#sign-name-input").val()=="") {
        alert("Enter a Valid Name");
            return false;
    } else {
        // if name isn't blank, we assign the value to the name variable
        name = $("#sign-name-input").val().trim();
    }
    // Puts out an alert if message is blank
    if ($("#message-input").val()=="") {
        alert("Enter a Valid Message");
            return false;
    } else {
        // if message isn't blank, we assign the value to the message variable
        message = $("#message-input").val().trim();
    }
    var date = moment().format("DD/MM/YY hh:mm A");

    //locally log data for the specific chat message
    var chatMsg = {
        name: name,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
        date: date
    };
        
    // Code for handling the push
    chatData.push(chatMsg)
    //clears message input box 
    $("#message-input").val("");            
});

    // Firebase watcher .on("child_added"
chatData.on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // full list of items to the message div
    $("#messages").append(
        "<div class='container'><span class='user-name'> " + sv.name +
        ": </span><span class='user-message'> " + sv.message +
        " <span class='time-right'> " + sv.date +
        " </span></div>"
    );
    // Handle the errors
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

//////////////////////////////  End Chat Function  //////////////////////////////

//////////////////////////////  Start Login Function  //////////////////////////////


db.ref("/players/").on("value", function(snapshot) {
    var sv = snapshot.val();
	// Check for existence of player 1 in the database
	if (snapshot.child("playerOne").exists()) {
        console.log("Ready Player One");

		// Record player One data
		playerOne = sv.playerOne;
		playerOneName = playerOne.name;

		// Update player One name
        $("#p1Name").text(playerOneName);
        
	} else {
        playerOne = null;
		playerOneName = "";
    }
    if (snapshot.child("playerTwo").exists()) {
		console.log("Ready Player Two");

		// Record player Two data
		playerTwo = sv.playerTwo;
		playerTwoName = playerTwo.name;

		// Update player Two name
        $("#p2Name").text(playerTwoName);
        
	} else {
        playerTwo = null;
		playerTwoName = "";
    }

    if (playerOne && playerTwo) {
        $("#visitor").text("Player One and Player Two are ready...");
        console.log(" player one and two logged in")
    }

    if (!playerOne && !playerTwo) {
        console.log("there are no players")
    }
    //handles the database information for players when user disconnects
    //playerNum is a local variable that is used to confirm which player the user is
    if (playerNum == 1) {
        //so if playerNum is 1 and they disconnect, the PlayerOne database is cleared for the next person
        db.ref("/players/playerOne").onDisconnect().remove();
        // otherwise if they are player two, the playerTwo database is cleared instead
    } else if (playerNum == 2) {
        db.ref("/players/playerTwo").onDisconnect().remove();
    } else {
        //and if the user signing off was never assigned a number because they were a visitor, then we return nothing.
        return;
    }
});
//     if ((snapshot.child("playerOne").exists()) && snapshot.child("playerTwo").exists()) {
//         $("#logIn").hide();
//         $("#visitLogIn").show();
//         if (playerNum == 1 || playerNum == 2) {
//             $("#visitLogIn").hide();
//         }
        
//     } else {
//         if (snapshot.child("playerOne").exists()) {
//             $("#p2Name").text('');
//         } else if (snapshot.child("playerTwo").exists()) {
//             $("#p1Name").text('');
//         }
//         $("#visitor").text('');
//     }
//     playerOneChoice = snapshot.child("playerOne/choice").val();
//     console.log(playerOneChoice);
//     playerTwoChoice = snapshot.child("playerTwo/choice").val(); 
//     console.log(playerTwoChoice);
//     if (playerNum == 1) {
//         if (!playerOneChoice) {
//         $("#choices").text("Please make a selection");
//         } else if (!playerTwoChoice) {
//             $("#RPS").hide();
//             $("#logIn").hide();
//             $("#choices").text("Waiting on Player Two");
//         } else {
//             $("#choices").text("Selections Made");
            
//         }
//     }
//     if (playerNum == 2) {
//         if (!playerTwoChoice) {
//         $("#choices").text("Please make a selection");
//         } else if (!playerOneChoice) {
//             $("#RPS").hide();
//             $("#logIn").hide();
//             $("#choices").text("Waiting on Player One");
//         } else {
//             $("#choices").text("Selections Made");
            
//         }
//     }

//// log in function////////

$("#logInSubmit").on("click", function(event) {
    event.preventDefault();
    //checks to make sure the name field isn't blank
    if ($("#sign-name-input").val()=="") {
        alert("Enter a Valid Name");
            return false;
    // if user entered data in the name field...
    } else {
        var signName = $("#sign-name-input").val().trim(); 
        //hide the login part with the name written in. 
        $("#name-input").text(signName);
        
        if (!playerOne) {
            name = $("#name-input").val().trim();
            playerNum = 1;
            console.log("playerNum = 1");
            $("#RPS").show();
            playerOne = {
                name: name,
                wins: 0,
                losses: 0,
                ties: 0,
                choice: '' 
            }

            db.ref().child("/players/playerOne").set(playerOne);
            console.log("Player One Stats on DB");

        } else if (!playerTwo) {
            name = $("#name-input").val().trim()
            playerNum = 2;
            console.log("playerNum = 2");
            $("#RPS").show();
            playerTwo = {
                name: name,
                wins: 0,
                losses: 0,
                ties: 0,
                choice: '' 
            }

            db.ref().child("/players/playerTwo").set(playerTwo);
            console.log("Player Two Stats on DB");

        } else {
            //not quite sure how to handle this yet
            visitor = true;
            db.ref().child("/players/visitor").set(visitor);
            console.log("assigned visitor");
            
        }
        

    }
$("#logIn").hide();
});

//For visitors
$("#visitorSubmit").on("click", function(event) {
    event.preventDefault();
    var name = $("#visit-name-input").val().trim();
    $("#name-input").text(name);
    $("#sign-name-input").val(name);
    $("#visitLogIn").hide();
});

// When the client's connection state changes...
connectedRef.on("value", function(snapshot) {

    // If they are connected..
    if (snapshot.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    } 
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snapshot) {

// Display the viewer count in the html.
// The number of online users is the number of children in the connections list.
$("#watchers").text(snapshot.numChildren());
});

//////////////////////////////  End Login Function  //////////////////////////////

//////////////////////////////  Start Game Function  //////////////////////////////
$("#rock").on("click", function(event){
    event.preventDefault();
    if (playerNum == 1) {
        playerOne.choice = $("#rock").text();
        console.log(playerOne.choice);
        db.ref().child("/players/playerOne/choice").set(playerOne.choice);
    } else if (playerNum == 2) {
        playerTwo.choice = $("#rock").text();
        console.log(playerTwo.choice);
        db.ref().child("/players/playerTwo/choice").set(playerTwo.choice);
    }
    // $("#RPS").hide();
    checkWinner()
});
$("#paper").on("click", function(event){
    event.preventDefault();
    if (playerNum == 1) {
        playerOne.choice = $("#paper").text();
        console.log(playerOne.choice);
        db.ref().child("/players/playerOne/choice").set(playerOne.choice);
    } else if (playerNum == 2) {
        playerTwo.choice = $("#paper").text();
        console.log(playerTwo.choice);
        db.ref().child("/players/playerTwo/choice").set(playerTwo.choice);
    }
    // $("#RPS").hide();
    checkWinner()
});
$("#scissors").on("click", function(event){
    event.preventDefault();
    if (playerNum == 1) {
        playerOne.choice = $("#scissors").text();
        console.log(playerOne.choice);
        db.ref().child("/players/playerOne/choice").set(playerOne.choice);
    } else if (playerNum == 2) {
        playerTwo.choice = $("#scissors").text();
        console.log(playerTwo.choice);
        db.ref().child("/players/playerTwo/choice").set(playerTwo.choice);
    }
    // $("#RPS").hide();
    checkWinner()
});

///////////working space below with potential errors///////////////////

function checkWinner() {
    var playerOneChoice = playerOne.choice;
    var playerTwoChoice = playerTwo.choice;
    if ((playerOneChoice =='') || (playerTwoChoice == ''))  {
        // var p1Tie = snapshot.child("playerOne/ties").val();
        //     p1Tie++; 
        //     var p2Tie = snapshot.child("playerTwo/ties").val();
        //     p2Tie++;
        //     db.ref().child("/players/playerOne/ties").set( p1Tie);
        //     db.ref().child("/players/playerTwo/ties").set( p2Tie);
        // reset();
        console.log("still waiting on a player choice");
    } 
    else {
        console.log("players made choices")
        var p1Tie = playerOne.ties;
        var p2Tie = playerTwo.ties;
        var p1Win = playerOne.wins;
        var p2Win = playerTwo.wins;
        var p1Loss = playerOne.losses;
        var p2Loss = playerTwo.losses;
        if (playerOneChoice === playerTwoChoice) {
            console.log("players tied")
            p1Tie++; 
            p2Tie++;
            db.ref().child("/players/playerOne/ties").set( p1Tie);
            db.ref().child("/players/playerTwo/ties").set( p2Tie);
        } else if ((playerOneChoice == "Rock" && playerTwoChoice == "Scissors")||(playerOneChoice == "Paper" && playerTwoChoice == "Rock")||(playerOneChoice == "Scissors" && playerTwoChoice == "Paper")){
            p1Win++; 
            p2Loss++;
            db.ref().child("/players/playerOne/wins").set( p1Win);
            db.ref().child("/players/playerTwo/losses").set( p2Loss); 
        } else if ((playerOneChoice == "Rock" && playerTwoChoice == "Paper")||(playerOneChoice == "Paper" && playerTwoChoice == "Scissors")||(playerOneChoice == "Scissors" && playerTwoChoice == "Rock")){
            p1Loss++; 
            p2Win++;
            db.ref().child("/players/playerOne/losses").set( p1Loss);
            db.ref().child("/players/playerTwo/wins").set( p2Win); 
        }
        reset(); 
    }
    
};


function reset() {
    db.ref().child("/players/playerOne/choice").set('');
    db.ref().child("/players/playerTwo/choice").set('');
    // $("#RPS").show();
};
//////////////////////////////  End Game Function  //////////////////////////////


// user enters name   
//       assign to player one  
//         if player one exists, assign player two
//             if play one and two exist, become spectator 

// user picks rock/paper/scissors
//       record answer to database
//       check is other user has answers
//         if not yet
//             update html to say waiting on other user
//         if other user has answered
//             run a function that checks winner
//                 if user 1 choice === user 2 choice
//                     user 1 tie++;
//                     user 2 tie++;  
//                 else if user 1 chose rock and user 2 chose paper
//                     user 1 loss++
//                     user 2 win++
//                 else if user 1 chose rock and user 2 chose scissors
//                     user  1 win++
//                     user 2 loss++
//                 else if user 1 chose scissors and user 2 chose paper
//                     user  1 win++
//                     user 2 loss++
//                 else if user 1 chose scissors and user 2 chose rock
//                     user  1 loss++
//                     user 2 win++
//                 else if user 1 chose paper and user 2 chose rock
//                     user  1 win++
//                     user 2 loss++
//                 else if user 1 chose paper and user 2 chose scissors
//                     user  1 loss++
//                     user 2 win++
//         update html to reflect winner/loser win/loss 

//         update database to reflect winner/loser win/loss 

//         reset html winner/loser and user 1 & 2 choices

//         reset database winner/loser and user 1 & 2 choices

//         if user disconnects 




//       Create a game that suits this user story:

//   * Only two users can play at the same time.

//   * Both players pick either `rock`, `paper` or `scissors`. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.

//   * The game will track each player's wins and losses.

//   * Throw some chat functionality in there! No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.

//   * Styling and theme are completely up to you. Get Creative!

//   * Deploy your assignment to Github Pages.

