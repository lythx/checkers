class Checker extends THREE.Mesh {

    initialColor
    tilesize
    x
    y
    checkerId

    constructor(color, tilesize) {
        super()
        this.tilesize = tilesize
        this.initialColor = color
        this.geometry = new THREE.CylinderGeometry(5, 5, 3, 32);
        this.material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('gfx/wood.png'),
            color
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.position.y = 3
    }

    select() {
        this.material.color.setHex(0xffff00)
    }

    unselect() {
        this.material.color.setHex(this.initialColor)
    }

    setPos(x, y) {
        this.x = x
        this.y = y
        this.position.x = (x * this.tilesize) - (this.tilesize * 4 - this.tilesize / 2);
        this.position.z = (y * this.tilesize) - (this.tilesize * 4 - this.tilesize / 2);
    }

    updatePos() {
        this.x = (this.position.x + 42) / 12
        this.y = (this.position.z + 42) / 12
    }

    getPos() {
        return { x: this.x, y: this.y }
    }

    setCheckerId(id) {
        this.checkerId = id
    }

    getCheckerId() {
        return this.checkerId
    }
}
