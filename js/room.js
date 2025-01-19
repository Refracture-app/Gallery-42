import { roomConfig } from './config.js';

export class Room {
    constructor(scene, position = { x: 0, y: 0, z: 0 }) {
        this.scene = scene;
        this.position = position;
        this.createWalls();
        this.createFloor();
        this.createCeiling();
    }

    createCeiling() {
        const geometry = new THREE.PlaneGeometry(
            roomConfig.width, 
            roomConfig.depth, 
            roomConfig.gridDivisions * 4, 
            roomConfig.gridDivisions * 4
        );
        const material = new THREE.LineBasicMaterial({ 
            color: roomConfig.wallColor,
            transparent: true,
            opacity: 0.2,
            depthWrite: false,
            renderOrder: 1
        });
        const ceiling = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            material
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(
            this.position.x,
            this.position.y + roomConfig.height/2,
            this.position.z
        );
        ceiling.renderOrder = 1;
        this.scene.add(ceiling);
    }

    createWalls() {
        const material = new THREE.LineBasicMaterial({ color: roomConfig.wallColor });
        const lines = new THREE.Group();

        // Back wall
        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const x = (i / (roomConfig.gridDivisions * 2)) * roomConfig.width - roomConfig.width/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x + this.position.x, -roomConfig.height/2 + this.position.y, -roomConfig.depth/2 + this.position.z),
                new THREE.Vector3(x + this.position.x, roomConfig.height/2 + this.position.y, -roomConfig.depth/2 + this.position.z)
            ]);
            lines.add(new THREE.Line(geometry, material));
        }

        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const y = (i / (roomConfig.gridDivisions * 2)) * roomConfig.height - roomConfig.height/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-roomConfig.width/2 + this.position.x, y + this.position.y, -roomConfig.depth/2 + this.position.z),
                new THREE.Vector3(roomConfig.width/2 + this.position.x, y + this.position.y, -roomConfig.depth/2 + this.position.z)
            ]);
            lines.add(new THREE.Line(geometry, material));
        }

        // Side walls
        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const z = (i / (roomConfig.gridDivisions * 2)) * roomConfig.depth - roomConfig.depth/2;
            // Left wall
            const geometryLeft = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-roomConfig.width/2 + this.position.x, -roomConfig.height/2 + this.position.y, z + this.position.z),
                new THREE.Vector3(-roomConfig.width/2 + this.position.x, roomConfig.height/2 + this.position.y, z + this.position.z)
            ]);
            lines.add(new THREE.Line(geometryLeft, material));
            
            // Right wall
            const geometryRight = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(roomConfig.width/2 + this.position.x, -roomConfig.height/2 + this.position.y, z + this.position.z),
                new THREE.Vector3(roomConfig.width/2 + this.position.x, roomConfig.height/2 + this.position.y, z + this.position.z)
            ]);
            lines.add(new THREE.Line(geometryRight, material));
        }

        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const y = (i / (roomConfig.gridDivisions * 2)) * roomConfig.height - roomConfig.height/2;
            // Left wall
            const geometryLeft = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-roomConfig.width/2 + this.position.x, y + this.position.y, -roomConfig.depth/2 + this.position.z),
                new THREE.Vector3(-roomConfig.width/2 + this.position.x, y + this.position.y, roomConfig.depth/2 + this.position.z)
            ]);
            lines.add(new THREE.Line(geometryLeft, material));
            
            // Right wall
            const geometryRight = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(roomConfig.width/2 + this.position.x, y + this.position.y, -roomConfig.depth/2 + this.position.z),
                new THREE.Vector3(roomConfig.width/2 + this.position.x, y + this.position.y, roomConfig.depth/2 + this.position.z)
            ]);
            lines.add(new THREE.Line(geometryRight, material));
        }

        // Front wall
        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const x = (i / (roomConfig.gridDivisions * 2)) * roomConfig.width - roomConfig.width/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x + this.position.x, -roomConfig.height/2 + this.position.y, roomConfig.depth/2 + this.position.z),
                new THREE.Vector3(x + this.position.x, roomConfig.height/2 + this.position.y, roomConfig.depth/2 + this.position.z)
            ]);
            lines.add(new THREE.Line(geometry, material));
        }

        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const y = (i / (roomConfig.gridDivisions * 2)) * roomConfig.height - roomConfig.height/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-roomConfig.width/2 + this.position.x, y + this.position.y, roomConfig.depth/2 + this.position.z),
                new THREE.Vector3(roomConfig.width/2 + this.position.x, y + this.position.y, roomConfig.depth/2 + this.position.z)
            ]);
            lines.add(new THREE.Line(geometry, material));
        }

        this.scene.add(lines);
    }

    createFloor() {
        const geometry = new THREE.PlaneGeometry(
            roomConfig.width, 
            roomConfig.depth, 
            roomConfig.gridDivisions * 4, 
            roomConfig.gridDivisions * 4
        );
        const material = new THREE.LineBasicMaterial({ 
            color: roomConfig.floorColor,
            transparent: true,
            opacity: roomConfig.floorOpacity
        });
        const floor = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            material
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(
            this.position.x,
            this.position.y - roomConfig.height/2,
            this.position.z
        );
        this.scene.add(floor);
    }
}
