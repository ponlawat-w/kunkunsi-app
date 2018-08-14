import { Injectable } from '@angular/core';
import { Project } from '../classes/project';

const HISTORY_SIZE = 100;

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private history: Project[];
  private index: number;

  constructor() {
    this.clear();
  }

  public clear(): void {
    this.index = -1;
    this.history = [];
    for (let i = 0; i < HISTORY_SIZE; i++) {
      this.history[i] = null;
    }
  }

  public undo(): Project {
    this.index--;
    if (this.index > -1 && this.index < HISTORY_SIZE) {
      return this.history[this.index];
    }
    this.index = -1;
    return null;
  }

  public redo(): Project {
    this.index++;
    if (this.index > -1 && this.index < HISTORY_SIZE - 1) {
      return this.history[this.index];
    }
    this.index = this.history.length - 1;
    return null;
  }

  public push(p: Project): void {
    const project = p.clone();

    this.index++;
    if (this.index === HISTORY_SIZE) {
      this.history.splice(1, 1);
      this.index = HISTORY_SIZE - 1;
    }

    this.history[this.index] = project;
    for (let i = this.index + 1; i < HISTORY_SIZE; i++) {
      this.history[i] = null;
    }

    localStorage.setItem('project', JSON.stringify(p));
  }
}
