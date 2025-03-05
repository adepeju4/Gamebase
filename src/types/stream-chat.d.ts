declare module 'stream-chat-react' {
  export function useChatContext(): {
    client: {
      userID: string;
      user: {
        name?: string;
        id?: string;
        [key: string]: any;
      };
      // Add other properties as needed
    };
    // Add other properties as needed
  };
  
  // Add other exports as needed
}

// Add declarations for other external modules as needed 