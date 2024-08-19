import fs from 'fs';
import path from 'path';
import jsonpath from 'jsonpath';
import config from '../config/config';

export interface LogEntry {
  timestamp: string;
  workflowDir: string;
  stepNumber: number;
  fileName: string;
  responseSummary: any;
}

export function createWorkflowRunDir(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const workflowRunId = `workflow_run_${uuidv4()}`;
  const dirName = `${timestamp}_${workflowRunId}`;
  const dirPath = path.join(config.logDir, dirName);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
}

export function logResponse(response: any, stepNumber: number, workflowDir: string): void {
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

export function extractSummary(response: any): any {
  return {
    status: response.status || 'unknown',
    keyData: response.data?.importantField || null,
  };
}

export function updateIndex(entry: LogEntry): void {
  const INDEX_FILE = config.indexFile;
  const index = JSON.parse(fs.readFileSync(INDEX_FILE));
  index.push(entry);
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

export function searchByJsonPath(jsonPathQuery: string): any[] {
  const INDEX_FILE = config.indexFile;
  const index = JSON.parse(fs.readFileSync(INDEX_FILE));
  const matchingEntries: any[] = [];

  index.forEach((entry: LogEntry) => {
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