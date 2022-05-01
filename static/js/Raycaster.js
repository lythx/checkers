class Raycaster extends THREE.Raycaster {
    constructor() {
        super()
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()
    }

    getIntersects(event, parent) {
        this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, game.camera);
        return this.raycaster.intersectObjects(parent);
    }
}