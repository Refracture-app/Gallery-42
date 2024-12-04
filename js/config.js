export const roomConfig = {
    // Room dimensions
    width: 40,
    height: 20,
    depth: 80,
    
    // Grid settings
    gridDivisions: 20,
    
    // Colors
    floorColor: 0x202020,
    wallColor: 0x404040,
    floorOpacity: 0.3,
    
    // Physics and controls
    moveSpeed: 0.1,
    jumpForce: 2,
    gravity: -0.015,
    mouseSensitivity: 0.002,  
    
    // Camera settings
    eyeHeight: 3,  // Camera height from floor
    
    // Boundaries
    boundaryPadding: 1  // Distance from walls player can't pass
};