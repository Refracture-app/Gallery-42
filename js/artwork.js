import { roomConfig } from './config.js';

export class Artwork {
    constructor(scene) {
        this.scene = scene;
        this.artworks = new Map();
        this.textureLoader = new THREE.TextureLoader();
    }

    addArtwork(imageUrl, config) {
        // Default values with proper type declaration
        const defaultConfig = {
            width: 8,
            position: { x: 0, y: 0, z: -roomConfig.depth/2 + 0.1 },
            rotation: { x: 0, y: 0, z: 0 },
            backgroundColor: 0x000000,
            preserveTransparency: false
        };

        // Merge provided config with defaults
        const finalConfig = { ...defaultConfig, ...config };

        this.textureLoader.load(imageUrl, (texture) => {
            const aspectRatio = texture.image.width / texture.image.height;
            const height = finalConfig.width / aspectRatio;
            
            const geometry = new THREE.PlaneGeometry(finalConfig.width, height);
            const material = new THREE.MeshBasicMaterial({ 
                map: texture,
                side: THREE.DoubleSide,
                transparent: finalConfig.preserveTransparency,
                color: finalConfig.preserveTransparency ? 0xffffff : finalConfig.backgroundColor
            });
            
            const artwork = new THREE.Mesh(geometry, material);
            
            artwork.position.set(
                finalConfig.position.x, 
                finalConfig.position.y, 
                finalConfig.position.z
            );
            artwork.rotation.set(
                finalConfig.rotation.x, 
                finalConfig.rotation.y, 
                finalConfig.rotation.z
            );
            
            this.artworks.set(imageUrl, artwork);
            this.scene.add(artwork);
        });
    }

    removeArtwork(imageUrl) {
        const artwork = this.artworks.get(imageUrl);
        if (artwork) {
            this.scene.remove(artwork);
            this.artworks.delete(imageUrl);
        }
    }
}