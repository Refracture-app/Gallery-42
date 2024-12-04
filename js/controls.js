import { roomConfig } from './config.js';

export class Controls {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.velocity = new THREE.Vector3();
        this.jumping = false;
        this.pitch = 0;
        this.yaw = 0;
        
        this.keyState = {};
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.renderer.domElement.addEventListener('click', () => {
            this.renderer.domElement.requestPointerLock();
        });
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement !== this.renderer.domElement) {
                this.resetKeyState();
            }
        });
    }

    resetKeyState() {
        this.keyState = {};
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
    }

    handleKeyDown(e) {
        this.keyState[e.code] = true;
        this.updateMovementState();

        if (e.code === 'Space' && !this.jumping) {
            this.jumping = true;
            this.velocity.y = roomConfig.jumpForce;
        }
    }

    handleKeyUp(e) {
        this.keyState[e.code] = false;
        this.updateMovementState();
    }

    handleMouseMove(e) {
        if (document.pointerLockElement === this.renderer.domElement) {
            const movementX = e.movementX || 0;
            const movementY = e.movementY || 0;
            
            this.yaw -= movementX * roomConfig.mouseSensitivity;
            this.pitch -= movementY * roomConfig.mouseSensitivity;
            this.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.pitch));
            
            this.camera.rotation.order = 'YXZ';
            this.camera.rotation.x = this.pitch;
            this.camera.rotation.y = this.yaw;
        }
    }

    updateMovementState() {
        this.forward = this.keyState['KeyZ'] || this.keyState['KeyW'];
        this.backward = this.keyState['KeyS'];
        this.left = this.keyState['KeyQ'] || this.keyState['KeyA'];
        this.right = this.keyState['KeyD'];
    }

    update() {
        // Apply gravity
        this.velocity.y += roomConfig.gravity;
        this.camera.position.y += this.velocity.y;
        
        // Floor collision
        if (this.camera.position.y < -roomConfig.height/2 + roomConfig.eyeHeight) {
            this.camera.position.y = -roomConfig.height/2 + roomConfig.eyeHeight;
            this.velocity.y = 0;
            this.jumping = false;
        }

        // Movement
        const direction = new THREE.Vector3();
        
        if (this.forward) direction.z -= 1;
        if (this.backward) direction.z += 1;
        if (this.left) direction.x -= 1;
        if (this.right) direction.x += 1;
        
        if (direction.length() > 0) {
            direction.normalize();
            const moveVector = direction.clone();
            moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
            moveVector.multiplyScalar(roomConfig.moveSpeed);
            this.camera.position.add(moveVector);
        }
        
        // Room boundaries
        this.camera.position.x = Math.max(
            -roomConfig.width/2 + roomConfig.boundaryPadding, 
            Math.min(roomConfig.width/2 - roomConfig.boundaryPadding, this.camera.position.x)
        );
        this.camera.position.z = Math.max(
            -roomConfig.depth/2 + roomConfig.boundaryPadding, 
            Math.min(roomConfig.depth/2 - roomConfig.boundaryPadding, this.camera.position.z)
        );
    }
}