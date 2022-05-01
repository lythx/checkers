class Move {

    checker
    tile
    take

    constructor(checker, tile, take) {
        this.checker = checker
        this.tile = tile
        this.take = take
    }

    getChecker() {
        return this.checker
    }

    getTile() {
        return this.tile
    }

    getTake() {
        return this.take
    }
}