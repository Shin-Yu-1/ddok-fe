import { z } from 'zod';

import ChatRoomType from '@/features/Chat/enums/ChatRoomType.enum';
import ContentType from '@/features/Chat/enums/ContentType.enum';
import Role from '@/features/Chat/enums/Role.enum';
import { apiResponseSchema } from '@/schemas/api.schema';

/* Pagination */
export const paginationSchema = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
});
export type Pagination = z.infer<typeof paginationSchema>;

/* Items */
export const privateChatListItemSchema = z.object({
  roomId: z.number(),
  roomType: z.literal(ChatRoomType.PRIVATE),
  isPinned: z.boolean(),
  otherUser: z.object({
    id: z.number(),
    nickname: z.string(),
    profileImage: z.string().nullable(),
  }),
  updatedAt: z.string(),
});

export const teamChatListItemSchema = z.object({
  roomId: z.number(),
  roomType: z.literal(ChatRoomType.GROUP),
  isPinned: z.boolean(),
  memberCount: z.number(),
  name: z.string(),
  myRole: z.nativeEnum(Role),
  owner: z.object({
    id: z.number(),
    nickname: z.string(),
    profileImage: z.string().nullable(),
  }),
  updatedAt: z.string(),
});

export const chatMessageSchema = z.object({
  contentText: z.string(),
  contentType: z.nativeEnum(ContentType),
  createdAt: z.string(),
  fileUrl: z.string().nullable(),
  messageId: z.number(),
  roomId: z.number(),
  senderId: z.number(),
  senderNickname: z.string(),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

/* Discriminated Union for items */
export const chatListItemSchema = z.discriminatedUnion('roomType', [
  privateChatListItemSchema,
  teamChatListItemSchema,
]);
export type ChatListItem = z.infer<typeof chatListItemSchema>;

/* Response Data (공통) */
export const chatListResponseDataSchema = z.object({
  pagination: paginationSchema,
  chats: z.array(chatListItemSchema),
});

/* Final API Schema */
export const ChatListApiResponseSchema = apiResponseSchema(chatListResponseDataSchema);
export type ChatListApiResponse = z.infer<typeof ChatListApiResponseSchema>;
export const ChatMessageApiResponseSchema = apiResponseSchema(chatMessageSchema);
export type ChatMessageApiResponse = z.infer<typeof ChatMessageApiResponseSchema>;
