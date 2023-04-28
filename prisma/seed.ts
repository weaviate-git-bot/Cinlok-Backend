import { PrismaClient, SexType, Tag, Role, User } from "@prisma/client";
import { Sex, faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import UseCaseUser from "../src/usecase/user";

const prisma = new PrismaClient();

const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT === "true";

const generatedTags = [
  "Non-smoker",
  "Smoker",
  "Univ Student",
  "Working",
  "For Fun",
  "Serious Only",
  "Drinker",
  "Non-drinker",
  "Gamer",
  "Sporty",
  "Shy",
];

const generatedUniversity = [
  "University of Indonesia",
  "Bandung Institute of Technology",
  "Gadjah Mada University",
  "Sepuluh Nopember Institute of Technology",
  "Bogor Agricultural University",
  "Diponegoro University",
  "Padjadjaran University",
];

const generateUser = async (name: string, username: string, password: string, sex: SexType, universitySlug?: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  return {
    email: username + "@gmail.com",
    username,
    password: hashed,
    salt,
    name,
    description: "Generated User: " + name,
    dateOfBirth: faker.date.birthdate(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    profileUrl: faker.image.imageUrl(),
    sex,
    photos: [],
    universitySlug,
  }
}

const clearDB = () => {
  return prisma.$transaction([
    prisma.userTag.deleteMany({}),
    prisma.tag.deleteMany({}),
    prisma.userPhoto.deleteMany({}),
    prisma.account.deleteMany({}),
    prisma.pair.deleteMany({}),
    prisma.match.deleteMany({}),
    prisma.message.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.university.deleteMany({}),
    prisma.userChannel.deleteMany({}),
    prisma.channel.deleteMany({}),
    prisma.accountToken.deleteMany({}),
  ]);
}

const main = async () => {
  console.log(`Clearing Database ...`);
  await clearDB();

  console.log(`Start seeding ...`);

  const createdTags: Tag[] = [];
  for (const tag of generatedTags) {
    const createdTag = await prisma.tag.create({
      data: {
        tag,
      }
    })
    console.log(`Created tag with id: ${createdTag.id}`);
    createdTags.push(createdTag);
  }

  const createdUniversity = await Promise.all(
    generatedUniversity.map(async (university) => {
      console.log(`Creating university with name: ${university}`);
      const slug = university.toLowerCase().replace(/\s/g, "-");
      const createdUniversity = await prisma.university.create({
        data: {
          slug,
          name: university,
          logoFileId: null,
          channel: {
            create: {
              name: `${university}`,
            }
          }
        },
      });
      return createdUniversity;
    })
  );

  const generatedUsers = IS_DEVELOPMENT ? await Promise.all(
    Array(500)
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
          profileUrl: faker.image.imageUrl(),
          sex,
          photos,
          universitySlug: createdUniversity[Math.floor(Math.random() * createdUniversity.length)].slug as string | undefined,
        };
      })
  ) : [];

  const admin = await generateUser("Admin", "admin", "admin", SexType.MALE);
  const generatedUser1 = await generateUser("User 1", "user1", "user1", SexType.MALE, createdUniversity[0].slug);
  const generatedUser2 = await generateUser("User 2", "user2", "user2", SexType.FEMALE, createdUniversity[0].slug);
  const generatedUser3 = await generateUser("User 3", "user3", "user3", SexType.MALE, createdUniversity[0].slug);
  generatedUsers.push(admin , generatedUser1, generatedUser2, generatedUser3);

  const createdUsers = await Promise.all(
    generatedUsers.map(async (u) => {
      console.log(`Creating user: ${u.username}`);

      const temp = {
        name: u.name,
        description: u.description,
        dateOfBirth: u.dateOfBirth,
        latitude: parseFloat(u.latitude),
        longitude: parseFloat(u.longitude),
        sex: u.sex,
        profileUrl: u.profileUrl,
      }
      const created = {
        ...temp,
        universitySlug: u.universitySlug,
      }

      const user = await prisma.user.create({
        data: created,
        include: {
          university: true,
        }
      });

      console.log(`Created user: ${JSON.stringify(created)}`);

      const role = u.username === "admin" ? Role.ADMIN : Role.USER;

      const account = await prisma.account.create({
        data: {
          id: user.id,
          email: u.email,
          username: u.username,
          password: u.password,
          salt: u.salt,
          role,
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

      if (user.university) {
        // add user to university channel
        await prisma.userChannel.create({
          data: {
            userId: user.id,
            channelId: user.university.channelId,
          }
        });
      }

      console.log(`Created user with id: ${user.id}`);
      return {
        user,
        account,
        tags,
      };
    })
  );

  const createPair = async (user1: User, user2: User) => {
    const pair1 = await prisma.pair.create({
      data: {
        userId: user1.id,
        pairedId: user2.id,
        hasMatched: true,
        timestamp: new Date(),
      },
    });
    const pair2 = await prisma.pair.create({
      data: {
        userId: user2.id,
        pairedId: user1.id,
        hasMatched: true,
        timestamp: new Date(),
      },
    });

    console.log(`Created pair with id: ${pair1.id}`);
    console.log(`Created pair with id: ${pair2.id}`);
    return {
      pair1,
      pair2,
    };
  }

  const createMatch = async (user1: User, user2: User) => {
    const match = await prisma.match.create({
      data: {
        userId1: user1.id,
        userId2: user2.id,
        timestamp: new Date(),
        lastReadUser1: new Date(),
        lastReadUser2: new Date(),
      },
    })

    return match;
  }

  const user1 = createdUsers.find((u) => u.account.username === "user1")?.user;
  const user2 = createdUsers.find((u) => u.account.username === "user2")?.user;

  if (user1 && user2) {
    const pair = await createPair(user1, user2);
    const match = await createMatch(user1, user2);
  }

  console.log(`Seeding finished.`);
};

main()
  .then(async () => {
    await UseCaseUser.mixerSync();
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
