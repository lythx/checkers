class Moves {

    moves = []
    player
    tiles

    constructor(player, tiles) {
        this.player = player
        this.tiles = tiles
    }

    calculateFirstMove(checker, checkers) {
        const x = checker.getPos().x
        const y = checker.getPos().y
        const c = checkers
        const p = this.player
        console.log({ x, y, c, p })
        if (p === 1) {
            if (c?.[y - 1]?.[x - 1] === null)
                this.moves.push(new Move(
                    checker,
                    this.findTile(x - 1, y - 1),
                    false))
            if (c?.[y - 1]?.[x + 1] === null) {
                this.moves.push(new Move(
                    checker,
                    this.findTile(x + 1, y - 1),
                    false))
            }
        }
        else if (p === 2) {
            if (c?.[y + 1]?.[x - 1] === null)
                this.moves.push(new Move(
                    checker,
                    this.findTile(x - 1, y + 1),
                    false))
            if (c?.[y + 1]?.[x + 1] === null) {
                this.moves.push(new Move(
                    checker,
                    this.findTile(x + 1, y + 1),
                    false))
            }
        }
    }

    async moveChecker(move) {
        console.log(move)
        return new Promise((resolve) => {
            new TWEEN.Tween(move.getChecker().position)
                .to({ x: move.getTile().position.x, z: move.getTile().position.z }, 500)
                .onComplete(() => {
                    move.getChecker().updatePos()
                    resolve()
                })
                .start()
        })
    }

    findTile(x, y) {
        for (const row of this.tiles)
            if (row.some(a => a.getPos().x === x && a.getPos().y === y))
                return row.find(a => a.getPos().x === x && a.getPos().y === y)
    }

    getMoves() {
        return this.moves
    }

    reset() {
        this.moves = []
    }
}