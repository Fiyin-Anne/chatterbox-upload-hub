
// Mock API service for chat functionality
// In a real implementation, this would connect to a backend server

export interface ChatResponse {
  id: string;
  content: string;
  type: 'bot';
  timestamp: Date;
}

export const sendMessageToServer = async (
  message: string, 
  documentInfo: { isUploaded: boolean, fileName?: string } = { isUploaded: false }
): Promise<ChatResponse> => {
  // This simulates network latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let botResponse = '';
  
  if (documentInfo.isUploaded) {
    botResponse = `I'm analyzing your document in relation to: "${message}". In a real implementation, this would use AI to process your question against the uploaded document: ${documentInfo.fileName}.`;
  } else {
    // use fetch to call your backend
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message, documentInfo}),
    });
  
    const result = await response.json();
    botResponse = result.response;
  }
  
  return {
    id: Date.now().toString(),
    content: botResponse,
    type: 'bot',
    timestamp: new Date()
  };
};

export const uploadDocumentToServer = async (file: File): Promise<{ success: boolean, message: string }> => {
  // Simulate network latency for file upload
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // TO-DO: upload file OR accepts web links only
  console.log(`Document ${file.name} would be uploaded to server`);
  
  return {
    success: true,
    message: `Document ${file.name} uploaded successfully`
  };
};
