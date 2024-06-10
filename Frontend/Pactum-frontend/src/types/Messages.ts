export type Message = {
    id: number;
    chatId: number;
    senderId: number;
    message: string;
    createdAt: string;
  }
  
export type MessageListProps = {
    chatId: number;
    loading: boolean;
    error: string | null;
    messages: Message[];
  }
  export type Chat = {
    id: number;
    supplierId: number;
    supplierName: string;
    customerName: string;
    customerId: number;
    createdAt: string;
  }
  export type ChatCreation = {
    supplierId: number;
    customerId: number;
  }