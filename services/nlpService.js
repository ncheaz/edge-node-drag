import logger from "../utils/logger.js";

export async function processQuestionChatDKG(
  llmService,
  question,
  chatHistory,
  userOntologies
) {
  // Create standalone question
  logger.info("Creating standalone question for " + question);
  const standaloneQuestion = await llmService.createStandaloneQuestion(
    question,
    chatHistory
  );
  logger.info("Standalone question: " + standaloneQuestion);

  // Extract ontologies
  logger.info("Extracting ontologies for " + standaloneQuestion);
  const ontologies = await llmService.getOntologies(
    standaloneQuestion,
    userOntologies
  );
  logger.info("Ontologies: " + ontologies);

  // Create SPARQL queries
  logger.info("Creating SPARQL queries...");
  const sparqlQueries = await llmService.createSparqlQueries(
    question,
    standaloneQuestion,
    ontologies
  );
  logger.info("SPARQL queries: " + sparqlQueries);

  // let sparqlQueriesJson = sparqlQueries.replace(/'''/g, '"').replace(/'/g, '"').replace(/\n/g, '');
  // sparqlQueriesJson = JSON.parse(sparqlQueriesJson)

  return { standaloneQuestion, sparqlQueries: JSON.parse(sparqlQueries) };
}

export async function processQuestion(llmService, question, chatHistory) {
  // Create standalone question
  logger.info("Creating standalone question for " + question);
  const standaloneQuestion = await llmService.createStandaloneQuestion(
    question,
    chatHistory
  );
  logger.info("Standalone question: " + standaloneQuestion);

  return { standaloneQuestion };
}
