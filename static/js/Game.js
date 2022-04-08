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
                if (tileIntersects.length > 0) {
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
    }

    handleMove(tile) {
        net.sendMove(this.checkerSelected.position, { x: tile.position.x, y: 3, z: tile.position.z }, this.checkerSelected.name)
        this.animateMove({ from: this.checkerSelected.position, to: tile.position })
        this.checkerSelected.material.color.setHex(this.player == 2 ? 0xff0000 : 0xffffff)
        this.checkerSelected = null
        ui.opponentMove()
        net.getMove(this.player)
    }

    getIndexFromPosition(pos) {
        return { x: (pos.x + 42) / 12, y: 3, z: (pos.z + 42) / 12 }
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
}