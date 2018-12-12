// Define the global variables

let charChosen = "";
let defenderChosen = "";
let charChosenStatus = false;
let defenderChosenStatus = false;
let firstAttack = true;
let nextAttack = false;
let charList = [
    "obi",
    "luke",
    "sid",
    "maul"
];

let yourAttack = 0;
let yourAttackInc = 0;
let yourHP = 0;
let enemyHP = 0;
let enemyCount = 3;
let enemiesList = [];

function Character (name, hp, attack, counterAttack) {
    this.name = name;
    this.hp = hp;
    this.attack = attack;
    this.counterAttack = counterAttack;
}

// Health points, base attack power, and counter attack power
let obi = new Character("Obi-Wan Kenobi", 132, 12, 9);
let luke = new Character("Luke Skywalker", 120, 22, 6);
let sid = new Character("Darth Sidious", 150, 7, 20);
let maul = new Character("Darth Maul", 170, 5, 23);


function setIndividual (character, container) {
    $("#" + character).appendTo(container);
}

function restartGame() {
    charChosen = "";
    defenderChosen = "";
    charChosenStatus = false;
    defenderChosenStatus = false;
    firstAttack = true;
    nextAttack = false;
    enemyCount = 3;

    $("#obi-hp").html(obi.hp);
    $("#luke-hp").html(luke.hp);
    $("#sid-hp").html(sid.hp);
    $("#maul-hp").html(maul.hp);

    charList.forEach(function(character) {
        setIndividual(character,".characters");
        $("#" + character).css({"background": "#ffffff","border": "solid 2px #44aa44","color": "#000000","visibility":"visible"});
    });
    $(".battle-status").empty();
    $("#restart").css("visibility","hidden");
}

$(document).ready(function() {

    // Add the HP to each character

    $("#obi-hp").append(obi.hp);
    $("#luke-hp").append(luke.hp);
    $("#sid-hp").append(sid.hp);
    $("#maul-hp").append(maul.hp);
    
    function setEnemies (charChosen) {
        charList.forEach(function(char) {
            if (charChosen !== char) {
                $("#" + char).appendTo(".enemies-available");
                $("#" + char).css({"background": "#ff0000","border": "solid 2px #880000"});
                enemiesList.push(char);
            }   
        });
    }

    $(".character-card").on("click",function() {
        if (!charChosenStatus) { 
            charChosenStatus = true;
            charChosen = $(this).attr("id"); 
            setIndividual(charChosen,".your-character");
            setEnemies(charChosen);
            switch (charChosen) {
                case "obi":
                character = obi;
                break;
                case "luke":
                character = luke;
                break;
                case "sid":
                character = sid;
                break;
                case "maul":
                character = maul;
                break;
            }
        } else if (!defenderChosenStatus) {
            defenderChosenStatus = true;
            defenderChosen = $(this).attr("id");
            setIndividual(defenderChosen,".defender");
            $("#" + defenderChosen).css({"background": "#000000","border": "solid 2px #44aa44","color": "#ffffff"});
            switch (defenderChosen) {
                case "obi":
                defender = obi;
                break;
                case "luke":
                defender = luke;
                break;
                case "sid":
                defender = sid;
                break;
                case "maul":
                defender = maul;
                break;
            }
            $(".battle-status").empty();
        }
    });

    $("#attack").on("click", function() {
        if (defenderChosenStatus) {
            if (firstAttack) {
                yourAttack = character.attack;
                yourAttackInc = yourAttack;
                yourHP = character.hp;
                enemyHP = defender.hp;
                firstAttack = false;
            }

            if (nextAttack) {
                enemyHP = defender.hp; 
                nextAttack = false;
            }
            
            enemyHP = enemyHP - yourAttack;            
            yourHP = yourHP - defender.counterAttack;

            $("#" + charChosen + "-hp").html(yourHP);
            $("#" + defenderChosen + "-hp").html(enemyHP);

            $(".battle-status").html("<p>You attacked " + defender.name + " for " + yourAttack + " damage. </p>");
            $(".battle-status").append("<p>" + defender.name + " attacked you for " + defender.counterAttack + " damage. </p>");
        
            yourAttack = yourAttack + yourAttackInc;
            if (yourHP < 0 ) {
                $(".battle-status").html("<p>You have been defeated by " + defender.name + ". GAME OVER! </p>");    
                $("#restart").css("visibility","visible");              
            } else if (enemyHP <= 0) {
                defenderChosenStatus = false;
                $("#" + defenderChosen).css("visibility","hidden");
                $("#" + defenderChosen).appendTo(".garbage-dump");
                $(".battle-status").html("<p>You have defeated " + defender.name + ". Please choose another enemy to continue playing. </p>");    
                nextAttack = true;
                enemyCount--;
                if (enemyCount == 0) {
                    $(".battle-status").html("<p>You have defeated " + defender.name + ".");
                    $(".battle-status").append("<p class=\"winning\">Congratulations, you have defeated all enemies and won the game! </p>");
                    $("#restart").css("visibility","visible"); 
                }  
            } 
        } else {
            $(".battle-status").html("<p>No enemy here. Please pick an enemy to fight. </p>");
        }
    });

    $("#restart").on("click", function() {
        restartGame();
    });
});