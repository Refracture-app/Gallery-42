import { roomConfig } from './config.js';

export class Room {
    constructor(scene) {
        this.scene = scene;
        this.createWalls();
        this.createFloor();
        this.createCeiling();
    }

    createCeiling() {
        // First approach - try adjusting render order
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
            depthWrite: false,  // Add this
            renderOrder: 1      // Add this
        });
        const ceiling = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            material
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = roomConfig.height/2;
        ceiling.renderOrder = 1;  // Ensure it renders after other elements
        this.scene.add(ceiling);
    }

    createWalls() {
        const material = new THREE.LineBasicMaterial({ color: roomConfig.wallColor });
        const lines = new THREE.Group();

        // Back wall
        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const x = (i / (roomConfig.gridDivisions * 2)) * roomConfig.width - roomConfig.width/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, -roomConfig.height/2, -roomConfig.depth/2),
                new THREE.Vector3(x, roomConfig.height/2, -roomConfig.depth/2)
            ]);
            lines.add(new THREE.Line(geometry, material));
        }

        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const y = (i / (roomConfig.gridDivisions * 2)) * roomConfig.height - roomConfig.height/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-roomConfig.width/2, y, -roomConfig.depth/2),
                new THREE.Vector3(roomConfig.width/2, y, -roomConfig.depth/2)
            ]);
            lines.add(new THREE.Line(geometry, material));
        }

        // Side walls
        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const z = (i / (roomConfig.gridDivisions * 2)) * roomConfig.depth - roomConfig.depth/2;
            // Left wall
            const geometryLeft = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-roomConfig.width/2, -roomConfig.height/2, z),
                new THREE.Vector3(-roomConfig.width/2, roomConfig.height/2, z)
            ]);
            lines.add(new THREE.Line(geometryLeft, material));
            
            // Right wall
            const geometryRight = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(roomConfig.width/2, -roomConfig.height/2, z),
                new THREE.Vector3(roomConfig.width/2, roomConfig.height/2, z)
            ]);
            lines.add(new THREE.Line(geometryRight, material));
        }

        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const y = (i / (roomConfig.gridDivisions * 2)) * roomConfig.height - roomConfig.height/2;
            // Left wall
            const geometryLeft = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-roomConfig.width/2, y, -roomConfig.depth/2),
                new THREE.Vector3(-roomConfig.width/2, y, roomConfig.depth/2)
            ]);
            lines.add(new THREE.Line(geometryLeft, material));
            
            // Right wall
            const geometryRight = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(roomConfig.width/2, y, -roomConfig.depth/2),
                new THREE.Vector3(roomConfig.width/2, y, roomConfig.depth/2)
            ]);
            lines.add(new THREE.Line(geometryRight, material));
        }

        // Front wall
        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const x = (i / (roomConfig.gridDivisions * 2)) * roomConfig.width - roomConfig.width/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, -roomConfig.height/2, roomConfig.depth/2),
                new THREE.Vector3(x, roomConfig.height/2, roomConfig.depth/2)
            ]);
            lines.add(new THREE.Line(geometry, material));
        }

        for (let i = 0; i <= roomConfig.gridDivisions * 2; i++) {
            const y = (i / (roomConfig.gridDivisions * 2)) * roomConfig.height - roomConfig.height/2;
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-roomConfig.width/2, y, roomConfig.depth/2),
                new THREE.Vector3(roomConfig.width/2, y, roomConfig.depth/2)
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
        floor.position.y = -roomConfig.height/2;
        this.scene.add(floor);
    }
}