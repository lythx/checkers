class Tile extends THREE.Mesh {
    constructor(color, size) {
        super()
        this.geometry = new THREE.BoxGeometry(size, 3, size);
        this.material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('gfx/wood.png'),
            color
        });
        return this.mesh = new THREE.Mesh(this.geometry, this.material)
    }
}
