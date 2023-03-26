import axios from "axios";

const mixerApi = axios.create({
  baseURL: process.env.MIXER_BASE_URL || "http://localhost:5000"
});

const upsertUser = async (userId: string, words: string[], channel: string) => {
  // To avoid 0 sized array
  if (!words.includes('person')) {
    words.push('person');
  }
  const { data } = await mixerApi.put(`/user/${userId}`, {
    words,
    channel
  });

  return data;
}

const getNearest = async (userId: number, n: number, omit: number[], channel: string) => {
  const { data } = await mixerApi.get('/user/nearest', {
    params: {
      id: userId,
      n,
      omit: omit.join(','),
      channel
    }
  })

  return data['nearest'] as number[];
}

const clearChannel = async () => {
  const { data } = await mixerApi.delete('/channel/clear');

  return data;
}

const MixerService = {
  upsertUser,
  getNearest,
  clearChannel
}

export default MixerService