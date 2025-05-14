import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { MongoClient } from "mongodb";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { Annotation } from "@langchain/langgraph";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large"
});

const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
const collection = client
  .db(process.env.MONGODB_ATLAS_DB_NAME)
  .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME);

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: collection,
  indexName: "vector_index",
  textKey: "text",
  embeddingKey: "embedding",
});

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

/**
 * - fetch document
 * - split documet content
 * - generate embeddings
 * - store in mongodb
 */

export const localFileContentIndexing = async () => {
    try {
        // TO-DO: make dynamic
        const filePath = "./ai_agents_overview.pdf";
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        // split the Document into chunks for embedding and vector storage
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const allSplits = await splitter.splitDocuments(docs);
        const storedEmbeddings = await vectorStore.addDocuments(allSplits);

        return {
            storedEmbeddings
        }
    } catch (err){
        return {message: err.message}
    }
}

/**
 * - fetch document
 * - split documet content
 * - generate embeddings
 * - store in mongodb
 */

export const fetchAnswer = async ({chatUserInput}) => {
    try {
        // perform similarity checks and return context
        // https://js.langchain.com/docs/tutorials/rag#state
        const retrieve = async (state: typeof InputStateAnnotation.State) => {
            const retrievedDocs = await vectorStore.similaritySearch(state.question);
            return { context: retrievedDocs };
        };
        
        const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");
        
        // create prompt using fetched context + user input
        const generate = async (state: typeof StateAnnotation.State) => {
            const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
            const messages = await promptTemplate.invoke({
            question: state.question,
            context: docsContent,
            });
            const response = await llm.invoke(messages);
            return { answer: response.content };
        };
        
        // connect the retrieval and generation steps into a single sequence (graph object)
        // define the nodes () and the edges
        const graph = new StateGraph(StateAnnotation)
            .addNode("retrieve", retrieve)
            .addNode("generate", generate)
            .addEdge("__start__", "retrieve")
            .addEdge("retrieve", "generate")
            .addEdge("generate", "__end__")
            .compile();

        let inputs = { question: chatUserInput };
        const result = await graph.invoke(inputs);
        return {
            response: result["answer"]
        }
    } catch (err){
        return {message: err.message}
    }
}
