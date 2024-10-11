import { socketService } from "../server.js";
import { CHUNKING_DONE_MESSAGE } from "../utils/constants.js";
import { setTimeout } from "timers/promises";
import logger from "../utils/logger.js";

export function initializeSockets() {
  socketService.on("connection", (socket) => {
    logger.info("Client connected", socket.id);

    socket.on("register", (data) => {
      const { uuid } = data;
      socket.join(uuid);
      logger.info(`Client ${socket.id} registered with UUID: ${uuid}`);
    });

    socket.on("disconnect", () => {
      logger.info("Client disconnected", socket.id);
    });
  });
}

export function emitChunkEvent(chunk, sessionId) {
  socketService.to(sessionId).emit("response-chunk", { chunk });
}

export function emitSKAEvent(sourceKnowledgeAssets, sessionId) {
  socketService
    .to(sessionId)
    .emit("source-knowledge-assets", { sourceKnowledgeAssets });
}

export async function streamAnswer(answer, sourceKnowledgeAssets, sessionUuid) {
  emitSKAEvent(sourceKnowledgeAssets, sessionUuid);

  for (var i = 0; i < answer.length; i += 7) {
    emitChunkEvent(answer.substring(i, i + 7), sessionUuid);
    await setTimeout(45);
  }

  emitChunkEvent(CHUNKING_DONE_MESSAGE, sessionUuid);
}

export async function streamLLMAnswer() {}
