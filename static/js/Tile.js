class Tile extends THREE.Mesh {

    initialColor
    tilesize
    x
    y
    selected = false
    tileId

    constructor(id, color, tilesize) {
        super()
        this.tileId = id
        this.tilesize = tilesize
        this.initialColor = color
        this.geometry = new THREE.BoxGeometry(this.tilesize, 3, this.tilesize);
        this.material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('gfx/wood.png'),
            color
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material)
    }

    select() {
        this.material.color.setHex(0xaaff00)
        this.selected = true
    }

    unselect() {
        this.material.color.setHex(this.initialColor)
        this.selected = false
    }

    getSelected() {
        return this.selected
    }

    getPos() {
        return { x: (this.position.x + 42) / 12, y: (this.position.z + 42) / 12 }
    }

    getTileId() {
        return this.tileId
    }
}
