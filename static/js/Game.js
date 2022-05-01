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
    selectedTiles = []
    moves

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

    setPlayer(player) {
        this.player = player
        if (this.player === 2) {
            this.camera.position.set(0, 50, -100)
            this.camera.lookAt(this.scene.position)
        }
    }

    generateBoard = () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const tile = new Tile(((i + j) % 2 === 1) ? 0x222222 : 0xdddddd, this.tilesize);
                tile.setPos(j, i);
                tile.setTileId(`${j}${i}`);
                ((i + j) % 2 === 1) ? this.blackTiles.add(tile) : this.whiteTiles.add(tile)
                this.tiles[i][j] = tile
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
                    const checker = new Checker(tile === 2 ? 0xff0000 : 0xffffff, this.tilesize);
                    checker.setPos(j, i)
                    checker.setCheckerId(`${j}${i}`)
                    tile === this.player ? this.myCheckers.add(checker) : this.opponentCheckers.add(checker)
                    this.checkers[i][j] = checker
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
            this.selectChecker(intersects[0].object)
            return
        }
        if (this.selectedChecker) {
            const tileIntersects = this.raycaster.getIntersects(e, this.blackTiles.children)
            if (tileIntersects[0].object.getSelected()) {
                this.moveChecker(tileIntersects[0].object)
            }
        }
    }

    resetPossibleMoves() {
        for (const e of this.possibleMoves)
            e.unselect()
        this.possibleMoves = []
    }

    selectChecker(checker) {
        if (this.selectedChecker === checker) {
            this.removeSelection()
            return
        }
        if (this.selectedChecker)
            this.removeSelection()
        this.selectedChecker = checker
        this.selectedChecker.select()
        this.moves = new Moves(this.selectedChecker.getPos(), this.checkers, this.player)
        this.displayPossibleMoves()
    }

    removeSelection() {
        this.selectedChecker.unselect()
        this.selectedChecker = null
        for (const tile of this.selectedTiles)
            tile.unselect()
        this.selectedTiles = []
        this.moves = null
    }

    moveChecker(tile) {
        this.updateCheckersArray(
            this.selectedChecker.getPos(),
            tile.getPos())
        net.sendMove(
            this.selectedChecker.getId(),
            tile.getId(),
            this.checkers)
        this.animateMove({ from: this.selectedChecker.position, to: tile.position })
        this.selectedChecker.material.color.setHex(this.player == 2 ? 0xff0000 : 0xffffff)
        this.selectedChecker = null
        ui.opponentMove()
        net.getMove(this.player)
    }

    getIndexFromPosition(pos) {
        return { x: (pos.x + 42) / 12, y: (pos.z + 42) / 12 }
    }

    animateMove(move) {
        if (move.name)
            move.from = this.getObjectByName(move.name).position
        new TWEEN.Tween(move.from)
            .to({ x: move.to.x, y: 3, z: move.to.z }, 500)
            .start()
    }

    getObjectByName(name) {
        for (const e of this.myCheckers.children)
            if (e.name == name)
                return e
        for (const e of this.opponentCheckers.children)
            if (e.name == name)
                return e
    }

    updateCheckersArray(oldPos, newPos) {
        this.checkers[oldPos.x][oldPos.y] = null
        this.checkers[newPos.x][newPos.y] = this.selectedChecker
    }

    setCheckers(checkers) {
        this.checkers = checkers
    }

    displayPossibleMoves() {
        for (const row of this.tiles) {
            for (const tile of row) {
                if (this.moves.getMoves().some(a =>
                    a.getDestination().x === tile.getPos().x && a.getDestination().y === tile.getPos().y)) {
                    tile.select()
                    this.selectedTiles.push(tile)
                }
            }
        }

        /* const pos = this.getIndexFromPosition(this.checkerSelected.position)
         const x = pos.x
         const y = pos.y
         const c = this.checkers
         let moves = []
         if (this.player == 1) {
             if (c?.[y - 1]?.[x - 1] == 0)
                 moves.push({ y: y - 1, x: x - 1 })
             else {
                 let arr = [this.checkMoves(y, x)]
                 while (true) {
                     arr = arr.flat(3)
                     moves.push(arr)
                     let temp = []
                     for (const e of arr) {
                         temp.push(this.checkMoves(e.y, e.x))
                     }
                     arr = [...temp]
                     arr = arr.flat(3)
                     if (arr.length == 0)
                         break
                 }
             }
             if (c?.[y - 1]?.[x + 1] == 0)
                 moves.push({ y: y - 1, x: x + 1 })
             else {
                 let arr = [this.checkMoves(y, x)]
                 while (true) {
                     arr = arr.flat(3)
                     moves.push(arr)
                     let temp = []
                     for (const e of arr) {
                         temp.push(this.checkMoves(e.y, e.x))
                     }
                     arr = [...temp]
                     arr = arr.flat(3)
                     if (arr.length == 0)
                         break
                 }
             }
         }
         else {
             if (c?.[y + 1]?.[x - 1] == 0)
                 moves.push({ y: y + 1, x: x - 1 })
             else {
                 let arr = [this.checkMoves(y, x)]
                 while (true) {
                     arr = arr.flat(3)
                     moves.push(arr)
                     let temp = []
                     for (const e of arr) {
                         temp.push(this.checkMoves(e.y, e.x))
                     }
                     arr = [...temp]
                     arr = arr.flat(3)
                     if (arr.length == 0)
                         break
                 }
             }
             if (c?.[y + 1]?.[x + 1] == 0)
                 moves.push({ y: y + 1, x: x + 1 })
             else {
                 let arr = [this.checkMoves(y, x)]
                 while (true) {
                     arr = arr.flat(3)
                     moves.push(arr)
                     let temp = []
                     for (const e of arr) {
                         temp.push(this.checkMoves(e.y, e.x))
                     }
                     arr = [...temp]
                     arr = arr.flat(3)
                     if (arr.length == 0)
                         break
                 }
             }
         }
 
         moves = moves.flat(10)
         this.blackTiles.children
         for (const m of moves) {
             let t = this.blackTiles.children.find(a => a.name == `tile${m.x}${m.y}`)
             t.material.color.setHex(0xaaff00)
             this.possibleMoves.push(t)
         }
         */
    }

    checkMoves(y, x) {
        const c = this.checkers
        let arr = []
        // if (this.player == 1) {
        //     if (c?.[y - 1]?.[x - 1] == 2 && c?.[y - 2]?.[x - 2] == 0)
        //         arr.push({ y: y - 2, x: x - 2 })
        //     if (c?.[y - 1]?.[x + 1] == 2 && c?.[y - 2]?.[x + 2] == 0)
        //         arr.push({ y: y - 2, x: x + 2 })
        // }
        // else {
        //     if (c?.[y + 1]?.[x - 1] == 1 && c?.[y + 2]?.[x - 2] == 0)
        //         arr.push({ y: y + 2, x: x - 2 })
        //     if (c?.[y - 1]?.[x + 1] == 1 && c?.[y - 2]?.[x + 2] == 0)
        //         arr.push({ y: y + 2, x: x + 2 })
        // }
        return arr
    }
}