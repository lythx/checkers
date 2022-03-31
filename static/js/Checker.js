class Checker extends THREE.Mesh {
    constructor(color) {
        super()
        this.geometry = new THREE.CylinderGeometry(5, 5, 3, 32);
        this.material = new THREE.MeshBasicMaterial({ color });
        return this.mesh = new THREE.Mesh(this.geometry, this.material)
    }
}
