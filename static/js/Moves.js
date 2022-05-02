class Moves {

    moves = []
    player
    tiles
    checkers

    constructor(player, tiles) {
        this.player = player
        this.tiles = tiles
    }

    calculateFirstMove(checker, checkers) {
        if (checker.isKing()) {
            this.calculateKingMove(checker, checkers, true)
            return
        }
        this.checkers = checkers
        const x = checker.getPos().x
        const y = checker.getPos().y
        const c = this.checkers.reduce((acc, row) => {
            return [...acc, row.map((e) => e === null ? 0 : e.getPlayer())]
        }, []);
        const p = this.player
        if (p === 1) {
            if (c?.[x - 1]?.[y - 1] === 0)
                this.moves.push(new Move(
                    checker,
                    this.findTile(x - 1, y - 1)))
            else if (c?.[x - 1]?.[y - 1] === 2) {
                if (c?.[x - 2]?.[y - 2] === 0)
                    this.moves.push(new Move(
                        checker,
                        this.findTile(x - 2, y - 2),
                        this.findChecker(x - 1, y - 1)))
            }
            if (c?.[x + 1]?.[y - 1] === 0) {
                this.moves.push(new Move(
                    checker,
                    this.findTile(x + 1, y - 1)))
            }
            else if (c?.[x + 1]?.[y - 1] === 2) {
                if (c?.[x + 2]?.[y - 2] === 0)
                    this.moves.push(new Move(
                        checker,
                        this.findTile(x + 2, y - 2),
                        this.findChecker(x + 1, y - 1)))
            }
        }
        else if (p === 2) {
            if (c?.[x - 1]?.[y + 1] === 0)
                this.moves.push(new Move(
                    checker,
                    this.findTile(x - 1, y + 1)))
            else if (c?.[x - 1]?.[y + 1] === 1) {
                if (c?.[x - 2]?.[y + 2] === 0)
                    this.moves.push(new Move(
                        checker,
                        this.findTile(x - 2, y + 2),
                        this.findChecker(x - 1, y + 1)))
            }
            if (c?.[x + 1]?.[y + 1] === 0) {
                this.moves.push(new Move(
                    checker,
                    this.findTile(x + 1, y + 1)))
            }
            else if (c?.[x + 1]?.[y + 1] === 1) {
                if (c?.[x + 2]?.[y + 2] === 0)
                    this.moves.push(new Move(
                        checker,
                        this.findTile(x + 2, y + 2),
                        this.findChecker(x + 1, y + 1)))
            }
        }


    }

    calculateNextMove(checker, checkers) {
        if (checker.isKing()) {
            this.calculateKingMove(checker, checkers, false)
            return
        }
        this.checkers = checkers
        const x = checker.getPos().x
        const y = checker.getPos().y
        const c = this.checkers.reduce((acc, row) => {
            return [...acc, row.map((e) => e === null ? 0 : e.getPlayer())]
        }, []);
        const p = this.player
        const o = p === 1 ? 2 : 1
        if (c?.[x - 1]?.[y - 1] === o) {
            if (c?.[x - 2]?.[y - 2] === 0)
                this.moves.push(new Move(
                    checker,
                    this.findTile(x - 2, y - 2),
                    this.findChecker(x - 1, y - 1)))
        }
        if (c?.[x + 1]?.[y - 1] === o) {
            if (c?.[x + 2]?.[y - 2] === 0)
                this.moves.push(new Move(
                    checker,
                    this.findTile(x + 2, y - 2),
                    this.findChecker(x + 1, y - 1)))
        }
        if (c?.[x - 1]?.[y + 1] === o) {
            if (c?.[x - 2]?.[y + 2] === 0)
                this.moves.push(new Move(
                    checker,
                    this.findTile(x - 2, y + 2),
                    this.findChecker(x - 1, y + 1)))
        }
        if (c?.[x + 1]?.[y + 1] === o) {
            if (c?.[x + 2]?.[y + 2] === 0)
                this.moves.push(new Move(
                    checker,
                    this.findTile(x + 2, y + 2),
                    this.findChecker(x + 1, y + 1)))
        }
    }

    calculateKingMove(checker, checkers, first) {
        this.checkers = checkers
        const x = checker.getPos().x
        const y = checker.getPos().y
        const c = this.checkers.reduce((acc, row) => {
            return [...acc, row.map((e) => e === null ? 0 : e.getPlayer())]
        }, []);
        const p = this.player
        const o = p === 1 ? 2 : 1
        for (let i = 1; ; i++) {
            if (c?.[x - i]?.[y - i] === 0) {
                this.moves.push(new Move(
                    checker,
                    this.findTile(x - i, y - i)))
            }
            else if (c?.[x - i]?.[y - i] === o) {
                if (c?.[x - (i + 1)]?.[y - (i + 1)] === 0) {
                    for (let j = 1; ; j++) {
                        if (c?.[x - (i + j)]?.[y - (i + j)] === 0) {
                            this.moves.push(new Move(
                                checker,
                                this.findTile(x - (i + j), y - (i + j)),
                                this.findChecker(x - i, y - i)))
                        }
                        else
                            break
                    }
                }
                break
            }
            else
                break
        }
        for (let i = 1; ; i++) {
            if (c?.[x + i]?.[y - i] === 0) {
                this.moves.push(new Move(
                    checker,
                    this.findTile(x + i, y - i)))
            }
            else if (c?.[x + i]?.[y - i] === o) {
                if (c?.[x + (i + 1)]?.[y - (i + 1)] === 0) {
                    for (let j = 1; ; j++) {
                        if (c?.[x + (i + j)]?.[y - (i + j)] === 0) {
                            this.moves.push(new Move(
                                checker,
                                this.findTile(x + (i + j), y - (i + j)),
                                this.findChecker(x + i, y - i)))
                        }
                        else
                            break
                    }
                }
                break
            }
            else
                break
        }
        for (let i = 1; ; i++) {
            if (c?.[x - i]?.[y + i] === 0) {
                this.moves.push(new Move(
                    checker,
                    this.findTile(x - i, y + i)))
            }
            else if (c?.[x - i]?.[y + i] === o) {
                if (c?.[x - (i + 1)]?.[y + (i + 1)] === 0) {
                    for (let j = 1; ; j++) {
                        if (c?.[x - (i + j)]?.[y + (i + j)] === 0) {
                            this.moves.push(new Move(
                                checker,
                                this.findTile(x - (i + j), y + (i + j)),
                                this.findChecker(x - i, y + i)))
                        }
                        else
                            break
                    }
                }
                break
            }
            else
                break
        }
        for (let i = 1; ; i++) {
            if (c?.[x + i]?.[y + i] === 0) {
                this.moves.push(new Move(
                    checker,
                    this.findTile(x + i, y + i)))
            }
            else if (c?.[x + i]?.[y + i] === o) {
                if (c?.[x + (i + 1)]?.[y + (i + 1)] === 0) {
                    for (let j = 1; ; j++) {
                        if (c?.[x + (i + j)]?.[y + (i + j)] === 0) {
                            this.moves.push(new Move(
                                checker,
                                this.findTile(x + (i + j), y + (i + j)),
                                this.findChecker(x + i, y + i)))
                        }
                        else
                            break
                    }
                }
                break
            }
            else
                break
        }
        if (!first)
            this.moves = this.moves.filter(a => a.getTake() !== null)
    }

    async moveChecker(move) {
        this.moves = []
        if (!move.getTake())
            return new Promise((resolve) => {
                new TWEEN.Tween(move.getChecker().position)
                    .to({ x: move.getTile().position.x, z: move.getTile().position.z }, 500)
                    .onComplete(() => { resolve() })
                    .start()
            })
        else
            return new Promise(async (resolve) => {
                await new Promise((r) => {
                    new TWEEN.Tween(move.getChecker().position)
                        .to({ y: 10 }, 400)
                        .onComplete(() => { r() })
                        .start()
                })
                await new Promise((r) => {
                    new TWEEN.Tween(move.getChecker().position)
                        .to({ x: move.getTile().position.x, z: move.getTile().position.z }, 500)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .onComplete(() => { r() })
                        .start()
                })
                new TWEEN.Tween(move.getChecker().position)
                    .to({ y: 3 }, 400)
                    .onComplete(() => { resolve() })
                    .start()
            })
    }

    findTile(x, y) {
        for (const row of this.tiles)
            if (row.some(a => a.getPos().x === x && a.getPos().y === y))
                return row.find(a => a.getPos().x === x && a.getPos().y === y)
    }

    findChecker(x, y) {
        for (const row of this.checkers)
            if (row.some(a => a === null ? false : a.getPos().x === x && a.getPos().y === y))
                return row.find(a => a === null ? false : a.getPos().x === x && a.getPos().y === y)
    }

    reset() {
        this.moves = []
    }

    getMoves() {
        return this.moves
    }
}