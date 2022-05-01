class Tile extends THREE.Mesh {

    initialColor
    tilesize
    x
    y
    selected = false
    tileId

    constructor(color, tilesize) {
        super()
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

    setPos(x, y) {
        this.x = x
        this.y = y
        this.position.x = (x * this.tilesize) - (this.tilesize * 4 - this.tilesize / 2);
        this.position.z = (y * this.tilesize) - (this.tilesize * 4 - this.tilesize / 2);
    }

    getPos() {
        return { x: this.x, y: this.y }
    }

    setTileId(id) {
        this.tileId = id
    }

    getTileId() {
        return this.tileId
    }
}
