class DarkModeWidget extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        
        // Create main container
        const wrapper = document.createElement('div');
        wrapper.className = 'dark-mode-container';
        
        // Create toggle switch container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'toggle-switch';
        
        // Create the actual toggle input (hidden)
        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.id = 'dark-mode-toggle';
        toggle.className = 'toggle-input';
        
        // Create the switch slider
        const toggleSlider = document.createElement('label');
        toggleSlider.htmlFor = 'dark-mode-toggle';
        toggleSlider.className = 'toggle-slider';
        
        // Create the switch knob
        const toggleKnob = document.createElement('span');
        toggleKnob.className = 'toggle-knob';
        
        // Create the styles
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-block;
                filter: none !important; /* Ensure widget isn't inverted */
                height: 100%; /* Ensure host takes full height */
            }
            
            .dark-mode-container {
                display: flex;
                justify-content: center; /* Center horizontally */
                align-items: center;     /* Center vertically */
                height: 100%;           /* Take full height of host */
                padding: 8px 12px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                background-color: transparent; /* Transparent background */
            }
            
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            
            .toggle-input {
                opacity: 0;
                width: 0;
                height: 0;
                margin: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.3s;
                border-radius: 24px;
            }
            
            .toggle-knob {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
            }
            
            .toggle-input:checked + .toggle-slider {
                background-color: #2196F3;
            }
            
            .toggle-input:checked + .toggle-slider .toggle-knob {
                transform: translateX(26px);
            }
        `;
        
        // Assemble the components
        toggleSlider.appendChild(toggleKnob);
        toggleContainer.appendChild(toggle);
        toggleContainer.appendChild(toggleSlider);
        
        wrapper.appendChild(toggleContainer);
        
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        
        // Store references for later use
        this.toggle = toggle;
        this.wrapper = wrapper;
        this.toggle.addEventListener('change', this.handleToggle.bind(this));
    }

    // Rest of the methods remain unchanged
    connectedCallback() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true' || this.getAttribute('default-dark') === 'true';
        this.toggle.checked = isDarkMode;
        this.applyDarkMode(isDarkMode);
        
        if (isDarkMode) {
            this.wrapper.classList.add('dark-mode');
        }
    }

    static get observedAttributes() {
        return ['default-dark'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'default-dark') {
            const isDarkMode = newValue === 'true' || localStorage.getItem('darkMode') === 'true';
            this.toggle.checked = isDarkMode;
            this.applyDarkMode(isDarkMode);
            
            if (isDarkMode) {
                this.wrapper.classList.add('dark-mode');
            } else {
                this.wrapper.classList.remove('dark-mode');
            }
        }
    }

    handleToggle() {
        const isDarkMode = this.toggle.checked;
        localStorage.setItem('darkMode', isDarkMode);
        this.applyDarkMode(isDarkMode);
        
        if (isDarkMode) {
            this.wrapper.classList.add('dark-mode');
        } else {
            this.wrapper.classList.remove('dark-mode');
        }
    }

    applyDarkMode(enable) {
        const styleId = 'dark-mode-styles';
        let styleElement = document.getElementById(styleId);

        if (enable) {
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }
            
            styleElement.textContent = `
                html {
                    filter: invert(85%) hue-rotate(180deg) !important;
                }
                
                dark-mode-widget {
                    filter: invert(85%) hue-rotate(-180deg) !important;
                }
                
                img {
                    filter: invert(100%) hue-rotate(-180deg) !important;
                }
                
                video, 
                [data-video],
                [data-hook*="video"],
                [class*="video"],
                [id*="video"],
                .video-container,
                .video-player,
                .video-element,
                iframe[src*="youtube"],
                iframe[src*="vimeo"],
                iframe[src*="wistia"],
                iframe[src*="videopress"],
                iframe[src*="video"],
                object[type*="video"],
                embed[type*="video"] {
                    filter: invert(100%) hue-rotate(-180deg) !important;
                }
                
                [data-hook*="blog"] img,
                [data-hook*="blog"] video,
                [data-hook*="booking"] img,
                [data-hook*="booking"] video,
                [class*="blog"] img, 
                [class*="blog"] video,
                [class*="booking"] img,
                [class*="booking"] video,
                [id*="blog"] img,
                [id*="blog"] video,
                [id*="booking"] img,
                [id*="booking"] video {
                    filter: invert(100%) hue-rotate(-180deg) !important;
                }
                
                iframe {
                    filter: invert(100%) hue-rotate(-180deg) !important;
                }
            `;
        } else {
            if (styleElement) {
                styleElement.remove();
            }
        }
        
        const event = new CustomEvent('darkModeChanged', { 
            detail: { darkMode: enable },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }
}

customElements.define('dark-mode-widget', DarkModeWidget);
