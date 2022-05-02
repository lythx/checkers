class Game {

    tilesize = 12
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
    renderer = new THREE.WebGLRenderer();
    checkers = Array(8).fill(null).map(() => Array(8).fill(null))
    tiles = Array(8).fill(null).map(() => Array(8).fill(null))
    player
    raycaster = new Raycaster()
    mouseVector
    myCheckers = new THREE.Object3D()
    opponentCheckers = new THREE.Object3D()
    whiteTiles = new THREE.Object3D()
    blackTiles = new THREE.Object3D()
    selectedChecker
    moves
    sequence = null

    constructor() {
        this.renderer.setClearColor(0x333333);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);
        this.camera.position.set(0, 50, 100)
        this.camera.lookAt(this.scene.position)
        this.scene.add(new THREE.AxesHelper(1000))
        requestAnimationFrame(() => this.render())
        window.onresize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        document.onmousedown = (e) => this.handleClick(e)
        this.generateBoard()
    }

    render = () => {
        requestAnimationFrame(this.render);
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }

    start(player) {
        this.player = player
        if (this.player === 2) {
            this.camera.position.set(0, 50, -100)
            this.camera.lookAt(this.scene.position)
        }
        this.generateCheckers()
        this.moves = new Moves(this.player, this.tiles)
    }

    generateBoard = () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const tile = new Tile(`${j}${i}`, ((i + j) % 2 === 1) ? 0x222222 : 0xdddddd, this.tilesize);
                tile.position.x = (j * this.tilesize) - (this.tilesize * 4 - this.tilesize / 2);
                tile.position.z = (i * this.tilesize) - (this.tilesize * 4 - this.tilesize / 2);
                ((i + j) % 2 === 1) ? this.blackTiles.add(tile) : this.whiteTiles.add(tile)
                this.tiles[j][i] = tile
            }
        }
        this.scene.add(this.whiteTiles)
        this.scene.add(this.blackTiles)
    }

    generateCheckers = () => {
        const template = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];
        for (const [i, row] of template.entries()) {
            for (const [j, tile] of row.entries()) {
                if (tile !== 0) {
                    const checker = new Checker(`${j}${i}`, tile === 2 ? 2 : 1, tile === 2 ? 0xff0000 : 0xffffff, this.tilesize);
                    checker.position.x = (j * this.tilesize) - (this.tilesize * 4 - this.tilesize / 2);
                    checker.position.z = (i * this.tilesize) - (this.tilesize * 4 - this.tilesize / 2)
                    tile === this.player ? this.myCheckers.add(checker) : this.opponentCheckers.add(checker)
                    this.checkers[j][i] = checker
                }
            }
        }
        this.scene.add(this.myCheckers)
        this.scene.add(this.opponentCheckers)
    }

    handleClick(e) {
        if (document.getElementById('cover'))
            return
        const intersects = this.raycaster.getIntersects(e, this.myCheckers.children)
        if (intersects.length > 0) {
            if (this.sequence === null)
                this.selectChecker(intersects[0].object)
            else {
                this.removeSelection()
                this.moves.reset()
                this.endMove()
            }
            return
        }
        if (this.selectedChecker) {
            const tileIntersects = this.raycaster.getIntersects(e, this.blackTiles.children)
            if (tileIntersects.length > 0)
                if (this.moves.getMoves().some(a => a.getTile() === tileIntersects[0].object))
                    this.handleMove(this.moves.getMoves().find(a => a.getTile() === tileIntersects[0].object))
        }
    }

    selectChecker(checker) {
        if (this.selectedChecker === checker) {
            this.removeSelection()
            this.moves.reset()
            return
        }
        if (this.selectedChecker) {
            this.removeSelection()
            this.moves.reset()
        }
        this.selectedChecker = checker
        this.selectedChecker.select()
        this.moves.calculateFirstMove(this.selectedChecker, this.checkers)
        for (const m of this.moves.getMoves())
            m.getTile().select()
    }

    removeSelection() {
        this.selectedChecker.unselect()
        this.selectedChecker = null
        for (const m of this.moves.getMoves())
            m.getTile().unselect()
    }

    async handleMove(move) {
        this.removeSelection()
        this.updateCheckers(
            move.getChecker().getPos(),
            move.getTile().getPos()
        )
        if (!this.sequence)
            this.sequence = {
                checkerId: move.getChecker().getCheckerId(),
                steps: []
            }
        this.sequence.steps.push({
            tileId: move.getTile().getTileId(),
            takeId: move.getTake() === null ? null : move.getTake().getCheckerId()
        })
        if (move.getTake() === null) {
            await this.moves.moveChecker(move)
            this.endMove()
        }
        else {
            await this.moves.moveChecker(move)
            this.selectedChecker = move.getChecker()
            this.removeChecker(move.getTake())
            this.moves.calculateNextMove(move.getChecker(), this.checkers)
            for (const e of this.moves.getMoves())
                e.getTile().select()
            if (this.moves.getMoves().length === 0)
                this.endMove()
        }
    }

    endMove() {
        const checkerIds = this.checkers.reduce((acc, row) => {
            return [...acc, row.map((e) => e === null ? null : e.getCheckerId())]
        }, []);
        net.sendMove(
            this.sequence.checkerId,
            this.sequence.steps,
            checkerIds
        )
        this.sequence = null
        ui.opponentMove()
        net.getMove(this.player)
    }

    getObjectByName(name) {
        for (const e of this.myCheckers.children)
            if (e.name == name)
                return e
        for (const e of this.opponentCheckers.children)
            if (e.name == name)
                return e
    }

    async handleOpponentMove(checkerId, steps, checkerIds) {
        const checkers = checkerIds.reduce((acc, row) => {
            return [...acc, row.map((e) => {
                if (e === null)
                    return null
                for (const row of this.checkers) {
                    if (row.some(a => a === null ? false : a.getCheckerId() === e))
                        return row.find(a => a === null ? false : a.getCheckerId() === e)
                }
            })]
        }, []);
        let checker
        for (const row of this.checkers) {
            if (row.some(a => a?.getCheckerId() === checkerId)) {
                checker = row.find(a => a?.getCheckerId() === checkerId)
                break
            }
        }
        for (const step of steps) {
            let tile
            for (const row of this.tiles) {
                if (row.some(a => a?.getTileId() === step.tileId)) {
                    tile = row.find(a => a?.getTileId() === step.tileId)
                    break
                }
            }
            let take
            for (const row of this.checkers) {
                if (row.some(a => a?.getCheckerId() === step.takeId)) {
                    take = row.find(a => a?.getCheckerId() === step.takeId)
                    break
                }
            }
            const m = new Move(checker, tile, take)
            await this.moves.moveChecker(m)
            if (m.getTake() !== null)
                this.removeChecker(m.getTake())
        }
        this.checkers = checkers
    }

    updateCheckers(oldPos, newPos) {
        const temp = this.checkers[oldPos.x][oldPos.y]
        this.checkers[oldPos.x][oldPos.y] = null
        this.checkers[newPos.x][newPos.y] = temp
    }

    setCheckers(checkers) {
        this.checkers = checkers
    }

    removeChecker(checker) {
        const player = checker.getPlayer()
        const pos = checker.getPos()
        this.checkers[pos.x][pos.y] = null
        new TWEEN.Tween(checker.position)
            .to({ y: 100 }, 2000)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => player === this.player ? this.myCheckers.remove(checker) : this.opponentCheckers.remove(checker))
            .start()
    }
}