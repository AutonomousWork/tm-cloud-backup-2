// n8n-ai-agent-extension.js
TypingMind.registerExtension({
  manifest: {
    "id": "n8n-ai-agent-extension",
    "name": "n8n AI Agent Extension",
    "version": "1.0.1",
    "description": "Multiple custom AI agents integration with n8n webhooks",
    "author": "Your Name",
    "extension": {
      "models": {
        "type": "dynamic",
        "defaultModels": [
          {
            "id": "n8n-agent-1",
            "name": "n8n AI Agent 1",
            "description": "First custom AI agent running in n8n",
            "type": "custom",
            "configurable": true,
            "fields": [
              {
                "id": "webhookUrl",
                "label": "Webhook URL",
                "type": "text",
                "required": true,
                "placeholder": "https://your-n8n-instance/webhook/..."
              },
              {
                "id": "apiKey",
                "label": "API Key (optional)",
                "type": "text",
                "required": false,
                "placeholder": "Enter API key if required"
              },
              {
                "id": "modelName",
                "label": "Model Name",
                "type": "text",
                "required": true,
                "placeholder": "Enter a unique name for this agent"
              }
            ]
          }
        ],
        "addNewModelTemplate": {
          "id": "n8n-agent-{{index}}",
          "name": "n8n AI Agent {{index}}",
          "description": "Custom AI agent running in n8n",
          "type": "custom",
          "configurable": true,
          "fields": [
            {
              "id": "webhookUrl",
              "label": "Webhook URL",
              "type": "text",
              "required": true,
              "placeholder": "https://your-n8n-instance/webhook/..."
            },
            {
              "id": "apiKey",
              "label": "API Key (optional)",
              "type": "text",
              "required": false,
              "placeholder": "Enter API key if required"
            },
            {
              "id": "modelName",
              "label": "Model Name",
              "type": "text",
              "required": true,
              "placeholder": "Enter a unique name for this agent"
            }
          ]
        }
      }
    }
  },

  fetchCompletion: async ({
    modelId,
    messages,
    settings,
    onStream,
    onComplete,
    onError
  }) => {
    // Check if this is one of our n8n agent models
    if (!modelId.startsWith('n8n-agent-')) return false;

    try {
      // Get configuration from settings
      const webhookUrl = settings.webhookUrl;
      const apiKey = settings.apiKey;

      if (!webhookUrl) {
        throw new Error('Webhook URL is not configured');
      }

      // Prepare the payload
      const payload = {
        messages: messages,
        prompt: messages[messages.length - 1].content,
        timestamp: new Date().toISOString(),
        modelId: modelId // Include model ID for reference
      };

      // Set up headers
      const headers = {
        'Content-Type': "application/json"
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      // Make the webhook call
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status}`);
      }

      // Handle streaming response
      if (response.body && onStream) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          onStream(chunk);
        }
        onComplete();
      } else {
        // Handle non-streaming response
        const data = await response.json();
        const content = data.response || data.message || JSON.stringify(data);
        onComplete(content);
      }

    } catch (error) {
      onError(error.message || 'Error communicating with n8n AI agent');
    }

    return true;
  },

  // Optional: Customize model display name based on user input
  getModelDisplayName: (modelId, settings) => {
    if (!modelId.startsWith('n8n-agent-')) return null;
    return settings.modelName || `n8n AI Agent (${modelId})`;
  }
});
