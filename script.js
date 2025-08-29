// IMPORTANT: Paste your n8n Production Webhook URL here
const N8N_WEBHOOK_URL = 'https://lgn8nwebhook.up.railway.app/webhook/get-conversation';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Telegram Web App
    Telegram.WebApp.ready();

    const loader = document.getElementById('loader');
    const container = document.getElementById('conversation-container');
    const convoTextElement = document.getElementById('conversation-text');

    // Get the leadId from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const leadId = urlParams.get('leadId');

    if (!leadId) {
        loader.textContent = 'Error: Lead ID not found.';
        return;
    }

    // Fetch the conversation from your n8n backend
    fetch(`${N8N_WEBHOOK_URL}?leadId=${leadId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Assuming the conversation is in a field named "Conversation"
            const conversation = data[0]?.Conversation || 'No conversation found.';
            convoTextElement.textContent = conversation;

            // Hide loader and show content
            loader.style.display = 'none';
            container.style.display = 'block';

            // Adjust the web app's viewport height to fit content
            Telegram.WebApp.expand();
        })
        .catch(error => {
            console.error('Error fetching conversation:', error);
            loader.textContent = 'Failed to load conversation.';
        });
});
