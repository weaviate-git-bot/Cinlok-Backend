import axios from "axios";

const mixerApi = axios.create({
  baseURL: process.env.MIXER_BASE_URL || "http://localhost:5000"
});

const upsertUser = async (userId: string, words: string[]) => {
  // To avoid 0 sized array
  if (!words.includes('person')) {
    words.push('person');
  }
  const { data } = await mixerApi.put(`/user/${userId}`, {
    words
  });

  return data;
}

const getNearest = async (userId: number, n: number, omit: number[]) => {
  const { data } = await mixerApi.get('/user/nearest', {
    params: {
      id: userId,
      n,
      omit: omit.join(',')
    }
  })

  return data['nearest'];
}

const MixerService = {
  upsertUser,
  getNearest
}

export default MixerService