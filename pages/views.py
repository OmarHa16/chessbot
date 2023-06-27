from django.http import JsonResponse
from django.shortcuts import render
import chess


# Home
def Index(req):
    return render(req, 'index.html')


# First Board
def FirstBoard(req):
    global boardFirst
    boardFirst = chess.Board()
    return render(req, 'firstBoard.html')


# Get Moves To User For Board One
def GetMovesOne(req):
    moves = list(boardFirst.legal_moves)
    avaiMoves = list(map(lambda move: str(move), moves))
    return JsonResponse({'moves': avaiMoves, 'end': boardFirst.is_game_over(), 'result': boardFirst.result()})

# Get User Move For Board One
def GetUserMoveOne(req):
    userMove = req.GET.get('move')
    boardFirst.turn = chess.WHITE
    if not boardFirst.is_game_over():
        moves = list(boardFirst.legal_moves)
        avaiMoves = list(map(lambda move: str(move), moves))
        for i in range(len(moves)):
            if userMove == avaiMoves[i]:
                boardFirst.push(moves[i])
        boardFirst.turn = chess.BLACK
        return JsonResponse({'moved': True, 'end': False})
    else:
        return JsonResponse({'moved': False, 'end': True, 'result': boardFirst.result()})


# Bot Move For First Board 
def BotMoveOne(req):
    boardFirst.turn = chess.BLACK
    if not boardFirst.is_game_over():
        L = 2  # Initial depth
        alpha = float('-inf')  # Initial alpha value
        beta = float('inf')  # Initial beta value
        avaiMoves = list(boardFirst.legal_moves)
        best_move = None
        best_score = float('inf')
        for move2 in avaiMoves:
            boardFirst.push(move2)
            score = alpha_betaMinMaxL(boardFirst, L, alpha, beta, True)
            boardFirst.pop()
            if score < best_score:
                best_move = move2
                best_score = score
        boardFirst.push(best_move) 
        botMove = best_move
        boardFirst.turn = chess.WHITE # Switch The Turn
        return JsonResponse({'move': str(botMove), 'end': False})
    else:
        return JsonResponse({'move': None, 'end': True, 'result': boardFirst.result()})


# Second Board
def SecondBoard(req):
    global boardSecond
    boardSecond = chess.Board()
    return render(req, 'secondBoard.html')


# Get Moves To User For Board Two
def GetMovesTwo(req):
    moves = list(boardSecond.legal_moves)
    avaiMoves = list(map(lambda move: str(move), moves))
    return JsonResponse({'moves': avaiMoves, 'end': boardSecond.is_game_over(), 'result': boardSecond.result()})

# Get User Move For Board Two
def GetUserMoveTwo(req):
    userMove = req.GET.get('move')
    boardSecond.turn = chess.WHITE
    if not boardSecond.is_game_over():
        moves = list(boardSecond.legal_moves)
        avaiMoves = list(map(lambda move: str(move), moves))
        for i in range(len(moves)):
            if userMove == avaiMoves[i]:
                boardSecond.push(moves[i]) # To Push The Move As USI Not String
        boardSecond.turn = chess.BLACK
        return JsonResponse({'moved': True, 'end': False})
    else:
        return JsonResponse({'moved': False, 'end': True, 'result': boardSecond.result()})


# Bot Move For Second Board 
def BotMoveTwo(req):
    boardSecond.turn = chess.BLACK
    if not boardSecond.is_game_over():
        L = 2  # Initial depth
        k = 5
        alpha = float('-inf')  # Initial alpha value
        beta = float('inf')  # Initial beta value
        avaiMoves = list(boardSecond.legal_moves)
        best_move = None
        best_score = float('inf')
        for move2 in avaiMoves:
            boardSecond.push(move2)
            score = alpha_betaMinMaxbest(boardSecond, L, k, alpha, beta, True)
            boardSecond.pop()
            if score < best_score:
                best_move = move2
                best_score = score
        boardSecond.push(best_move) 
        move = best_move
        print(boardSecond)
        boardSecond.turn = chess.WHITE # Switch The Turn
        return JsonResponse({'move': str(move), 'end': False})
    else:
        return JsonResponse({'move': None, 'end': True, 'result': boardSecond.result()})


#   Necessary Code
# Evaluate The Board
def evaluate_board(board):
    # Count the material balance
    piece_values = {
        chess.PAWN: 1,
        chess.KNIGHT: 3,
        chess.BISHOP: 3,
        chess.ROOK: 5,
        chess.QUEEN: 9,
        chess.KING: 0
    }
    score = 0
    for square, piece in board.piece_map().items():
        value = piece_values[piece.piece_type]
        if piece.color == chess.WHITE:
            score += value
        else:
            score -= value
    # Add bonuses/penalties based on piece positions
    for square, piece in board.piece_map().items():
        if piece.color == chess.WHITE:
            if piece.piece_type == chess.PAWN:
                score += 10 + (7 - chess.square_distance(square, chess.E2))
            elif piece.piece_type == chess.KNIGHT:
                score += 30 + len(board.attacks(square))
            elif piece.piece_type == chess.BISHOP:
                score += 30 + len(board.attacks(square))
            elif piece.piece_type == chess.ROOK:
                score += 50 + len(board.attacks(square))
            elif piece.piece_type == chess.QUEEN:
                score += 90 + len(board.attacks(square))
            elif piece.piece_type == chess.KING:
                score += 900 + len(board.attacks(square))
        else:
            if piece.piece_type == chess.PAWN:
                score -= 10 + (chess.square_distance(square, chess.E7))
            elif piece.piece_type == chess.KNIGHT:
                score -= 30 + len(board.attacks(square))
            elif piece.piece_type == chess.BISHOP:
                score -= 30 + len(board.attacks(square))
            elif piece.piece_type == chess.ROOK:
                score -= 50 + len(board.attacks(square))
            elif piece.piece_type == chess.QUEEN:
                score -= 90 + len(board.attacks(square))
            elif piece.piece_type == chess.KING:
                score -= 900 + len(board.attacks(square))
    return score


# First One
def alpha_betaMinMaxL(board, L, alpha, beta, maximizing_player):
    if L == 0 or board.is_game_over():
        return evaluate_board(board)
    legal_moves = list(board.legal_moves)
    if maximizing_player:
        E = float('-inf')
        for move in legal_moves:
            board.push(move)
            score = alpha_betaMinMaxL(board, L-1, alpha, beta, False)
            board.pop()
            E = max(E,score)
            alpha = max(alpha,score)
            if beta<=alpha:
                break
        return E
    else:
        E = float('inf')
        for move in legal_moves:
            board.push(move)
            score = alpha_betaMinMaxL(board, L-1, alpha, beta, True)
            board.pop()
            E = min(E,score)
            beta = min(beta,score)
            if beta<=alpha:
                break
        return E


# To Help Alpha Best
def movePosition(board,move):
    board.push(move)
    x = evaluate_board(board)
    board.pop()
    return x

# Second One
def alpha_betaMinMaxbest(board, L, K, alpha, beta, maximizing_player):
    if L == 0 or board.is_game_over():
        return evaluate_board(board)
    legal_moves = list(board.legal_moves)
    legal_moves_eval = list(map(lambda x:movePosition(board,x),legal_moves))
    best_legal_moves = legal_moves[:]
    best_legal_moves.clear()
    for i in range(1,K+1):
        if legal_moves_eval:
            d = legal_moves_eval.index(max(legal_moves_eval))
            best_legal_moves.insert(0,legal_moves[d])
            legal_moves_eval.pop(d)
    if maximizing_player:
        E = float('-inf')
        for move in best_legal_moves:
            board.push(move)
            score = alpha_betaMinMaxbest(board, L-1, K, alpha, beta, False)
            board.pop()
            E = max(E,score)
            alpha = max(alpha,score)
            if beta<=alpha:
                break
        return E
    else:
        E = float('inf')
        for move in best_legal_moves:
            board.push(move)
            score = alpha_betaMinMaxbest(board, L-1, K, alpha, beta, True)
            board.pop()
            E = min(E,score)
            beta = min(beta,score)
            if beta<=alpha:
                break
        return E


