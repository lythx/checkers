class Game {

    scene
    camera
    renderer
    checkers
    player
    raycaster
    mouseVector
    whiteCheckers
    redCheckers
    checkerSelected
    possibleMoves = []

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x333333);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);
        this.camera.position.set(0, 50, 100)
        this.camera.lookAt(this.scene.position)
        this.checkers = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];
        this.createBoard()
        const axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)
        this.render()
        window.onresize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    render = () => {
        requestAnimationFrame(this.render);
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }

    createBoard = () => {
        const tilesize = 12
        this.whiteTiles = new THREE.Object3D()
        this.blackTiles = new THREE.Object3D()
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let color = ((i + j) % 2 == 1) ? 0x222222 : 0xdddddd
                const cube = new Tile(color, tilesize);
                cube.position.x = (i * tilesize) - (tilesize * 4 - tilesize / 2);
                cube.position.z = (j * tilesize) - (tilesize * 4 - tilesize / 2);
                cube.name = `tile${i}${j}`;
                ((i + j) % 2 == 1) ? this.blackTiles.add(cube) : this.whiteTiles.add(cube)
            }
        }
        this.scene.add(this.whiteTiles)
        this.scene.add(this.blackTiles)
    }

    createChekers = (player) => {
        this.player = player
        if (this.player == 2) {
            this.camera.position.set(0, 50, -100)
            this.camera.lookAt(this.scene.position)
        }
        const tilesize = 12
        this.whiteCheckers = new THREE.Object3D()
        this.redCheckers = new THREE.Object3D()
        for (const [i, row] of this.checkers.entries()) {
            for (const [j, tile] of row.entries()) {
                if (tile == 2) {
                    const checker = new Checker(0xff0000);
                    checker.position.x = (j * tilesize) - (tilesize * 4 - tilesize / 2);
                    checker.position.z = (i * tilesize) - (tilesize * 4 - tilesize / 2);
                    checker.position.y = 3
                    checker.name = `checker${i}${j}`
                    this.redCheckers.add(checker)
                }
                else if (tile == 1) {
                    const checker = new Checker(0xffffff);
                    checker.position.x = (j * tilesize) - (tilesize * 4 - tilesize / 2);
                    checker.position.z = (i * tilesize) - (tilesize * 4 - tilesize / 2);
                    checker.position.y = 3
                    checker.name = `checker${i}${j}`
                    this.whiteCheckers.add(checker);
                }
            }
        }
        this.scene.add(this.whiteCheckers)
        this.scene.add(this.redCheckers)
        this.addRaycaster()
    }

    addRaycaster() {
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()

        document.onmousedown = (e) => {
            if (document.getElementById('cover'))
                return
            this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            const intersects = this.raycaster.intersectObjects(this.player == 1 ? this.whiteCheckers.children : this.redCheckers.children);
            if (intersects.length > 0) {
                this.handleCheckerClick(intersects[0].object)
                return
            }
            if (this.checkerSelected) {
                const tileIntersects = this.raycaster.intersectObjects(this.blackTiles.children)
                if (tileIntersects.length > 0 && this.possibleMoves.some(a => a == tileIntersects[0].object.name)) {
                    tileIntersects[0].object.material.color.setHex(0xfffffff)
                    console.log(tileIntersects[0].object.name)
                    this.handleMove(tileIntersects[0].object)
                }
            }
        }
    }

    handleCheckerClick(checker) {
        if (this.checkerSelected) {
            this.checkerSelected.material.color.setHex(this.player == 2 ? 0xff0000 : 0xffffff)
            this.checkerSelected = null
            return
        }
        this.checkerSelected = checker
        checker.material.color.setHex(0xffff00)
        this.displayPossibleMoves()
    }

    handleMove(tile) {
        this.updateCheckersArray(
            this.getIndexFromPosition(this.checkerSelected.position),
            this.getIndexFromPosition(tile.position))
        net.sendMove(
            this.checkerSelected.position,
            { x: tile.position.x, y: 3, z: tile.position.z },
            this.checkerSelected.name,
            this.checkers)
        this.animateMove({ from: this.checkerSelected.position, to: tile.position })
        this.checkerSelected.material.color.setHex(this.player == 2 ? 0xff0000 : 0xffffff)
        this.checkerSelected = null
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
        for (const e of this.whiteCheckers.children)
            if (e.name == name)
                return e
        for (const e of this.redCheckers.children)
            if (e.name == name)
                return e
    }

    updateCheckersArray(oldPos, newPos) {
        console.log(newPos)
        this.checkers[oldPos.y][oldPos.x] = 0
        this.checkers[newPos.y][newPos.x] = this.player
    }

    setCheckers(checkers) {
        this.checkers = checkers
        console.table(checkers)
    }

    displayPossibleMoves() {
        const pos = this.getIndexFromPosition(this.checkerSelected.position)
        const x = pos.x
        const y = pos.y
        let moves = []
        let arr = [this.checkMoves(y, x)]
        while (true) {
            moves.push(arr)
            arr = []
            for (const e of arr)
                arr.push(this.checkMoves(e.y, e.x))
            if (arr.length == 0)
                break
        }
        moves = moves.flat(10)
        console.log(this.blackTiles.children)
        let tiles = this.blackTiles.children
        for (const m of moves) {
            let t = tiles.find(a => a.name == `tile${m.x}${m.y}`)
            t.material.color.setHex(0xaaff00)
            this.possibleMoves.push(`tile${m.x}${m.y}`)
        }
    }

    checkMoves(y, x) {
        const c = this.checkers
        let arr = []
        if (this.player == 1) {
            console.log('e')
            if (c?.[y - 1]?.[x - 1] == 0) {
                arr.push({ y: y - 1, x: x - 1 })
            }
            else if (c?.[y - 1]?.[x - 1] == 2 && c?.[y - 2]?.[x - 2] == 0) {
                arr.push({ y: y - 2, x: x - 2 })
            }
            if (c?.[y - 1]?.[x + 1] == 0) {
                arr.push({ y: y - 1, x: x + 1 })
            }
            else if (c?.[y - 1]?.[x + 1] == 2 && c?.[y - 2]?.[x + 2] == 0) {
                arr.push({ y: y - 2, x: x + 2 })
            }
        }
        else {
            if (c?.[y + 1]?.[x - 1] == 0) {
                arr.push({ y: y + 1, x: x - 1 })
            }
            else if (c?.[y + 1]?.[x - 1] == 2 && c?.[y + 2]?.[x - 2] == 0) {
                arr.push({ y: y + 2, x: x - 2 })
            }
            if (c?.[y + 1]?.[x + 1] == 0) {
                arr.push({ y: y + 1, x: x + 1 })
            }
            else if (c?.[y - 1]?.[x + 1] == 2 && c?.[y - 2]?.[x + 2] == 0) {
                arr.push({ y: y + 2, x: x + 2 })
            }
        }
        console.log(arr)
        return arr
    }
}