import { assert } from "console";
import type { IUniversityRepository, AllOptional } from "../../src/repository";
import type { University } from "@prisma/client";
import { UniversityUseCase } from "../../src/usecase/university";
import context from "../../src/context";
import { BadRequestError } from "../../src/error/client-error";

class MockUniversityRepository implements IUniversityRepository {
    findByName(_: string): Promise<University[]> {
        return Promise.resolve([]) as unknown as Promise<University[]>;
    }
    findBySlug(_: string): Promise<University | null> {
        return Promise.resolve(null) as unknown as Promise<University | null>;
    }
    create(_1: string, _2: string): Promise<University> {
        return Promise.resolve({} as University);
    }
    update(_1: string, _2: AllOptional<University>): Promise<University> {
        return Promise.resolve({} as University);
    }
}

test("should get university successfully", async () => {
    const filtername = "university";
    const universities: University[] = [
        {
            name: "university1",
            slug: "university1",
            logoFileId: "logoFileId1",
            channelId: 1,
        },
        {
            name: "university2",
            slug: "university2",
            logoFileId: "logoFileId2",
            channelId: 2,
        },
        {
            name: "university3",
            slug: "university3",
            logoFileId: "logoFileId3",
            channelId: 3,
        }
    ]

    const mockUniversityRepository = new MockUniversityRepository();
    mockUniversityRepository.findByName = (_: string) => {
        return Promise.resolve(universities)
    }

    const universityUseCase = new UniversityUseCase({
        ...context,
        repository: mockUniversityRepository,
    });
    const result = await universityUseCase.getAll(filtername);

    assert(result.length === 3);
    assert(JSON.stringify(result) === JSON.stringify(universities));
})

test("should get university by slug successfully", async () => {
    const slug = "university1";
    const university: University = {
        name: "university1",
        slug: "university1",
        logoFileId: "logoFileId1",
        channelId: 1,
    }

    const mockUniversityRepository = new MockUniversityRepository();
    mockUniversityRepository.findBySlug = (_: string) => {
        return Promise.resolve(university)
    }

    const universityUseCase = new UniversityUseCase({
        ...context,
        repository: mockUniversityRepository,
    });
    const result = await universityUseCase.getUniversityBySlug(slug);

    assert(JSON.stringify(result) === JSON.stringify(university));
})

test("should throw error when university not found", async () => {
    const slug = "university1";

    const mockUniversityRepository = new MockUniversityRepository();
    mockUniversityRepository.findBySlug = (_: string) => {
        return Promise.resolve(null)
    }

    const universityUseCase = new UniversityUseCase({
        ...context,
        repository: mockUniversityRepository,
    });

    await expect(universityUseCase.getUniversityBySlug(slug)).rejects.toThrow(BadRequestError);
})

test("should create university successfully with slug", async () => {
    const name = "university1";
    const slug = "university1";
    const university: University = {
        name: "university1",
        slug: "university1",
        logoFileId: "logoFileId1",
        channelId: 1,
    }

    const mockUniversityRepository = new MockUniversityRepository();
    mockUniversityRepository.create = (_1: string, _2: string) => {
        return Promise.resolve(university)
    }

    const universityUseCase = new UniversityUseCase({
        ...context,
        repository: mockUniversityRepository,
    });
    const result = await universityUseCase.createUniversity(name, slug);

    assert(JSON.stringify(result) === JSON.stringify(university));
})

test("should create university successfully without slug", async () => {
    const name = "Institut Teknologi Bandung";
    const university: University = {
        name,
        slug: "institut-teknologi-bandung",
        logoFileId: "logoFileId1",
        channelId: 1,
    }

    const mockUniversityRepository = new MockUniversityRepository();
    mockUniversityRepository.create = (_1: string, _2: string) => {
        return Promise.resolve(university)
    }

    const universityUseCase = new UniversityUseCase({
        ...context,
        repository: mockUniversityRepository,
    });
    const result = await universityUseCase.createUniversity(name);

    assert(JSON.stringify(result) === JSON.stringify(university));
})

test("should update university successfully", async () => {
    const name = "university1";
    const slug = "university1";
    const university: University = {
        name,
        slug,
        logoFileId: "logoFileId1",
        channelId: 1,
    }

    const mockUniversityRepository = new MockUniversityRepository();
    mockUniversityRepository.findBySlug = (_: string) => {
        return Promise.resolve(university)
    }
    mockUniversityRepository.update = (_1: string, _2: AllOptional<University>) => {
        return Promise.resolve(university)
    }

    const universityUseCase = new UniversityUseCase({
        ...context,
        repository: mockUniversityRepository,
    });
    const result = await universityUseCase.updateUniversity(slug, name);

    assert(JSON.stringify(result) === JSON.stringify(university));
})

test("should throw error when update logo university not found", async () => {
    const slug = "university1";

    const mockUniversityRepository = new MockUniversityRepository();
    mockUniversityRepository.findBySlug = (_: string) => {
        return Promise.resolve(null)
    }

    const universityUseCase = new UniversityUseCase({
        ...context,
        repository: mockUniversityRepository,
    });

    await expect(universityUseCase.updateUniversityLogo(slug, {} as any)).rejects.toThrow(BadRequestError);
})

