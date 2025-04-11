function validateRequestParams(req, res, next) {
    const { question, chatHistory } = req.body;

    // Validate 'question' parameter
    if (typeof question !== 'string' || question.trim() === '') {
        return res.status(400).json({
            error: "Invalid 'question' parameter. It must be a non-empty string."
        });
    }

    // Validate 'chatHistory' parameter if present
    if (chatHistory !== undefined && chatHistory !== null) {
        if (!Array.isArray(chatHistory)) {
            return res
                .status(400)
                .json({ error: "'chatHistory' must be an array." });
        }

        for (const entry of chatHistory) {
            if (
                typeof entry !== 'object' ||
                entry === null ||
                typeof entry?.question !== 'string' ||
                typeof entry?.answer !== 'string'
            ) {
                return res.status(400).json({
                    error: "'chatHistory' must be an array of objects with 'question' and 'answer' as strings."
                });
            }
        }
    }

    next();
}

module.exports = {
    validateRequestParams
};
