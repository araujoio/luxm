import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";

export type LogLevel = "info" | "success" | "warn" | "error" | "debug";

export class Logger {
  private static instance: Logger;
  private logDir?: string;
  private auditFile?: string;
  private sessionId: string;
  private projectRoot: string;

  private constructor() {
    this.projectRoot = process.cwd();
    this.sessionId = crypto.randomBytes(4).toString("hex").substring(0, 7);
  }

  public setProjectRoot(root: string) {
    this.projectRoot = root;
    this.logDir = undefined;
    this.auditFile = undefined;
  }

  private ensureAuditFile() {
    if (!this.logDir || !this.auditFile) {
      this.logDir = path.join(this.projectRoot, "logs");
      const now = new Date();
      const timestamp = now.toISOString().split("T")[0];
      this.auditFile = path.join(this.logDir, `${timestamp}.log`);
      
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirpSync(this.logDir);
      }
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public getSessionID(): string {
    return this.sessionId;
  }

  public getFullCommand(): string {
    return process.argv.slice(2).join(" ");
  }

  public getAuditPath(): string {
    this.ensureAuditFile();
    return path.relative(process.cwd(), this.auditFile!);
  }

  private writeToAudit(level: LogLevel, message: string) {
    this.ensureAuditFile();
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    // Strip ANSI escape codes for the audit log
    const cleanMessage = message.replace(/\u001b\[[0-9;]*m/g, "").replace(/\u001b\]8;;.*?\u001b\\/g, "").replace(/\u001b\]8;;\u001b\\/g, "");
    const logEntry = `${timestamp}  ${level.toUpperCase()}  c.command : [session : ${this.sessionId}] : ${cleanMessage}\n`;
    fs.appendFileSync(this.auditFile!, logEntry);
  }

  public formatLink(text: string): string {
    return text.replace(/\\/g, "/");
  }

  public info(message: string, isAudited: boolean = true) {
    console.log(`${message}`);
    if (isAudited) {
      this.writeToAudit("info", message);
    }
  }

  public success(message: string, isAudited: boolean = true) {
    console.log(`${chalk.green(message)}`);
    if (isAudited) {
      this.writeToAudit("success", message);
    }
  }

  public warn(message: string, isAudited: boolean = true) {
    console.log(`${chalk.yellow(message)}`);
    if (isAudited) {
      this.writeToAudit("warn", message);
    }
  }

  public error(message: string, error?: unknown, isAudited: boolean = true) {
    const errorMessage = error instanceof Error ? error.message : String(error || "");
    const fullMessage = `fatal: ${message} ${errorMessage}`;
    
    console.error(`${chalk.red(fullMessage)}`);
    if (isAudited) {
      this.writeToAudit("error", fullMessage);
      if (error instanceof Error && error.stack) {
        this.writeToAudit("debug", `Stack: ${error.stack}`);
      }
    }
  }

  public debug(message: string, data?: unknown, isAudited: boolean = true) {
    if (process.env.DEBUG) {
      console.log(`${chalk.gray(message)}`);
      if (data) console.dir(data, { depth: null, colors: true });
    }
    const auditMsg = data ? `${message} ${JSON.stringify(data)}` : message;
    if (isAudited) {
      this.writeToAudit("debug", auditMsg);
    }
  }
}

export const logger: Logger = Logger.getInstance();

