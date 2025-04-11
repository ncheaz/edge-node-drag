const { socketService } = require('../server.js');
const { CHUNKING_DONE_MESSAGE } = require('../utils/constants.js');
const { setTimeout } = require('timers/promises');
const logger = require('../utils/logger.js');

function initializeSockets() {
    socketService.on('connection', (socket) => {
        logger.info('Client connected', socket.id);

        socket.on('register', (data) => {
            const { uuid } = data;
            socket.join(uuid);
            logger.info(`Client ${socket.id} registered with UUID: ${uuid}`);
        });

        socket.on('disconnect', () => {
            logger.info('Client disconnected', socket.id);
        });
    });
}

function emitChunkEvent(chunk, sessionId) {
    socketService.to(sessionId).emit('response-chunk', { chunk });
}

function emitSKAEvent(sourceKnowledgeAssets, sessionId) {
    socketService
        .to(sessionId)
        .emit('source-knowledge-assets', { sourceKnowledgeAssets });
}

async function streamAnswer(answer, sourceKnowledgeAssets, sessionUuid) {
    emitSKAEvent(sourceKnowledgeAssets, sessionUuid);

    for (var i = 0; i < answer.length; i += 7) {
        emitChunkEvent(answer.substring(i, i + 7), sessionUuid);
        await setTimeout(45);
    }

    emitChunkEvent(CHUNKING_DONE_MESSAGE, sessionUuid);
}

async function streamLLMAnswer() {}

module.exports = {
    initializeSockets,
    emitChunkEvent,
    emitSKAEvent,
    streamAnswer,
    streamLLMAnswer
};
