// Hide Teams Extension for TypingMind
// Hides the Teams icon from the navigation bar

export default {
    name: 'Hide Teams',
    version: '1.0.0',
    description: 'Hides the Teams icon from the navigation bar',
    author: 'Autonomous Work',

    async onload() {
        const button = document.querySelector('[data-element-id="workspace-tab-teams"]');
        if (button) {
            button.style.display = 'none';
        }
    },

    onunload() {
        const button = document.querySelector('[data-element-id="workspace-tab-teams"]');
        if (button) {
            button.style.display = '';
        }
    }
};
