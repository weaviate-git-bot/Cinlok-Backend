import weaviate from "./weaviate";
import type { Channel, Tag, User, UserChannel, UserTag } from "@prisma/client";

type UserMixer = User & {
  userTag: (UserTag & {
    tag: Tag;
  })[];
  userChannel: (UserChannel & {
    channel: Channel;
  })[];
}

const upsertUser = async (user: UserMixer, words: string[], channel: string) => {
  // To avoid 0 sized array
  if (!words.includes("person")) {
    words.push("person");
  }
  
  const data = await weaviate.data
    .creator()
    .withClassName("Person")
    .withProperties({
      user_id: user.id.toString(),
      sex: user.sex,
      words,
      channel
    })
    .do();

  return data;
};

const getNearest = async (user: UserMixer, n: number, omit: number[], channel: string) => {
  const userData = await weaviate.graphql
    .get()
    .withClassName("Person")
    .withFields("user_id channel _additional {id}")
    .withWhere({
      operator: "Equal",
      path: ["user_id"],
      valueString: user.id.toString()
    })
    .do();

  const raw = await weaviate.graphql
    .get()
    .withClassName("Person")
    .withFields("user_id")
    .withNearObject({id: userData.data.Get.Person[0]._additional.id})
    .withLimit(n + omit.length)
    .withWhere({
      operator: "And",
      operands: [
        {
          operator: "Equal",
          path: ["channel"],
          valueString: channel
        },
        { // TODO: Improvement based on preferences
          operator: "NotEqual",
          path: ["sex"],
          valueString: user.sex
        }
      ]
    })
    .do();

  const data = raw.data.Get.Person
    .map((person: any) => parseInt(person.user_id))
    .filter((id: number) => !omit.includes(id));
  return data as number[];  
};

const clearChannel = async () => {
  // Delete all objects
  const data = await weaviate.batch
    .objectsBatchDeleter()
    .withClassName("Person")
    .withOutput("verbose")
    .withWhere({
      operator: "NotEqual",
      path: ["user_id"],
      valueString: "-1"
    })
    .do();

  return data;
};

const upsertBatch = async (users: UserMixer[]) => {
  // const userBatch = users.map(user => {
  //   return {
  //     class: "Person",
  //     properties: {
  //       user_id: user.id,
  //       tags: user.userTag.map(tag => tag.tag.tag),
  //       channel: user.universitySlug,
  //     }
  //   };
  // });
  
  if (users.length === 0) {
    return;
  }

  const data = users.map(async user => {
    if (!user.userChannel || !user.userChannel[0]) return null;
    return upsertUser(user, user.userTag.map(tag => tag.tag.tag), user.userChannel[0].channel.name);
  });

  return data;
};

const MixerService = {
  upsertUser,
  getNearest,
  clearChannel,
  upsertBatch,
};

export default MixerService;