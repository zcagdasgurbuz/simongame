function SimonGame() {
  this.level = 1;
  this.combination = [];
  this.playerCombination = [];
  this.remindCounter = 3;

  function levelUp() {
    this.level++;
  }

  function pickRandomBox() {
    var boxIds = ['green', 'red', 'yellow', 'blue'];
    randomNumber = Math.floor(Math.random() * 4);
    return boxIds[randomNumber];
  }

  function playAudio(box, delay) {
    var blueAudio = new Audio('sounds/blue.mp3');
    var greenAudio = new Audio('sounds/green.mp3');
    var redAudio = new Audio('sounds/red.mp3');
    var yellowAudio = new Audio('sounds/yellow.mp3');
    var wrongAudio = new Audio('sounds/wrong.mp3');

    switch (box) {
      case 'blue':
        setTimeout(function() {
          blueAudio.play();
        }, delay);
        break;
      case 'green':
        setTimeout(function() {
          greenAudio.play();
        }, delay);
        break;
      case 'red':
        setTimeout(function() {
          redAudio.play();
        }, delay);
        break;
      case 'yellow':
        setTimeout(function() {
          yellowAudio.play();
        }, delay);
        break;
      default:
        setTimeout(function() {
          wrongAudio.play();
        }, delay);
    }
  }

  function animateBox(box, delay) {
    setTimeout(function() {
      $('.' + box).addClass('pressed');
      setTimeout(function() {
        $('.' + box).removeClass('pressed');
      }, 200);
    }, delay);
  }

  function playAndAnimate(box, delay) {
    animateBox(box, delay);
    playAudio(box, delay);
  }

  function checkIfCorrect(array1, array2, lengthCheck) {
    var i = 0;
    if (array1.length == array2.length || !lengthCheck) {
      for (i; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  function remind() {
    if (remindCounter > 0) {
      animateBox('cbtn', 0);
      this.remindCounter--;
      $('.cbtn').text(this.remindCounter);
      var i = 0;
      for (i; i < this.combination.length; i++) {
        playAndAnimate(this.combination[i], (i + 1) * 600);
      }
      setTimeout(checkForHints, ((i + 1) * 600)+500);
    }
  }

  function startListeningForAnyKey() {
    $(document).one('keydown', function() {
      startGame();
    });
  }

  function startGame() {
    this.level = 1;
    this.combination = [];
    this.playerCombination = [];
    this.remindCounter = 3;
    $('body').removeClass('game-over');
    $('.cbtn').text(this.remindCounter);
    $('#level-title').text('Level ' + this.level);
    this.combination.push(pickRandomBox());
    playAndAnimate(this.combination[0], 200);
    checkForHints();
    checkForClicks();
  }

  function checkForHints(){
    $('.cbtn').one('click', function() {
      remind();
    });
  }

  function checkForClicks() {
    $('.btn').on('click', function() {
      playAndAnimate(this.id, 0);
      pushPlayerCombinationAndCheck(this.id);
    });
  }

  function pushPlayerCombinationAndCheck(id) {
    this.playerCombination.push(id);
    if (checkIfCorrect(this.playerCombination, this.combination, false)) {
      if (checkIfCorrect(this.combination, this.playerCombination, true)) {
        levelUp();
        this.combination.push(pickRandomBox());
        playAndAnimate(this.combination[this.combination.length - 1], 600);
        $('#level-title').text('Level ' + this.level);
        this.playerCombination = [];
      }
    } else {
      gameOver();
      startListeningForAnyKey();
    }
  }

  function gameOver() {
    playAudio('wrong', 0);
    $('#level-title').text('Game Over, Press Any Key to Restart');
    $('body').addClass('game-over');
    $('.btn').off('click');
    $('.cbtn').off('click');
  }

  startListeningForAnyKey();
}

var newGame = new SimonGame();
