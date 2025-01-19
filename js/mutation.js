export class Mutation {
    constructor(scene) {
        this.scene = scene;
        this.setupCanvases();
        this.setupControls();
        this.createUI();
    }

    setupCanvases() {
        this.canvas1 = document.createElement('canvas');
        this.canvas2 = document.createElement('canvas');
        this.canvas1.width = 2560;
        this.canvas1.height = 1440;
        this.canvas2.width = 2560;
        this.canvas2.height = 1440;

        this.ctx1 = this.canvas1.getContext('2d');
        this.ctx2 = this.canvas2.getContext('2d');

        this.texture1 = new THREE.CanvasTexture(this.canvas1);
        this.texture2 = new THREE.CanvasTexture(this.canvas2);
    }

    setupControls() {
        this.controls = [
            {
                canvas: this.canvas1,
                ctx: this.ctx1,
                angle: 0,
                rotationSpeed: 1.0,
                rotationMultiplier: 1,
                flipHorizontal: 1,
                flipVertical: 1,
                cropPosition: 1000,
                verticalPosition: 1000,
                imageScale: 0.3,
                animationFrameId: null,
                img: new Image(),
            },
            {
                canvas: this.canvas2,
                ctx: this.ctx2,
                angle: 0,
                rotationSpeed: 1.0,
                rotationMultiplier: -1,
                flipHorizontal: 1,
                flipVertical: 1,
                cropPosition: 1000,
                verticalPosition: 1000,
                imageScale: 0.3,
                animationFrameId: null,
                img: new Image(),
            }
        ];

        this.scale = -1;
        this.scaleDirection = 1;
        this.zoomSpeed = 0.0005;
        this.maxScale = 1.2;
        this.minScale = 0.8;
    }

    createUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.background = 'rgba(0,0,0,0.7)';
        container.style.padding = '20px';
        container.style.borderRadius = '5px';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.gap = '20px';

        // Create controls for both canvases
        [0, 1].forEach(index => {
            const controlGroup = this.createControlGroup(index);
            container.appendChild(controlGroup);
        });

        document.body.appendChild(container);
    }

    createControlGroup(index) {
        const group = document.createElement('div');
        group.style.display = 'flex';
        group.style.flexDirection = 'column';
        group.style.gap = '10px';

        // Upload button
        const uploadButton = document.createElement('input');
        uploadButton.type = 'file';
        uploadButton.style.color = 'white';
        uploadButton.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.loadImage(e.target.files[0], index);
            }
        });

        // Rotation controls
        const rotationControl = this.createSlider('Rotation', 0, 360, 1, 0, (value) => {
            this.controls[index].angle = parseFloat(value);
        });

        // Rotation speed
        const speedControl = this.createSlider('Speed', 0.1, 5.0, 0.1, 1.0, (value) => {
            this.controls[index].rotationSpeed = parseFloat(value);
        });

        // Scale
        const scaleControl = this.createSlider('Scale', 0.3, 2.0, 0.1, 0.3, (value) => {
            this.controls[index].imageScale = parseFloat(value);
        });

        // Position controls
        const xControl = this.createSlider('X Position', 10, 2000, 1, 1000, (value) => {
            this.controls[index].cropPosition = parseFloat(value);
        });

        const yControl = this.createSlider('Y Position', 10, 2000, 1, 1000, (value) => {
            this.controls[index].verticalPosition = parseFloat(value);
        });

        // Flip buttons
        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '10px';

        const flipH = this.createButton('Flip H', () => {
            this.controls[index].flipHorizontal *= -1;
        });

        const flipV = this.createButton('Flip V', () => {
            this.controls[index].flipVertical *= -1;
        });

        const direction = this.createButton('Direction', () => {
            this.controls[index].rotationMultiplier *= -1;
        });

        buttonGroup.appendChild(flipH);
        buttonGroup.appendChild(flipV);
        buttonGroup.appendChild(direction);

        // Add all controls to group
        group.appendChild(uploadButton);
        group.appendChild(rotationControl);
        group.appendChild(speedControl);
        group.appendChild(scaleControl);
        group.appendChild(xControl);
        group.appendChild(yControl);
        group.appendChild(buttonGroup);

        return group;
    }

    createSlider(label, min, max, step, defaultValue, onChange) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';

        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.color = 'white';
        labelEl.style.minWidth = '100px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = defaultValue;
        slider.addEventListener('input', (e) => onChange(e.target.value));

        container.appendChild(labelEl);
        container.appendChild(slider);
        return container;
    }

    createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '5px 10px';
        button.style.backgroundColor = 'transparent';
        button.style.color = 'white';
        button.style.border = '1px solid white';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        return button;
    }

    drawImage(control) {
        const { ctx, angle, img, flipHorizontal, flipVertical, cropPosition, verticalPosition, imageScale } = control;
        const width = img.width;
        const height = img.height;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.clip();

        ctx.translate(cropPosition / 4, verticalPosition / 4);
        ctx.scale(imageScale * flipHorizontal, imageScale * flipVertical);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-width / 2, -height / 2);
        ctx.drawImage(img, 0, 0, width, height);

        ctx.restore();

        this.mirrorQuadrants(ctx);
    }

    mirrorQuadrants(ctx) {
        // Mirror to top right
        ctx.save();
        ctx.beginPath();
        ctx.rect(ctx.canvas.width / 2, 0, ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.clip();
        ctx.translate(ctx.canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.restore();

        // Mirror to bottom half
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height / 2);
        ctx.clip();
        ctx.translate(0, ctx.canvas.height);
        ctx.scale(1, -1);
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.restore();
    }

    animate() {
        this.controls.forEach(control => {
            control.angle += control.rotationSpeed * control.rotationMultiplier;
            this.drawImage(control);
            
            if (control === this.controls[0]) {
                this.texture1.needsUpdate = true;
            } else {
                this.texture2.needsUpdate = true;
            }
        });
    }

    loadImage(input, controlIndex) {
        const control = this.controls[controlIndex];
        if (typeof input === 'string') {
            control.img.src = input;
        } else if (input instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                control.img.src = e.target.result;
            };
            reader.readAsDataURL(input);
        }
        
        control.img.onload = () => {
            if (control.animationFrameId) {
                cancelAnimationFrame(control.animationFrameId);
            }
            this.drawImage(control);
        };
    }

    getTexture(index) {
        return index === 0 ? this.texture1 : this.texture2;
    }

    update() {
        this.animate();
    }
}
