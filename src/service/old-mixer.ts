import axios from "axios";

const mixerApi = axios.create({
  baseURL: process.env.MIXER_BASE_URL || "http://localhost:5000"
});

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
  const { data } = await mixerApi.put(`/user/${userId}`, {
    words,
    channel
  });

  return data;
};

const getNearest = async (userId: number, n: number, omit: number[], channel: string) => {
  const { data } = await mixerApi.get("/user/nearest", {
    params: {
      id: userId,
      n,
      omit: omit.join(","),
      channel
    }
  });

  return data["nearest"] as number[];
};

const clearChannel = async () => {
  const { data } = await mixerApi.delete("/channel/clear");

  return data;
};

const upsertBatch = async (users: UserMixer[]) => {
  console.log({ users });
  const { data } = await mixerApi.post("/user/batch", {
    users
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