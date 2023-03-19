import type { Request, Response } from "express";
import { AsyncRoute } from "../../middleware/async-wrapper";
import { nameChannelSchema, idChannelSchema, updateChannelSchema } from "../../schema/channel-schema";
import { ChannelUseCase } from "../../usecase/channel";


export const addChannel = AsyncRoute(async (req: Request, res: Response) => {
    const { name } = nameChannelSchema.parse(req.body);
    const channel = await ChannelUseCase.addChannel({ name })

    res.send({
        message: "Add channel success",
        channel,
    })
});

export const getChannel = AsyncRoute(async (req: Request, res: Response) => {
    const channel = await ChannelUseCase.getChannel(idChannelSchema.parse(req.params).id);

    res.send({
        message: "Get channel success",
        ...channel,
    })
});

export const searchChannel = AsyncRoute(async (req: Request, res: Response) => {
    const channels = await ChannelUseCase.searchChannel(nameChannelSchema.parse(req.query).name);

    res.send({
        message: "Get channel success",
        channels
    })
});

export const getChannels = AsyncRoute(async (_: Request, res: Response) => {
    const channels = await ChannelUseCase.getAll();

    res.send({
        message: "Get all channels success",
        channels,
    })
});

export const deleteChannel = AsyncRoute(async (req: Request, res: Response) => {
    const { id } = idChannelSchema.parse(req.params);
    const channel = await ChannelUseCase.deleteChannel(id);

    res.status(200).send({
        message: "Remove channel success",
        channel,
    })
});

export const updateChannel = AsyncRoute(async (req: Request, res: Response) => {
    const { id } = idChannelSchema.parse(req.params);
    const { name } = updateChannelSchema.parse(req.body);
    const channel = await ChannelUseCase.updateChannel(id, { name });

    res.send({
        message: "Update channel success",
        channel,
    })
});
