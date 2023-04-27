import weaviate from "./weaviate";

type UserMixer = {
  id: number;
  words: string[];
  channel: string;
}

const upsertUser = async (userId: string, words: string[], channel: string) => {
  // To avoid 0 sized array
  if (!words.includes("person")) {
    words.push("person");
  }
  
  const data = await weaviate.data
    .creator()
    .withClassName("Person")
    .withProperties({
      user_id: userId,
      words,
      channel
    })
    .do();

  return data;
};

const getNearest = async (userId: number, n: number, omit: number[], channel: string) => {
  const user = await weaviate.graphql
    .get()
    .withClassName("Person")
    .withFields("user_id channel _additional {id}")
    .withWhere({
      operator: "Equal",
      path: ["user_id"],
      valueString: userId.toString()
    })
    .do();

  const raw = await weaviate.graphql
    .get()
    .withClassName("Person")
    .withFields("user_id")
    .withNearObject({id: user.data.Get.Person[0]._additional.id})
    .withLimit(n + omit.length)
    .withWhere({
      operator: "Equal",
      path: ["channel"],
      valueString: channel
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
  const userBatch = users.map(user => {
    return {
      class: "Person",
      properties: {
        user_id: user.id,
        tags: user.words,
        channel: user.channel,
      }
    };
  });
  
  if (userBatch.length === 0) {
    return;
  }

  const data = userBatch.map(async user => {
    return upsertUser(user.properties.user_id.toString(), user.properties.tags, user.properties.channel);
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