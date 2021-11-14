
var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var $moves = $('#moves')

function getMoves(regex) {
  var re = new RegExp(regex)
  var moves = game.moves()
  var possibleMoves = []
  for (i in moves) {
    move = moves[i]
    if (re.test(move)) {
      possibleMoves.push(move)
    }
  }
  return possibleMoves
}

function move(event) {
  if (game.game_over()) return false

  var possibleMoves = []
  var piece = event.target.value
  switch (piece) {
  case 'king':
    possibleMoves = getMoves(/^Kx?\w\d$/)
    break
  case 'queen':
    possibleMoves = getMoves(/^Qx?\w\d$/)
    break
  case 'rook':
    possibleMoves = getMoves(/^Rx?\w\d$/)
    break
  case 'bishop':
    possibleMoves = getMoves(/^Bx?\w\d$/)
    break
  case 'knight':
    possibleMoves = getMoves(/^\+?Nx?\w\d$/)
    break
  case 'pawn':
    possibleMoves = getMoves(/^([a-h]x)?[a-h]\d(=[QRBN]\+?)?$/)
    break
  }
  
  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
  updateStatus()
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
  $moves.html(game.moves().join(', '))
}

var config = {
  draggable: false,
  position: 'start'
}
board = Chessboard('myBoard', config)

updateStatus()

$('#kingBtn').on('click', move)
$('#queenBtn').on('click', move)
$('#rookBtn').on('click', move)
$('#bishopBtn').on('click', move)
$('#knightBtn').on('click', move)
$('#pawnBtn').on('click', move)
