import { assert } from "console";
import type { ITagRepository, ModelOptionalId } from "../../src/repository";
import type { Tag } from "@prisma/client";
import { TagUseCase } from "../../src/usecase/tag";
import context from "../../src/context";

class MockTagRepository implements ITagRepository {
    findAll() {
        return Promise.resolve([]) as unknown as Promise<Tag[]>;
    }
    create(_: ModelOptionalId<Tag>) {
        return Promise.resolve({} as Tag);
    }
    findFirst(_: string) {
        return Promise.resolve(null) as unknown as Promise<Tag | null>;
    }
}

test("should get tag successfully", async () => {
    const tags = [
        {
            id: 1,
            tag: "tag1",
        },
        {
            id: 2,
            tag: "tag2",
        },
        {
            id: 3,
            tag: "tag3",
        }
    ]

    const mockTagRepository = new MockTagRepository();
    mockTagRepository.findAll = () => {
        return Promise.resolve(tags)
    }

    const tagUseCase = new TagUseCase({
        ...context,
        repository: mockTagRepository,
    });
    const result = await tagUseCase.getAll();

    assert(result.length === 3);
    assert(JSON.stringify(result) === JSON.stringify(tags));
});

test("should add tag successfully", async () => {
    const tagname = "tag1"
    const id = 1;

    const mockTagRepository = new MockTagRepository();
    mockTagRepository.findFirst = (_: string) => {
        return Promise.resolve(null);
    }
    mockTagRepository.create = (tag: ModelOptionalId<Tag>) => {
        const res: Tag = {
            id,
            ...tag,
        }
        return Promise.resolve(res);
    }

    const tagUseCase = new TagUseCase({
        ...context,
        repository: mockTagRepository,
    });

    const result = await tagUseCase.addTag(tagname);

    assert(result.id === id);
    assert(result.tag === tagname);    
})

test("should return existing tag", async () => {
    const tagname = "tag1"
    const id = 1;

    const mockTagRepository = new MockTagRepository();
    mockTagRepository.findFirst = (_: string) => {
        const res: Tag = {
            id,
            tag: tagname,
        }
        return Promise.resolve(res);
    }

    const tagUseCase = new TagUseCase({
        ...context,
        repository: mockTagRepository,
    });

    const result = await tagUseCase.addTag(tagname);

    assert(result.id === id);
    assert(result.tag === tagname);
})
