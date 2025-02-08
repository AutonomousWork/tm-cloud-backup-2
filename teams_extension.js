// Hide Teams Extension for TypingMind
// Hides the Teams icon from the navigation bar

export default {
    name: 'Hide Teams',
    version: '1.0.0',
    description: 'Hides the Teams icon from the navigation bar',
    author: 'Autonomous Work',

    async onload() {
        // Find and hide the Teams button
        const hideTeams = () => {
            const teamsButton = document.querySelector('button[data-element-id="workspace-tab-teams"]');
            if (teamsButton) {
                teamsButton.style.setProperty('display', 'none', 'important');
            }
        };

        // Initial hide
        hideTeams();

        // Create observer to handle dynamically loaded content
        this.observer = new MutationObserver(hideTeams);
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    onunload() {
        // Stop observing
        if (this.observer) {
            this.observer.disconnect();
        }

        // Show the Teams button again
        const teamsButton = document.querySelector('button[data-element-id="workspace-tab-teams"]');
        if (teamsButton) {
            teamsButton.style.removeProperty('display');
        }
    }
}; 
