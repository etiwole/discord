import {db} from "@/lib/db";

export const findOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  let conversation = await findConversation(memberOneId, memberTwoId)
    || await findConversation(memberTwoId, memberOneId);

  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }

  return conversation;
}

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })
  } catch (err) {
    return null;
  }
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  return db.conversation.findFirst({
    where: {
      AND: [
        {memberOneId},
        {memberTwoId}
      ]
    },
    include: {
      memberOne: {
        include: {
          profile: true
        }
      },
      memberTwo: {
        include: {
          profile: true
        }
      }
    }
  });
}