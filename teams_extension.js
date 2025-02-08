// Hide Teams Extension for TypingMind
// Hides the Teams icon from the navigation bar

export default {
    name: 'Hide Teams',
    version: '1.0.0',
    description: 'Hides the Teams icon from the navigation bar',
    author: 'Autonomous Work',

    async onload() {
        // Add CSS to hide the Teams menu item
        const style = document.createElement('style');
        style.textContent = `
            /* Hide Teams icon in the navbar */
            div[role="navigation"] a[href="/teams"],
            div[role="navigation"] a:has(img[alt="Teams"]),
            div[role="navigation"] div:has(> a[href="/teams"]) {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    },

    onunload() {
        // Remove any added styles when extension is disabled
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent.includes('Teams')) {
                style.remove();
            }
        });
    }
}; 
