class Game {

    scene
    camera
    renderer
    checkers

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

        this.render() // wywołanie metody render

        window.onresize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

    }

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        console.log("render leci")
    }

    createBoard = () => {
        const tilesize = 12
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const geometry = new THREE.BoxGeometry(tilesize, 3, tilesize);
                let color = ((i + j) % 2 == 1) ? 0x222222 : 0xdddddd
                const material = new THREE.MeshBasicMaterial({ color });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.x = (i * tilesize) - (tilesize * 4 - tilesize / 2);
                cube.position.z = (j * tilesize) - (tilesize * 4 - tilesize / 2);
                this.scene.add(cube);
            }
        }
    }

    createChekers = (player) => {
        if (player == 2) {
            this.camera.position.set(0, 50, -100)
            this.camera.lookAt(this.scene.position)
        }
        const tilesize = 12
        const geometry = new THREE.CylinderGeometry(5, 5, 5, 32);
        for (const [i, row] of this.checkers.entries()) {
            for (const [j, tile] of row.entries()) {
                if (tile == 2) {
                    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    const cylinder = new THREE.Mesh(geometry, material);
                    cylinder.position.x = (j * tilesize) - (tilesize * 4 - tilesize / 2);
                    cylinder.position.z = (i * tilesize) - (tilesize * 4 - tilesize / 2);
                    cylinder.position.y = 3
                    this.scene.add(cylinder);
                }
                else if (tile == 1) {
                    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    const cylinder = new THREE.Mesh(geometry, material);
                    cylinder.position.x = (j * tilesize) - (tilesize * 4 - tilesize / 2);
                    cylinder.position.z = (i * tilesize) - (tilesize * 4 - tilesize / 2);
                    cylinder.position.y = 3
                    this.scene.add(cylinder);
                }
            }
        }
    }

}