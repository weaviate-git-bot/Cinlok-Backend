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
      }
    });
    if (!user) {
      throw new BadRequestError("User not found")
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
      throw new BadRequestError("User not found")
    }

    if (username) {
      const account = await AccountUseCase.updateAccount(id, { username });
      if (!account) {
        throw new InternalServerError("Update username failed");
      }
    }

    if (tags) {
      // Get valid tags
      const validTags = await this.ctx.prisma.tag.findMany({
        where: {
          tag: {
            in: tags,
          },
        },
      });

      // Create userTag if not exist
      await this.ctx.prisma.userTag.createMany({
        data: validTags.map((tag) => ({
          tagId: tag.id,
          userId: id,
        })),
        skipDuplicates: true,
      })
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
        userTag: true,
      }
    });
    if (!user) {
      throw new InternalServerError("User not found");
    }
    return user;
  }

  async updateProfilePhoto(id: number, files: UpdateProfilePhotoSchema) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new BadRequestError("User not found")
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
}

export default new UserUseCase(context);
export { UserUseCase };