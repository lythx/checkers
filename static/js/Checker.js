class Checker extends THREE.Mesh {

    initialColor
    tilesize
    player
    checkerId

    constructor(id, player, color, tilesize) {
        super()
        this.checkerId = id
        this.player = player
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

    getPos() {
        return { x: (this.position.x + 42) / 12, y: (this.position.z + 42) / 12 }
    }

    getCheckerId() {
        return this.checkerId
    }

    getPlayer() {
        return this.player
    }
}
