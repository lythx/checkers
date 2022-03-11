class Game {

    constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xeeeeee);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);
        this.camera.position.set(0, 100, 100)
        this.camera.lookAt(this.scene.position)

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
                let color = ((i + j) % 2 == 0) ? 0x222222 : 0xdddddd
                const material = new THREE.MeshBasicMaterial({ color });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.x = (i * tilesize) - (tilesize * 4 - tilesize / 2);
                cube.position.z = (j * tilesize) - (tilesize * 4 - tilesize / 2);
                this.scene.add(cube);
            }
        }
    }

}