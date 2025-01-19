import { Room } from './room.js';
import { Controls } from './controls.js';
import { roomConfig } from './config.js';
import { Artwork } from './artwork.js';

class Button {
    constructor(scene, position, onClick) {
        this.scene = scene;
        const geometry = new THREE.BoxGeometry(2, 4, 0.5);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x4444ff,
            transparent: true,
            opacity: 0.8
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.onClick = onClick;
        
        scene.add(this.mesh);
        this.addInteraction();
    }

    addInteraction() {
        this.raycaster = new THREE.Raycaster();
        document.addEventListener('click', (event) => {
            if (document.pointerLockElement) {
                this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.scene.getObjectByName('mainCamera'));
                const intersects = this.raycaster.intersectObject(this.mesh);
                if (intersects.length > 0) {
                    this.onClick();
                }
            }
        });
    }
}

class App {
    constructor() {
        this.setup();
        this.createRooms();
        this.setupControls();
        this.animate();
        this.handleResize();
        this.setupArtwork();
        this.setupButton();
    }

    setup() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.camera.name = 'mainCamera';
        document.body.appendChild(this.renderer.domElement);
    }

    createRooms() {
        // Create first room (original position)
        this.room1 = new Room(this.scene);
        
        // Create second room (offset by width + spacing)
        const spacing = 10; // Space between rooms
        this.room2 = new Room(this.scene, { 
            x: roomConfig.width + spacing, 
            y: 0, 
            z: 0 
        });

        // Start in room 1
        this.currentRoom = 1;
        this.positionCamera();
    }

    setupButton() {
        const buttonPosition = new THREE.Vector3(
            0,                    // Center
            -roomConfig.height/4, // At eye level
            roomConfig.depth/2 - 4 // Near back wall
        );
        
        new Button(this.scene, buttonPosition, () => {
            this.switchRoom();
        });
    }

    switchRoom() {
        this.currentRoom = this.currentRoom === 1 ? 2 : 1;
        this.positionCamera();
    }

    positionCamera() {
        const xOffset = this.currentRoom === 1 ? 0 : roomConfig.width + 10;
        this.camera.position.set(
            xOffset,
            -roomConfig.height/4 + roomConfig.eyeHeight,
            roomConfig.depth/2 - 2
        );
    }

    setupControls() {
        this.controls = new Controls(this.camera, this.renderer);
        // Modify boundary checking in Controls class to account for current room
        this.controls.getRoomBoundaries = () => {
            const xOffset = this.currentRoom === 1 ? 0 : roomConfig.width + 10;
            return {
                minX: xOffset - roomConfig.width/2 + roomConfig.boundaryPadding,
                maxX: xOffset + roomConfig.width/2 - roomConfig.boundaryPadding,
                minZ: -roomConfig.depth/2 + roomConfig.boundaryPadding,
                maxZ: roomConfig.depth/2 - roomConfig.boundaryPadding
            };
        };
    }

    setupArtwork() {
        this.artwork = new Artwork(this.scene);
        
        // Back wall artwork
        const backWallConfig = {
            width: 30,
            position: { 
                x: 0,
                y: 0,
                z: -roomConfig.depth/2 + 1
            },
            rotation: { x: 0, y: 0, z: 0 },
            preserveTransparency: true,
            backgroundColor: 0x000000
        };
        this.artwork.addArtwork('assets/words.webp', backWallConfig);
    
        // Right wall artwork
        let rightWallConfig = {
            width: 55,
            position: {
                x: roomConfig.width/2 - 0.5,
                y: 0,
                z: 0
            },
            rotation: { x: 0, y: -Math.PI/2, z: 0 },
            preserveTransparency: true,
            backgroundColor: 0x000000
        };
        this.artwork.addArtwork('assets/right wall sequence.webp', rightWallConfig);
    
        // Left wall artwork
        let leftWallConfig = {
            width: 55,
            position: {
                x: -roomConfig.width/2 + 0.5,
                y: 0,
                z: 0
            },
            rotation: { x: 0, y: Math.PI/2, z: 0 },
            preserveTransparency: true,
            backgroundColor: 0x000000
        };
        this.artwork.addArtwork('assets/left wall sequence.webp', leftWallConfig);

        const backWallConfig2 = {
            width: 25,
            position: { 
                x: 0,
                y: 0,
                z: roomConfig.depth/2 - 1
            },
            rotation: { x: 0, y: Math.PI, z: 0 },
            preserveTransparency: true,
            backgroundColor: 0x000000
        };
        this.artwork.addArtwork('assets/back wall.webp', backWallConfig2);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the application
new App();
