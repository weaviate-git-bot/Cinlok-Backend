import type { User } from "@prisma/client";
import context, { IContext } from "../context";
import { BadRequestError } from "../error/client-error";
import { InternalServerError } from "../error/server-error";
import type { UpdateProfilePhotoSchema } from "../schema";
import AccountUseCase from "../usecase/account";

class UserUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async getAll(): Promise<User[]> {
    const users = await this.ctx.prisma.user.findMany({
      include: {
        userPhoto: true,
        userTag: true,
        account: true,
        pair: true,
        match: true,
      }
    });
    return users;
  }

  async getProfile(id: number): Promise<User | null> {
    const user = await this.ctx.prisma.user.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            username: true,
            email: true,
          }
        },
        userPhoto: true,
        userTag: {
          include: {
            tag: true,
          }
        },
        university: {
          select: {
            name: true,
          }
        }
      }
    });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.ctx.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async updateProfile(id: number, data: any): Promise<User> {
    const { username, tags, ...rest } = data;
    if (!await this.getUserById(id)) {
      throw new BadRequestError("User not found");
    }

    if (username) {
      const account = await AccountUseCase.updateAccount(id, { username });
      if (!account) {
        throw new InternalServerError("Update username failed");
      }
    }

    const user = await this.ctx.prisma.user.update({
      where: { id },
      data: rest,
      include: {
        account: {
          select: {
            username: true,
            email: true,
          }
        },
        userTag: {
          include: {
            tag: true,
          }
        },
        userChannel: {
          include: {
            channel: true,
          }
        }
      }
    });

    if (tags) {
      // Get valid tags
      const validTags = await this.ctx.prisma.tag.findMany({
        where: {
          tag: {
            in: tags,
          },
        },
      });

      // Delete userTag if not in  validTags
      await this.ctx.prisma.$transaction(async (tx) => {
        await tx.userTag.deleteMany({
          where: {
            userId: id,
          },
        });

        // Create userTag if not exist
        await tx.userTag.createMany({
          data: validTags.map((tag) => ({
            tagId: tag.id,
            userId: id,
          })),
          skipDuplicates: true,
        });
      });

      // Update vector in mixer service
      for (const channel of user.userChannel) {
        this.ctx.mixer.upsertUser(user, validTags.map((tag) => tag.tag), channel.channel.name);
      }
    }


    if (!user) {
      throw new InternalServerError("User not found");
    }
    return user;
  }

  async updateProfilePhoto(id: number, files: UpdateProfilePhotoSchema) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    for (const key of Object.keys(files)) {
      if (files[key].length !== 1) {
        delete files[key];
      }
    }

    const oldPhotos = await this.ctx.prisma.userPhoto.findMany({
      where: {
        userId: id,
      },
    });

    const userPhotos = Object.keys(files).map(async (key) => {
      // id is last character of key
      const idx = parseInt(key[key.length - 1] as string);

      // Get oldFileId from oldPhotos url, it's using google drive url
      const oldFileId = oldPhotos.find((photo) => photo.index === idx)?.fileId;
      // delete old file from google drive
      if (oldFileId) {
        this.ctx.drive.deleteFile(oldFileId);
      }

      // Upload new file to google drive
      const fileId = await this.ctx.drive.uploadFile(files[key][0], "photos", `${user.id}-${idx}`);

      if (!fileId) {
        throw new InternalServerError("Upload file failed");
      }

      return this.ctx.prisma.userPhoto.upsert({
        where: {
          userId_index: {
            userId: user.id,
            index: idx,
          },
        },
        update: {
          fileId,
        },
        create: {
          fileId,
          userId: user.id,
          index: idx,
        },
      });
    });

    return await Promise.all(userPhotos);
  }

  async deleteProfilePhoto(id: number, index: number[]) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const photos = await this.ctx.prisma.userPhoto.findMany({
      where: {
        userId: id,
      },
    });

    const userPhotos = await this.ctx.prisma.$transaction(async (tx) => {
      const result = await tx.userPhoto.deleteMany({
        where: {
          userId: id,
          index: {
            in: index,
          },
        },
      });

      // Delete file from google drive
      photos.forEach((photo) => {
        if (index.includes(photo.index)) {
          this.ctx.drive.deleteFile(photo.fileId);
        }
      });

      return result;
    });

    return userPhotos;
  }

  async mixerSync() {
    const users = await this.ctx.prisma.user.findMany({
      include: {
        userTag: {
          include: {
            tag: true,
          }
        },
        userChannel: {
          include: {
            channel: true,
          }
        }
      }
    });

    // const mixerUser = users.map((user) => {
    //   if (!user.userChannel[0]) {
    //     return null;
    //   }
    //   return {
    //     id: `${user.id}`,
    //     words: user.userTag.map((userTag) => userTag.tag.tag),
    //     channel: user.userChannel[0].channel.name,
    //   };
    // }).reduce((acc, cur) => {
    //   if (cur) {
    //     acc.push(cur);
    //   }
    //   return acc;
    // }, [] as any[]);

    await this.ctx.mixer.clearChannel();
    await this.ctx.mixer.upsertBatch(users);
  }
}

export default new UserUseCase(context);
export { UserUseCase };