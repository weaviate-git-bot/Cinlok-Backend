import context, { IContext } from "../context";
import { BadRequestError } from "../error/client-error";
import { ChannelUseCase } from "./channel";
import { IUniversityRepository, universityRepository } from "../repository";

interface IUniversityContext extends IContext {
  repository: IUniversityRepository;
}

class UniversityUseCase {
  private ctx: IUniversityContext;

  constructor(context: IUniversityContext) {
    this.ctx = context;
  }

  async getAll(name: string) {
    const universities = await this.ctx.repository.findByName(name);
    return universities;
  }

  async getUniversityBySlug(slug: string) {
    const university = await this.ctx.repository.findBySlug(slug);
    if (!university) throw new BadRequestError("University not found");
    return university;
  }

  async createUniversity(name: string, slug?: string) {
    if (!slug) slug = name.toLowerCase().replace(/\s/g, "-");

    const university = await this.ctx.repository.create(name, slug);
    return university;
  }

  async updateUniversity(slug: string, name: string) {
    const university = await this.ctx.repository.update(slug, { name });
    return university;
  }

  async updateUniversityLogo(slug: string, logo: Express.Multer.File) {
    const university = await this.ctx.repository.findBySlug(slug);
    if (!university) throw new BadRequestError("University not found");
    if (university.logoFileId) await this.ctx.drive.deleteFile(university.logoFileId);
    const fileId = await this.ctx.drive.uploadFile(logo, "univ_logo", slug);
    const updatedUniversity = await this.ctx.repository.update(slug, { logoFileId: fileId });
    return updatedUniversity;
  }

  async deleteUniversityLogo(slug: string) {
    const university = await this.ctx.prisma.university.findUnique({ where: { slug } });
    if (!university) throw new BadRequestError("University not found");
    if (university.logoFileId) await this.ctx.drive.deleteFile(university.logoFileId);
    const updatedUniversity = await this.ctx.prisma.university.update({
      where: { slug },
      data: { logoFileId: null },
    });
    return updatedUniversity;
  }

  async deleteUniversity(slug: string) {
    const university = await this.ctx.prisma.university.findUnique({ where: { slug } });
    if (!university) throw new BadRequestError("University not found");
    if (university.logoFileId) await this.ctx.drive.deleteFile(university.logoFileId);
    const deletedUniversity = await this.ctx.prisma.$transaction(async (tx) => {
      const deletedUniversity = await tx.university.delete({ where: { slug } });
      await ChannelUseCase.deleteChannel(university.channelId);
      return deletedUniversity;
    });
    return deletedUniversity;
  }
}

export default new UniversityUseCase({
  ...context,
  repository: universityRepository,
});
export { UniversityUseCase };