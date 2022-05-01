class Move {

    destination
    sequence
    take

    constructor(sequence, destination, take) {
        this.sequence = sequence
        this.destination = destination
        this.take = take
    }

    getSequence() {
        return this.sequence
    }

    getDestination() {
        return this.destination
    }

    getTake() {
        return this.take
    }
}