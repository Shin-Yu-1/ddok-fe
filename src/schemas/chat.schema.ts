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
  hasUnreadMessages: z.boolean(),
  otherUser: z.object({
    id: z.number(),
    nickname: z.string(),
    profileImage: z.string().nullable(),
    temperature: z.number(),
  }),
  updatedAt: z.string(),
});

export const teamChatListItemSchema = z.object({
  roomId: z.number(),
  teamId: z.number(),
  roomType: z.literal(ChatRoomType.GROUP),
  hasUnreadMessages: z.boolean(),
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

export const ChatRoomMemberSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImage: z.string(),
  role: z.string(),
  joinedAt: z.string(),
});
export type ChatRoomMember = z.infer<typeof ChatRoomMemberSchema>;

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
export const chatMessageListResponseDataSchema = z.object({
  pagination: paginationSchema,
  messages: z.array(chatMessageSchema),
});
export const chatMemberListResponseDataSchema = z.object({
  totalCount: z.number(),
  members: z.array(ChatRoomMemberSchema),
});
export const chatMessageLastReadSchema = z.object({
  messageId: z.number(),
});
export type ChatMessageLastRead = z.infer<typeof chatMessageLastReadSchema>;

/* Final API Schema */
export const ChatListApiResponseSchema = apiResponseSchema(chatListResponseDataSchema);
export type ChatListApiResponse = z.infer<typeof ChatListApiResponseSchema>;
export const ChatMessageApiResponseSchema = apiResponseSchema(chatMessageListResponseDataSchema);
export type ChatMessageApiResponse = z.infer<typeof ChatMessageApiResponseSchema>;
export const ChatRoomMemberApiResponseSchema = apiResponseSchema(chatMemberListResponseDataSchema);
export type ChatRoomMemberApiResponse = z.infer<typeof ChatRoomMemberApiResponseSchema>;
export const ChatMessageLastReadApiResponseSchema = apiResponseSchema(chatMessageLastReadSchema);
export type ChatMessageLastReadApiResponse = z.infer<typeof ChatMessageLastReadApiResponseSchema>;
