import { Router } from "express";
import { channelController } from "../controller";
import { AuthMiddleware as UserM } from "../middleware/auth/user-authenticated";
import { AuthMiddleware as AdminM } from "../middleware/auth/admin-authenticated";

const ChannelRoute = Router();
ChannelRoute.get("/", channelController.getChannels);
ChannelRoute.get("/self", UserM, channelController.getUserChannels);
ChannelRoute.get("/search", channelController.searchChannel);
ChannelRoute.get("/:id", channelController.getChannel);
ChannelRoute.get("/:id/members", channelController.getChannelMembers);
ChannelRoute.post("/:id/join", UserM, channelController.addChannelMember);
ChannelRoute.post("/:id/leave", UserM, channelController.deleteChannelMember);
ChannelRoute.post("/:id/join/:userId", AdminM, channelController.addChannelMember);
ChannelRoute.post("/:id/leave/:userId", AdminM, channelController.deleteChannelMember); 
ChannelRoute.post("/", AdminM, channelController.addChannel);
ChannelRoute.put("/:id", AdminM, channelController.updateChannel);
ChannelRoute.delete("/:id", AdminM, channelController.deleteChannel);

export default ChannelRoute;
