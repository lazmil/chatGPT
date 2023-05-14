async function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const responseText = document.getElementById('responseText');

  const response = await fetch(`/chat?message=${encodeURIComponent(messageInput.value)}`);
  const reply = await response.text();

  responseText.textContent = reply;
}
