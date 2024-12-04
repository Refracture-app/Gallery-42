import { Room } from './room.js';
import { Controls } from './controls.js';
import { roomConfig } from './config.js';
import { Artwork } from './artwork.js';
import { Mutation } from './mutation.js';

class App {
    constructor() {
        this.setup();
        this.createRoom();
        this.setupControls();
        this.setupMutation();  // Added mutation setup
        this.animate();
        this.handleResize();
        this.setupArtwork();
    }

    setup() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        document.body.appendChild(this.renderer.domElement);
    }

    createRoom() {
        this.room = new Room(this.scene);
        this.camera.position.set(
            0, 
            -roomConfig.height/7 + roomConfig.eyeHeight, 
            roomConfig.depth/3
        );
    }

    setupControls() {
        this.controls = new Controls(this.camera, this.renderer);
    }

    setupMutation() {
        this.mutation = new Mutation(this.scene);
        
        // Create two planes for the mutation effects
        const planeGeometry = new THREE.PlaneGeometry(15, 15);
        
        // First mutation plane
        const material1 = new THREE.MeshBasicMaterial({
            map: this.mutation.getTexture(0),
            transparent: true
        });
        const mutationMesh1 = new THREE.Mesh(planeGeometry, material1);
        mutationMesh1.position.set(
            -roomConfig.width/2 + 0.1,  // Left wall
            0,                          // Center height
            -roomConfig.depth/4         // Front quarter
        );
        mutationMesh1.rotation.y = Math.PI / 2;  // Face inward
        this.scene.add(mutationMesh1);

        // Second mutation plane
        const material2 = new THREE.MeshBasicMaterial({
            map: this.mutation.getTexture(1),
            transparent: true
        });
        const mutationMesh2 = new THREE.Mesh(planeGeometry, material2);
        mutationMesh2.position.set(
            -roomConfig.width/2 + 0.1,  // Left wall
            0,                          // Center height
            roomConfig.depth/4          // Back quarter
        );
        mutationMesh2.rotation.y = Math.PI / 2;  // Face inward
        this.scene.add(mutationMesh2);

        // Store meshes for potential future use
        this.mutationMeshes = [mutationMesh1, mutationMesh2];
    }

    setupArtwork() {
        this.artwork = new Artwork(this.scene);
        const artworkConfig = {
            width: 35,
            position: { 
                x: 0,
                y: -1,
                z: -roomConfig.depth/2 + 1
            },
            rotation: { x: 0, y: 0, z: 0 },
            preserveTransparency: true,
            backgroundColor: 0x000000
        };
        
        this.artwork.addArtwork('assets/groupII.webp', artworkConfig);
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
        if (this.mutation) {
            this.mutation.update();
        }
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the application
new App();