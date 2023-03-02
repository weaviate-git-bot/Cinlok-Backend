import { PrismaClient, SexType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const dirtyGeneratedTags = [
  ...new Set(
    Array(10)
      .fill({})
      .map(() => {
        return faker.lorem.word();
      })
  ),
];

const generatedTags = Array.from(new Set(dirtyGeneratedTags));

const promiseGeneratedUsers = Array(10)
  .fill({})
  .map(async () => {
    const sex = Math.random() > 0.5 ? SexType.MALE : SexType.FEMALE;
    const photos = Array(5)
      .fill({})
      .map(() => {
        return faker.image.imageUrl() + "/" + faker.random.numeric(5);
      });
    
    const password = "password";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: hash,
      salt,
      name: faker.name.firstName(),
      description: faker.lorem.paragraph(),
      dateOfBirth: faker.date.birthdate(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      sex,
      photos,
    };
  });

const clearDB = () => {
  return prisma.$transaction([
    prisma.userTag.deleteMany({}),
    prisma.tag.deleteMany({}),
    prisma.userPhoto.deleteMany({}),
    prisma.account.deleteMany({}),
    prisma.pair.deleteMany({}),
    prisma.match.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);
}

const main = async () => {
  console.log(`Clearing Database ...`);
  clearDB();

  console.log(`Start seeding ...`);

  const createdTags = await Promise.all(
    generatedTags.map(async (tag) => {
      console.log(`Creating tag with name: ${tag}`);
      const createdTag = await prisma.tag.create({
        data: {
          tag,
        },
      });
      console.log(`Created tag with id: ${createdTag.id}`);
      return createdTag;
    })
  );

  const generatedUsers = await Promise.all(promiseGeneratedUsers);

  const createdUsers = await Promise.all(
    generatedUsers.map(async (u) => {
      console.log(`Creating user: ${JSON.stringify(u)}`);
      const user = await prisma.user.create({
        data: {
          name: u.name,
          description: u.description,
          dateOfBirth: u.dateOfBirth,
          latitude: parseFloat(u.latitude),
          longitude: parseFloat(u.longitude),
          sex: u.sex,
        },
      });

      const account = await prisma.account.create({
        data: {
          id: user.id,
          email: u.email,
          username: u.username,
          password: u.password,
          salt: u.salt,
        },
      });

      const dirtyTags = generatedTags
        .filter(() => {
          return Math.random() > 0.5;
        })
        .map((e) => {
          return createdTags.find((t) => t.tag === e)?.id;
        });
      const confirmedTags = dirtyTags.filter(
        (e) => !!e
      ) as number[];

      const tags = await Promise.all(
        confirmedTags.map(async (tagId) => {
          const createdUserTag = await prisma.userTag.create({
            data: {
              userId: user.id,
              tagId,
            },
          });
          return createdUserTag;
        })
      );

      const photos = await Promise.all(
        u.photos.map(async (photo) => {
          const createdPhoto = await prisma.userPhoto.create({
            data: {
              url: photo,
              userId: user.id,
            },
          });
          return createdPhoto;
        })
      );

      console.log(`Created user with id: ${user.id}`);
      return {
        user,
        account,
        tags,
        photos,
      };
    })
  );

  const generatedPairs = createdUsers.map((u) => {
    const dirtyPairs = createdUsers
      .filter((e) => {
        return Math.random() > 0.5 && e.user.id !== u.user.id;
      })
      .map((e) => {
        return e.user.id;
      });
    const confirmedPairs = dirtyPairs.filter((e) => e !== u.user.id);
    return {
      userId: u.user.id,
      pairs: confirmedPairs,
    };
  });

  const createdPairs = await Promise.all(
    generatedPairs.map(async (pair) => {
      const createdPair = await Promise.all(
        pair.pairs.map(async (p) => {
          console.log(`Creating pair: ${pair.userId} - ${p}`);
          const createdPair = await prisma.pair.create({
            data: {
              userId: pair.userId,
              pairedId: p,
              timestamp: faker.date.recent(),
            },
          });
          return createdPair;
        })
      );

      return {
        userId: pair.userId,
        pairs: createdPair,
      };
    })
  );

  const generatedMatched: {
    userId1: number;
    userId2: number;
  }[] = [];
  for (let i = 0; i < createdPairs.length; i++) {
    for (let j = 0; j < createdPairs[i].pairs.length; j++) {
      const userId1 = createdPairs[i].userId;
      const userId2 = createdPairs[i].pairs[j].pairedId;

      if (userId1 < userId2) {
        continue;
      }

      const pairToCheck = createdPairs.find((e) => e.userId === userId2);
      if (!pairToCheck) {
        continue;
      }
      for (const pair of pairToCheck.pairs) {
        if (pair.pairedId === userId1) {
          generatedMatched.push({
            userId1,
            userId2,
          });
          break;
        }
      }
    }
  }
  const createdMatched = await Promise.all(
    generatedMatched.map(async (m) => {
      console.log(`Creating match: ${m.userId1} - ${m.userId2}`);
      const createdMatch = await prisma.match.create({
        data: {
          userId1: m.userId1,
          userId2: m.userId2,
          timestamp: faker.date.recent(),
        },
      });
      return createdMatch;
    })
  );

  console.log(`Seeding finished.`);
  console.log({
    createdTags,
    createdUsers,
    createdPairs,
    createdMatched,
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
