class Moves {

    moves = []
    checkers
    player

    constructor(position, checkers, player) {
        console.log(position)
        this.checkers = checkers
        this.player = player
        this.calculate(position.x, position.y, this.checkers, this.player)
    }

    calculate(x, y, c, p) {
        let sequence = [{ x, y }]
        if (p === 1) {
            if (c?.[y - 1]?.[x - 1] === null)
                this.moves.push(new Move(
                    [...sequence, { x: x - 1, y: y - 1 }],
                    { x: x - 1, y: y - 1 },
                    false))
            if (c?.[y - 1]?.[x + 1] === null) {
                this.moves.push(new Move(
                    [...sequence, { x: x + 1, y: y - 1 }],
                    { x: x + 1, y: y - 1 },
                    false))
            }
        }
        else if (p === 2) {
            if (c?.[y + 1]?.[x - 1] === null)
                this.moves.push(new Move(
                    [...sequence, { x: x - 1, y: y + 1 }],
                    { x: x - 1, y: y + 1 },
                    false))
            if (c?.[y + 1]?.[x + 1] === null) {
                this.moves.push(new Move(
                    [...sequence, { x: x + 1, y: y + 1 }],
                    { x: x + 1, y: y + 1 },
                    false))
            }
        }
    }

    getMoves() {
        return this.moves
    }
}