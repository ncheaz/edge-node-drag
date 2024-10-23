// import { ontologies } from "../temp/ontologies.js";
import axios from "axios";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import { COOKIE_NAME } from "../utils/constants.js";
dotenv.config("./env");

const DRAG_USER_CONFIG_OPTION = "drag_endpoint";
const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT;

// Here you can change the LLM you are using, you can eather put anthropic or openai models. Just use the different key in the env file
const baseUserData = {
  provider: "openai",
  model: "gpt-4o-mini",
  apiKey: process.env.LLM_API_KEY,
};

export async function authenticateToken(cookie) {
  try {
    const response = await axios.get(`${AUTH_ENDPOINT}/auth/check`, {
      headers: { Cookie: `${COOKIE_NAME}=${cookie}` },
      withCredentials: "true",
    });

    const userConfig = response.data.user.config.find(
      (cfg) => cfg.option === DRAG_USER_CONFIG_OPTION
    );

    const edgeNodeParanetUAL = response.data.user.config.find(
      (cfg) => cfg.option === "edge_node_paranet_ual"
    )?.value;

    const environment = response.data.user.config.find(
      (cfg) => cfg.option === "edge_node_environment"
    )?.value;

    const runTimeNodeEndpoint = response.data.user.config.find(
      (cfg) => cfg.option === "run_time_node_endpoint"
    )?.value;

    const blockchain = response.data.user.config.find(
      (cfg) => cfg.option === "blockchain"
    )?.value;

    const vectorDBUri = response.data.user.config.find(
      (cfg) => cfg.option === "milvus_address"
    )?.value;

    const vectorDBCredentials = response.data.user.config
      .find((cfg) => cfg.option === "milvus_token")
      ?.value?.split(":");

    const vectorDBUsername = vectorDBCredentials[0];
    const vectorDBPassword = vectorDBCredentials[1];

    const vectorCollection = response.data.user.config
      .find((cfg) => cfg.option === "vector_collection")
      ?.value?.split(",");

    const embeddingModelAPIKey = response.data.user.config.find(
      (cfg) => cfg.option === "embedding_model_api_key"
    )?.value;

    const embeddingModel = response.data.user.config.find(
      (cfg) => cfg.option === "embedding_model"
    )?.value;

    const cohereKey = response.data.user.config.find(
      (cfg) => cfg.option === "cohere_key"
    )?.value;

    return {
      userData: {
        ...baseUserData,
        id: userConfig.id,
        paranetUAL: edgeNodeParanetUAL,
        environment: environment,
        endpoint: runTimeNodeEndpoint,
        blockchain: blockchain,
        vectorCollection: vectorCollection,
        vectorDBUri: vectorDBUri,
        vectorDBUsername: vectorDBUsername,
        vectorDBPassword: vectorDBPassword,
        embeddingModelAPIKey: embeddingModelAPIKey,
        embeddingModel: embeddingModel,
        cohereKey: cohereKey,
      },
    };
  } catch (error) {
    logger.error("Error fetching user config: " + error);
  }
}
