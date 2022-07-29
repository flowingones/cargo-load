export interface Command {
  names: string[];
  description: string;
  task: (...args: any[]) => string | Promise<string>;
}

export class Registry {
  private commands: Command[] = [];

  static isCommandId(name: string, command: Command): boolean {
    return !!command.names.find((cmd_name) => {
      return cmd_name === name;
    });
  }

  add(command: Command): void {
    this.commands.push(command);
  }

  find(name: string): Command | undefined {
    return this.commands.find((command) => Registry.isCommandId(name, command));
  }

  all(): Command[] {
    return [...this.commands];
  }
}
