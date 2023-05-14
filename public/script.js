async function sendMessage() {
  // Get references to the input and response elements
  const messageInput = document.getElementById('messageInput');
  const responseText = document.getElementById('responseText');

  // Send a request to the '/chat' endpoint with the user's message as a query parameter
  const response = await fetch(`/chat?message=${encodeURIComponent(messageInput.value)}`);

  // Extract the reply from the response
  const reply = await response.text();

  // Display the reply in the response container
  responseText.textContent = reply;
}
