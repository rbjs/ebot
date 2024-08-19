const fs = require('fs');
const path = require('path');
const jsonpath = require('jsonpath');
const { v4: uuidv4 } = require('uuid');

const INDEX_FILE = path.join(__dirname, '../../logs', 'index.json');

if (!fs.existsSync(INDEX_FILE)) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify([]));
}

function createWorkflowRunDir() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const workflowRunId = `workflow_run_${uuidv4()}`;
  const dirName = `${timestamp}_${workflowRunId}`;
  const dirPath = path.join(__dirname, '../../logs', dirName);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
}

function logResponse(response, stepNumber, workflowDir) {
  const fileName = `${stepNumber}_response.json`;
  const filePath = path.join(workflowDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(response, null, 2));

  updateIndex({
    timestamp: new Date().toISOString(),
    workflowDir,
    stepNumber,
    fileName,
    responseSummary: extractSummary(response),
  });
}

function extractSummary(response) {
  return {
    status: response.status || 'unknown',
    keyData: response.data?.importantField || null,
  };
}

function updateIndex(entry) {
  const index = JSON.parse(fs.readFileSync(INDEX_FILE));
  index.push(entry);
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

function searchByJsonPath(jsonPathQuery) {
  const index = JSON.parse(fs.readFileSync(INDEX_FILE));
  const matchingEntries = [];

  index.forEach((entry) => {
    const filePath = path.join(entry.workflowDir, entry.fileName);
    const response = JSON.parse(fs.readFileSync(filePath));
    const results = jsonpath.query(response, jsonPathQuery);
    if (results.length > 0) {
      matchingEntries.push({
        entry,
        matchedValues: results,
      });
    }
  });

  return matchingEntries;
}

module.exports = async ({ kafkaService, restService, logger }) => {
  logger.info('Starting workflow');

  const workflowDir = createWorkflowRunDir();

  await kafkaService.publish('topic1', 'Hello Kafka');
  logResponse({ data: 'example', status: 'success', importantField: 'abc123' }, 1, workflowDir);

  const restResponse = await restService.makeRequest('/endpoint', { key: 'value' });
  logResponse(restResponse, 2, workflowDir);

  logger.info('Workflow completed');

  // Example search
  const jsonPathQuery = '$.data.deeplyNestedField[?(@.attribute == "desiredValue")]';
  const searchResults = searchByJsonPath(jsonPathQuery);

  logger.info('Search Results:', searchResults);
};